<template>
  <div class="payment">
    <h3>{{round | roundText}}缴费</h3>

    <BillingDetail
      class="payment-detail"
      :school="school"
      :round="round"
      @loaded="billsLoaded=true"
    />

    <PaymentMethods class="payment-methods" v-if="billsLoaded" />

    <div class="upload" v-if="billsLoaded">
      <h4>凭证上传</h4>

      <ul class="note">
        <li>可上传：银行回执（照片） 或 App内转账截图</li>
        <li>请包含：<b>转账人、金额、时间</b></li>
        <li class="constraint-text">只能上传 <b>jpg / png</b> 文件，每个文件不超过 <b>2MB</b></li>
      </ul>

      <el-upload
        class="el-upload-wrapper"
        action="/api/images"
        accept="image/jpeg, image/png, .jpg, .jpeg, .png"
        list-type="picture-card"
        :file-list="uploadedImages"
        :on-preview="handlePictureCardPreview"
        :on-success="handleSuccess"
        :on-remove="handleRemove"
        :before-upload="beforeUpload"
      >
        <i class="el-icon-plus" />
      </el-upload>

      <el-dialog v-model="previewVisible" title="预览">
        <img class="preview-image" :src="previewImageUrl" />
      </el-dialog>

      <el-button size="large" type="primary" @click="handleSubmit" :busy="busy"> 提交 </el-button>
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

const PREVIEW_IMAGE_SIZE_QUERY = "size=tiny"
const PREVIEW_DIALOG_IMAGE_SIZE_QUERY = "size=medium"

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
      token: 'user/token',
      round: 'school/round',
    }),
    authorization() {
      return `Bearer ${this.$store.getters['user/token']}`
    },
    uploadedImages() {
      return this.receipts.map((id, idx) => ({
        name: String(idx),
        url: `/api/images/${id}?size=tiny&format=jpg`
      }))
    }
  },
  data: () => ({
    billsLoaded: false,
    receipts: [],
    busy: false,
    previewImageUrl: '',
    previewVisible: false
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
    handleSuccess(resp, file, fileList) {
      return this.handleFileList(fileList)
    },
    handleRemove(file, fileList) {
      return this.handleFileList(fileList)
    },
    handleFileList(fileList) {
      const recoverIdFromUrl = url => {
        const API_IMAGE_PREFIX = '/api/images/'
        if (url.startsWith(API_IMAGE_PREFIX)) {
          const startPos = API_IMAGE_PREFIX.length
          const queryPos = url.indexOf('?')
          const endPos = queryPos === -1 ? undefined : queryPos    // js does not offer C style substr
          return url.slice(startPos, endPos)
        }
      }
      const files = fileList.filter(file => file.status === 'success')
      this.receipts = files.map(file => file.response ? file.response.id : recoverIdFromUrl(file.url))
    },
    handlePictureCardPreview(file) {
      this.previewImageUrl = file.url.replace(PREVIEW_IMAGE_SIZE_QUERY, PREVIEW_DIALOG_IMAGE_SIZE_QUERY)
      this.previewVisible = true
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
        this.$notify({
          type: 'success',
          title: '缴费凭证已提交',
          message: '请等待审核',
          duration: 5000
        })
        this.$router.replace('/school/')
        this.$store.commit('school/stage', body.nextStage)
      } catch(err) {
        this.$notify({
          type: 'error',
          title: '提交失败，请稍后再试。',
          message: err.message,
          duration: 0
        })
      } finally {
        this.busy = false
      }
    }
  },
  filters: { roundText },
  beforeRouteEnter(from, to, next) {
    // guard against wrong stage
    if ( (store.getters['school/stage'] || '').endsWith('.payment') )
      next()
    else
      next('/school/')
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
    width: 360px
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
