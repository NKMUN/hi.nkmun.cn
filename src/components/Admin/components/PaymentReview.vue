<template>
  <div class="reviewer">

    <template v-if="id && school">

      <SchoolBrief class="brief" :data="school" />

      <BillingDetail
        class="billing"
        v-if="id"
        :school="id"
        :round="round"
      />

      <PaymentList :payments="payments || []" v-loading="!payments" />

      <div class="controls" v-if="school && school.stage.endsWith('.paid')">
        <el-button-group>
          <el-button
            type="danger"
            :loading="busy"
            icon="circle-cross"
            @click="reject"
          > 不通过 </el-button>
          <el-button
            type="success"
            :loading="busy"
            icon="circle-check"
            @click="confirm"
          > 通过 </el-button>
          <el-button
            type="info"
            :loading="busy"
            @click="next"
          > 下一个 <i class="el-icon-arrow-right el-icon--right"> </el-button>
        </el-button-group>
      </div>

    </template>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BillingDetail from '../../School/components/BillingDetail'
import SchoolBrief from './SchoolBrief'
import PaymentList from './PaymentList'

export default {
  name: 'payment-review',
  components: {
    BillingDetail,
    SchoolBrief,
    PaymentList,
  },
  props: {
    id: { type: String, default: null },
    round: { type: String, default: '1' },
  },
  computed: {
    ... mapGetters({
      authorization: 'user/authorization'
    }),
  },
  data: () => ({
    busy: false,
    loading: true,
    school: null,
    billing: null,
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
            this.$agent.get('/api/schools/'+this.id)
              .set( ... this.authorization )
              .then( res => res.body ),
            this.$agent.get('/api/schools/'+this.id+'/payments/')
              .set( ... this.authorization )
              .then( res => res.body )
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
        } = await this.$agent.patch('/api/schools/'+this.id+'/payments/')
                  .set( ... this.authorization )
                  .send({ confirm: 1 })
        this.$notify({
          type: status === 200 ? 'success' : 'warning',
          title: '已审核',
          message: status === 200 ? '通知邮件已发送' : '通知邮件未能成功发送：'+body.message,
          duration: 5000,
        })
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
        } = await this.$agent.patch('/api/schools/'+this.id+'/payments/')
                  .set( ... this.authorization )
                  .send({ reject: 1, reason: value })
        this.$notify({
          type: status === 200 ? 'success' : 'warning',
          title: '已审核',
          message: status === 200 ? '通知邮件已发送' : '通知邮件未能成功发送',
          duration: 5000,
        })
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
    id(val) {
      this.$nextTick( () => this.fetch() )
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../../style/flex"
h3
  text-align: center
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
</style>