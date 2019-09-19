<template>
  <div class="reviewer">

    <template v-if="id && school">

      <SchoolBrief class="brief" :data="school" @rename="handleRename" />

      <div v-for="round in rounds" :key="round">
        <hr/>
        <BillingDetail
          class="billing"
          :school="id"
          :round="round"
          show-alipay-amount
        />
        <PaymentList :payments="(payments || []).filter($ => $.round === round)" />

        <div class="controls" v-if="canReviewPayment && school && school.stage === `${round}.paid`">
          <el-button-group>
            <el-button
              type="danger"
              :loading="busy"
              icon="el-icon-close"
              @click="reject"
            > 不通过 </el-button>
            <el-button
              type="success"
              :loading="busy"
              icon="el-icon-check"
              @click="confirm"
            > 通过 </el-button>
          </el-button-group>
        </div>
      </div>
    </template>

  </div>
</template>

<script>
import BillingDetail from '../../School/components/BillingDetail'
import SchoolBrief from './SchoolBrief'
import PaymentList from './PaymentList'
import roundText from '@/lib/round-text'
import { hasAccess } from '@/lib/access'

export default {
  name: 'payment-review',
  components: {
    BillingDetail,
    SchoolBrief,
    PaymentList,
  },
  props: {
    id: { type: String, default: null },
  },
  computed: {
    rounds() {
      const hasSecondRound = Object.keys(this.school && this.school.seat['2'] || {}).length
      const stage = this.school && this.school.stage
      const round = this.school && this.school.stage[0]
      if (stage === '1.complete') {
        return hasSecondRound ? ['2', '1'] : ['1']
      } else {
        if (round === '1') return ['1']
        if (round === '2') return ['2', '1']
        return ['2', '1']
      }
    },
    canReviewPayment() {
      return hasAccess(this.$store.getters['user/access'], 'finance')
    }
  },
  data: () => ({
    busy: false,
    loading: true,
    school: null,
    payments: null,
  }),
  methods: {
    notifyError(e, title='操作失败') {
      this.$notify({
        type: 'error',
        title,
        message: e.message,
        duration: 0
      })
    },
    async fetch() {
      if (this.id) {
        this.loading = true
        this.school = null
        this.payments = null
        try {
          let [ school, payments ] = await Promise.all([
            this.$agent.get('/api/schools/'+this.id).body(),
            this.$agent.get('/api/schools/'+this.id+'/payments/').query({ state: 'all' }).body()
          ])
          this.school = school
          this.payments = payments
        } catch(e) {
          this.notifyError(e, '获取失败')
          this.school = null
          this.payments = null
        } finally {
          this.loading = false
        }
      } else {
        this.school = null
        this.payments = null
      }
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
        this.$emit('update', this.school.id, { stage: this.school.stage.replace('.paid', '.complete') })
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
        this.$emit('update', this.school.id, { stage: this.school.stage.replace('.paid', '.payment') })
      } catch(e) {
        this.notifyError(e, '审核失败')
      } finally {
        this.busy = false
      }
    },
    handleRename({name, identifier}) {
      this.$emit('update', this.school.id, {name: identifier})
      this.fetch()
    }
  },
  filters: {
    roundText
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
.brief
  max-width: 70ch
.billing
  display: block
  margin: 0 auto
  min-width: 640px
  width: 80%
.controls
  margin: 1em 0
  display: block
  text-align: center
.reviewer
  padding-bottom: 3em
hr
  border-width: 1px
  border-style: solid
  border-color: #C0CCDA
  margin: 2rem 0
</style>
