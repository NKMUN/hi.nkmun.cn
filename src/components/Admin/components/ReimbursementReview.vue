<template>
  <div class="reviewer">
    <template v-if="id && reimbursement">

      <div class="wrapper">
        <h4> 报销申请 </h4>

        <div class="section basic-info">
          <SimpleField name="姓名" :value="g('contact.name')" />
          <SimpleField name="职务" :value="g('role')" />
          <SimpleField name="邮箱" :value="g('contact.email')" />
        </div>

        <div class="section payment-method">
          <SimpleField name="支付方式" :value="paymentMethodText(g('payment_method'))" />

          <template v-if="g('payment_method') === 'bank'">
            <SimpleField name="银行账户" :value="g('bank.account')" />
            <SimpleField name="开户行" :value="g('bank.branch')" />
            <SimpleField name="开户人" :value="g('bank.name')" />
          </template>

          <template v-if="g('payment_method') === 'alipay'">
            <SimpleField name="支付宝账号" :value="g('alipay.account')" />
            <SimpleField name="姓名" :value="g('alipay.name')" />
          </template>
        </div>

        <div class="section trip-info">
          <SimpleField name="学校所在地" :value="g('school_region', []).join(' / ') || '未选'" />
          <SimpleField name="家庭所在地" :value="g('residence_region', []).join(' / ') || '未选'" />
        </div>

      </div>

      <div class="wrapper section trip-wrapper">
        <div class="trip inbound">
          <h5> <icon name="sign-in-alt" /> 来程 <ReimbursementReviewState :state="g('inbound.state')"/> </h5>
          <SimpleField name="出发地" :value="g('inbound.region', []).join(' / ') || '未选'" />
          <SimpleField name="金额">
             <span :class="{ 'exceed-upperbound': exceedUpperbound }">{{ currencyText(g('inbound.cost')) }}</span>
          </SimpleField>
          <SimpleField name="备注" :value="g('inbound.note', '')" />
          <!-- <SimpleField name="审核" :value="g('inbound.review_note', '')" /> -->
          <ImageListView :images="g('inbound.credential', [])" width="240px" height="240px" />

          <ReimbursementReviewButtons
            :state="g('inbound.state')"
            :can-review="canReviewReimbursement"
            :busy="busy"
            @approve="approveTrip('inbound')"
            @reject="rejectTrip('inbound')"
            @complete="completeTrip('inbound')"
          />
        </div>

        <div class="trip outbound">
          <h5> <icon name="sign-out-alt" /> 回程 <ReimbursementReviewState :state="g('outbound.state')"/> </h5>
          <SimpleField name="目的地" :value="g('outbound.region', []).join(' / ') || '未选'" />
          <SimpleField name="金额">
             <span :class="{ 'exceed-upperbound': exceedUpperbound }">{{ currencyText(g('outbound.cost')) }}</span>
          </SimpleField>
          <SimpleField name="备注" :value="g('outbound.note', '')" />
          <!-- <SimpleField name="审核" :value="g('outbound.review_note', '')" /> -->
          <ImageListView :images="g('outbound.credential', [])" width="240px" height="240px" />

          <ReimbursementReviewButtons
            :state="g('outbound.state')"
            :can-review="canReviewReimbursement"
            :busy="busy"
            @approve="approveTrip('outbound')"
            @reject="rejectTrip('outbound')"
            @complete="completeTrip('outbound')"
          />
        </div>
      </div>

    </template>
  </div>
</template>

<script>
import { hasAccess } from '@/lib/access'
import SimpleField from '@/components/SimpleField'
import { get } from '@/lib/property-accessor'
import ImageListView from './ImageListView'
import ReimbursementReviewState from './ReimbursementReviewState'
import ReimbursementReviewButtons from './ReimbursementReviewButtons'
import 'vue-awesome/icons/sign-in-alt'
import 'vue-awesome/icons/sign-out-alt'

const REIMBURSEMENT_UPPER_BOUND = 800

