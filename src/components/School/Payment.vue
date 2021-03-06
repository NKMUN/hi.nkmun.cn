<template>
  <div class="payment">
    <h3>{{ getRoundText(round) }}缴费</h3>

    <BillingDetail
      class="payment-detail"
      :school="school"
      :round="round"
      :round-text="getRoundText(round)"
      @loaded="handleBillsLoaded"
    />

    <PaymentMethods class="payment-methods" v-if="billsLoaded" :raw-amount="totalAmount" />

    <div class="upload" v-if="billsLoaded">
      <h4>凭证上传</h4>

      <ul class="note">
        <li>可上传：银行回执（照片） 或 App内转账截图</li>
        <li>请包含：<b>转账人、金额、时间</b></li>
        <li class="constraint-text">只能上传 <b>jpg / png</b> 文件，每个文件不超过 <b>2MB</b></li>
      </ul>

      <MultipleImageUpload
        v-model="receipts"
        action="/api/images/"
        accept="image/jpeg, image/png, .jpg, .jpeg, .png"
        :before-upload="beforeUpload"
        :data="{
          meta: JSON.stringify({
            flow: 'payment',
            type: 'payment_recipt',
            user: user,
            school: school,
            payment_round: round
          })
        }"
      >
        <i class="el-icon-plus" />
      </MultipleImageUpload>

      <el-button size="large" type="primary" @click="handleSubmit" :busy="busy"> 提交 </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PaymentMethods from './components/PaymentMethods'
import BillingDetail from './components/BillingDetail'
import store from '@/store/index'
import roundText from '@/lib/round-text'
import MultipleImageUpload from '@/components/form/MultipleImageUpload'

export default {
  name: 'payment',
  components: {
    PaymentMethods,
    BillingDetail,
    MultipleImageUpload,
  },
  computed: {
    ... mapGetters({
      user: 'user/user',
      school: 'user/school',
      token: 'user/token',
      type: 'school/type',
      round: 'school/round',
    }),
    authorization() {
      return `Bearer ${this.$store.getters['user/token']}`
    },
    baseRoute() {
      return this.type === 'school' ? '/school/'
           : this.type === 'individual' ? '/individual/'
           : '/'
    }
  },
  data: () => ({
    billsLoaded: false,
    receipts: [],
    busy: false,
    totalAmount: null
  }),
  methods: {
    async fetchUploadedReceipts() {
      const payments = await this.$agent
        .get(`/api/schools/${this.school}/payments/`)
        .query({ round: this.round })
        .body()
      this.receipts = payments.reduce(
        (ret, cur) => [
          ...ret,
          ...(cur.images || [])
        ],
        []
      )
    },
    beforeUpload(file) {
      if ( ! (file.type === 'image/jpeg' || file.type === 'image/png') ) {
        this.$message({
          message: '图片必须是 png 或 jpg 格式',
          type: 'error'
        })
        return false
      }
      if ( file.size / 1024 / 1024 > 2 ) {
        this.$message({
          message: '图片必须小于 2MB',
          type: 'error'
        })
        return false
      }
      return true
    },
    handleSubmit() {
      if (!this.receipts || this.receipts.length === 0) {
        this.$confirm('尚未上传转账凭证，确认提交？', '确认？', { type: 'warning' })
            .then(
              () => this.confirmReceipts(),
              () => null // nop
            )
      } else {
        this.confirmReceipts()
      }
    },
    async confirmReceipts() {
      this.busy = true
      try {
        await this.$agent.post(`/api/schools/${this.school}/payments/`).send({ images: this.receipts })
        const {
          body
        } = await await this.$agent.post(`/api/schools/${this.school}/progress`).send({ confirmPayment: true })
        this.$message({
          type: 'success',
          message: '缴费凭证已提交，请等待审核',
        })
        this.$router.replace(this.baseRoute)
        this.$store.commit('school/stage', body.nextStage)
      } catch(err) {
        this.$message({
          type: 'error',
          message: '提交失败，请稍后再试：' + err.message,
        })
      } finally {
        this.busy = false
      }
    },
    getRoundText(str) {
      return this.type === 'individual' ? '个人' : roundText(str)
    },
    handleBillsLoaded(bills, total) {
      this.billsLoaded = true
      this.totalAmount = total
    }
  },
  filters: {
    roundText
  },
  beforeRouteEnter(from, to, next) {
    const match = /\/[^\/]+\//.exec(from.path)
    const baseRoute = match && match[0] || '/'
    // guard against wrong stage
    if ( (store.getters['school/stage'] || '').endsWith('.payment') )
      next()
    else
      next(baseRoute)
  },
  mounted() {
    this.fetchUploadedReceipts()
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex";
.payment
  flex-vert: flex-start center
  *
    flex-shrink: 0
  .payment-methods
    width: 480px
  .payment-detail
    min-width: 640px
    width: 80%
  h4
    text-align: center
  .upload
    flex-vert: flex-start center
    .note
      white-space: nowrap
      color: #475669
      font-size: 14px
    .el-button
      margin: 2em auto
    .el-upload-wrapper
      max-width: 624px    // 4 pics per row
  .preview-image
    width: 100%
</style>
