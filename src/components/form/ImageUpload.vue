<template>
  <el-upload
    :class="{
      upload: 'true',
      'is-disabled': disabled
    }"
    :action="action"
    accept="image/jpeg, image/png"
    :data="data"
    :show-file-list="false"
    :on-success="handleSuccess"
    :on-progress="handleProgress"
    :before-upload="beforeUpload"
    :disabled="disabled || busy || previewBusy"
    :style="{ height: imageDimension, width: imageDimension }"
    v-loading="previewBusy"
    ref="upload"
  >
    <div v-if="imageUrl" class="image-wrap">
      <img v-if="imageUrl" :src="imageUrl" @load="handlePreviewLoad">
    </div>
    <div
      v-if="!busy && imageUrl"
      class="icons show-on-hover"
      :style="{
        height: imageDimension,
        lineHeight: imageDimension
      }"
      @click.stop="nop"
    >
      <div class="icon el-icon-zoom-in" @click="handlePreview" />
      <div class="icon el-icon-edit" @click="openUpload" />
    </div>
    <div
      v-if="!busy && !imageUrl"
      class="icons icon el-icon-upload"
      :style="{
        boxSizing: 'border-box',
        height: imageDimension,
        lineHeight: imageDimension,
        fontSize: '48px'
      }"
    />
    <div v-if="busy" class="mask">
      <el-progress
        :width="126"
        type="circle"
        :percentage="loadingPercent"
        :style="{ top: ((parseInt(imageDimension, 10) - 126) / 2) + 'px' }"
      />
    </div>
  </el-upload>
</template>

<script>
import ImagePreview from '@/components/ImagePreview.js'
import { Progress } from 'element-ui'
import bytes from 'bytes'
import { checkFileSignatureIsAcceptable, jpg, png } from '@/lib/filetype-signature'
export default {
  components: {
    [Progress.name]: Progress
  },
  props: {
    action: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxSize: {
      type: Number,
      default: 10 * 1024 * 1024
    },
    value: {
      type: String,
      default: ''
    },
    imageDimension: {
      type: String,
      default: '178px'
    },
    previewSize: {
      type: String,
      default: 'small'
    },
    previewFormat: {
      type: String,
      default: 'jpg'
    },
    data: {
      type: Object,
      default: () => {}
    },
  },
  computed: {
    imageUrl() {
      return this.value ? `${this.action}${this.value}?size=${this.previewSize}&format=${this.previewFormat}` : ''
    }
  },
  watch: {
    imageUrl(val) {
      if (val)
        this.previewBusy = true
    }
  },
  data() {
    return {
      busy: false,
      previewBusy: false,
      loadingPercent: 0,
    }
  },
  methods: {
    handleSuccess(res) {
      this.$emit('input', res.id)
      this.$emit('change', res.id)
      this.$emit('uploaded', res.id)
      this.busy = false
    },
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'

        if (!isJPG) {
          this.$message({
            type: 'error',
            message: '上传的图片只能是 JPG 或 PNG 格式!',
          })
          return reject('bad MIME')
        }

        const isLtMaxSize = file.size < this.maxSize
        if (!isLtMaxSize) {
          this.$message({
            type: 'error',
            message: `上传的图片不能大于 ${bytes(this.maxSize)} !`,
          })
          return reject('size too large')
        }

        checkFileSignatureIsAcceptable(file, jpg, png).then(
          signature => {
            if (!signature) {
              this.$message({
                type: 'error',
                message: `上传的图片只能是 JPG 或 PNG 格式，请不要修改文件后缀名。`,
              })
              return reject('bad signature')
            } else {
              this.$emit('input', null)
              this.$emit('change', null)
              resolve(true)
            }
          },
        )
      })
    },
    handleProgress(ev) {
      this.busy = true
      this.loadingPercent = Math.floor(ev.percent)
    },
    handlePreviewLoad() {
      this.previewBusy = false
    },
    handlePreview() {
      ImagePreview(
        `${this.action}${this.value}?format=jpg&size=large`,
        {
          top: '0',
          maxImageHeight: '80vh'
        }
      )
    },
    openUpload() {
      this.$refs.upload.$refs['upload-inner'].handleClick()
    },
    nop() {
    }
  }
}
</script>

<style lang="stylus" scoped>
.upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  display: block
  &.is-disabled
    background-color: hsl(220, 20%, 91%)
  &:not(.is-disabled).is-error
    border-color: hsl(0, 87%, 69%)
  &:not(.is-disabled):hover
    border-color: #20a0ff
.mask, .icons
  background-color: rgba(255, 255, 255, 0.8)
  height: 100%
  width: 100%
  top: 0
  left: 0
  position: absolute
.icons
  display: flex
  flex-direction: row
  align-items: center
  justify-content: center
  > .icon
    flex: 0 0
    &:hover
      color: #303133
.icon
  padding: 16px
  font-size: 28px
  color: #8c939d
  text-align: center
.show-on-hover
    visibility: hidden
.upload:hover .show-on-hover
    visibility: visible
.image-wrap
  height: 100%
  width: 100%
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  & img
    max-width: 100%
    max-height: 100%
    height: auto
    width: auto
    box-shadow: 0 0 1em black
.is-error .upload
  border-color: #ff4949
</style>

<style lang="stylus">
.upload .el-upload
  display: block
  height: 100%
  width: 100%
.upload.is-disabled .el-upload
  cursor: not-allowed
</style>
