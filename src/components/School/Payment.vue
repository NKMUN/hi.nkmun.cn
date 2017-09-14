<template>
  <div class="payment">
    <h3>{{round | roundText}}缴费</h3>

    <BillingDetail
      class="payment-detail"
      :school="school"
      :round="round"
      @loaded="billingLoaded=true"
    />

    <PaymentMethods class="payment-methods" v-if="billingLoaded" />

    <div class="upload" v-if="billingLoaded" >

      <h4>凭证上传</h4>

      <div class="note">
        <ul>
          <li>银行转帐回执（照片） 或 支付转账截图</li>
          <li>请在这张图片中包含：<b>转账人、金额、时间</b></li>
        </ul>
      </div>

      <el-upload
        drag
        name="file"
        :action="uploadUrl"
        :on-success="onSuccess"
        :on-error="onError"
        :before-upload="beforeUpload"
        :headers="{ Authorization: authorization[1] }"
        :show-file-list="false"
        :multiple="false"
        accept="image/jpeg, image/png, .jpg, .jpeg, .png"
      >
        <i class="el-icon-upload"/>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2MB</div>
      </el-upload>

      <el-alert v-if="beforeUploadError" type="error" :title="beforeUploadError" :closable="false" />
    </div>

  </div>
</template>

<script>
import { Upload } from 'element-ui'
import { mapGetters } from 'vuex'
import PaymentMethods from './components/PaymentMethods'
import BillingDetail from './components/BillingDetail'
import store from '@/store/index'
import roundText from '@/lib/round-text'

export default {
  name: 'payment',
  components: {
    PaymentMethods,
    BillingDetail,
    [Upload.name]: Upload,
  },
  computed: {
    ... mapGetters({
      school: 'user/school',
      round: 'school/round',
      authorization: 'user/authorization'
    }),
    uploadUrl() {
      return '/api/schools/'+this.school+'/payments/'
    },
  },
  data: () => ({
    beforeUploadError: null,
    billingLoaded: false
  }),
  methods: {
    async onSuccess(res, file, list) {
      this.$notify({
        type: 'success',
        title: '上传成功',
        message: '请等待组委审核',
        duration: 5000
      })

      this.$router.replace('/school/')
      this.$store.commit('school/stage', `${this.round}.paid`)
    },
    onError(err, file, list) {
      this.$notify({
        type: 'error',
        title: '上传失败，请稍后再试。',
        message: err.message,
        duration: 0
      })
    },
    beforeUpload(file) {
      this.beforeUploadError = false
      if ( ! (file.type === 'image/jpeg' || file.type === 'image/png') ) {
        this.beforeUploadError = '只能上传jpg或png格式'
        return false
      }
      if ( file.size / 1024 / 1024 > 2 ) {
        this.beforeUploadError = '图片大小不能大于2MB'
        return false
      }
      return true
    }
  },
  filters: { roundText },
  beforeRouteEnter(from, to, next) {
    // guard against wrong stage
    if ( (store.getters['school/stage'] || '').endsWith('.payment') )
      next()
    else
      next('/school/')
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex";
.payment
  flex-vert: flex-start center
  *
    flex-shrink: 0
  .note
    white-space: nowrap
    color: #475669
    font-size: 14px
  .payment-methods
    width: 360px
  .payment-detail
    min-width: 640px
    width: 80%
  h4
    text-align: center
  .el-alert
    margin-top: 1em
    width: auto
</style>