export default {
  name: 'reimbursement-review',
  components: {
    SimpleField,
    ImageListView,
    ReimbursementReviewState,
    ReimbursementReviewButtons,
  },
  props: {
    id: { type: String, default: null },
  },
  computed: {
    canReviewReimbursement() {
      return hasAccess(this.$store.getters['user/access'], 'finance')
    },
    exceedUpperbound() {
      return this.g('inbound.cost', 0) + this.g('outbound.cost', 0) >= REIMBURSEMENT_UPPER_BOUND
    }
  },
  data: () => ({
    busy: false,
    reimbursement: null,
  }),
  methods: {
    g(attr, def = '') {
      return get(this.reimbursement, attr, def)
    },
    paymentMethodText(str) {
      switch(str) {
        case 'cash': return '现金'
        case 'bank': return '银行转账'
        case 'alipay': return '支付宝'
        default: return '未选'
      }
    },
    currencyText(num) {
      if (num || num === 0) {
        return `¥ ${Number(num).toFixed(2)}`
      } else {
        return '未填'
      }
    },
    notifyError(e, title='操作失败') {
      this.$notify({
        type: 'error',
        title,
        message: e.message,
        duration: 0
      })
    },
    fetch() {
      if (this.id) {
        this.busy = true
        this.$agent.get(`/api/daises/${this.id}/reimbursement`)
          .then(
            resp => this.reimbursement = resp.body,
            err => this.$notifyError(err, '获取失败')
          )
          .then(_ => this.busy = false)
      } else {
        this.reimbursement = null
      }
    },
    updateState(reimbursement) {
      this.reimbursement = reimbursement
      this.$emit('update-list', {
        id: reimbursement.id,
        inbound_state: get(reimbursement, 'inbound.state'),
        outbound_state: get(reimbursement, 'outbound.state')
      })
    },
    approveTrip(tripKey) {
      this.busy = true
      return this.$agent.post(`/api/daises/${this.id}/reimbursement/process`).send({ trip: tripKey, approve: 1 })
        .then(
          resp => this.updateState(resp.body),
          err => this.$message({
            type: 'error',
            message: '操作失败：' + err.message
          })
        )
        .then(_ => this.busy = false)
    },
    rejectTrip(tripKey) {
      this.busy = true
      return this.$prompt('请输入审核不通过的理由：', '提示', {inputPattern: /.+/, inputErrorMessage: '请输入理由'})
        .then(
          ({value}) => {
            this.$agent.post(`/api/daises/${this.id}/reimbursement/process`).send({ trip: tripKey, reject: 1, review_note: value })
              .then(
                resp => this.updateState(resp.body),
                err => this.$message({
                  type: 'error',
                  message: '操作失败：' + err.message
                })
              )
          },
          _ => null
        )
        .then(_ => this.busy = false)

    },
    completeTrip(tripKey) {
      this.busy = true
      return this.$agent.post(`/api/daises/${this.id}/reimbursement/process`).send({ trip: tripKey, confirm_payment: 1 })
        .then(
          resp => this.updateState(resp.body),
          err => this.$message({
            type: 'error',
            message: '操作失败：' + err.message
          })
        )
        .then(_ => this.busy = false)
    },
    async confirm() {
      this.busy = true
      try {
        let {
          status,
          body
        } = await this.$agent.patch('/api/schools/'+this.id+'/payments/').send({ confirm: 1 })
        this.$notify({
          type: status === 200 ? 'success' : 'warning',
          title: '已审核',
          message: status === 200 ? '通知邮件已发送' : '通知邮件未能成功发送：'+body.message,
          duration: 5000,
        })
        this.school.stage = this.school.stage.replace('.paid', '.complete')
        this.processed()
        this.next()
      } catch(e) {
        this.notifyError(e, '审核失败')
      } finally {
        this.busy = false
      }
    },
    async reject() {
      let { value } = await this.$prompt('请输入审核不通过的理由：', '提示', {inputPattern: /.+/, inputErrorMessage: '请输入理由'})
                            .catch( () => ({ value: null }) )    // catch cancel input
      if (value === null)
        return
      this.busy = true
      try {
        let {
          status
        } = await this.$agent.patch('/api/schools/'+this.id+'/payments/').send({ reject: 1, reason: value })
        this.$notify({
          type: status === 200 ? 'success' : 'warning',
          title: '已审核',
          message: status === 200 ? '通知邮件已发送' : '通知邮件未能成功发送',
          duration: 5000,
        })
        this.school.stage = this.school.stage.replace('.paid', '.payment')
        this.processed()
        this.next()
      } catch(e) {
        this.notifyError(e, '审核失败')
      } finally {
        this.busy = false
      }
    },
    async processed() {
      this.$emit('processed', this.id)
    },
    async next() {
      this.$emit('next', this.id)
    },
  },
  mounted() {
    return this.fetch()
  },
  watch: {
    id() {
      this.$nextTick( () => this.fetch() )
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../../style/flex"
h3, h4
  text-align: center
h5
  flex-horz: center center
  svg
    margin-right: .8ch
    color: #909399
.simple-field
  .name
    display: inline-block
    width: 11ch
    text-align: right
    margin-right: 2ch
    color: #909399
.controls
  margin: 1em 0
  display: block
  text-align: center
.reviewer
  padding-bottom: 3em
  flex-vert: flex-start center
  > *
    flex-shrink: 0
.section
  margin-top: 1em
.trip-wrapper
  flex-horz: center flex-start
  .trip
    flex-shrink: 0
    margin: 0 2ch
    .simple-field
      .name
        width: 6.5ch
      .value
        max-width: 15ch
        vertical-align: top
        display: inline-block
        word-break: break-word
  .el-button-group
    flex-horz: center flex-start
  .exceed-upperbound
    color: #f56c6c
  .image-list-view
    max-width: 260px
    margin: 1em 0
</style>
