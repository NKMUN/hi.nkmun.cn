<template>
  <el-upload
    :class="{
      upload: 'true',
      'is-disabled': disabled
    }"
    :action="action"
    accept="image/jpeg"
    :data="data"
    :show-file-list="false"
    :on-success="handleSuccess"
    :on-progress="handleProgress"
    :before-upload="beforeUpload"
    :disabled="disabled || busy || previewBusy"
    :style="{ height: imageDimension, width: imageDimension }"
    v-loading="previewBusy"
  >
    <div v-if="imageUrl" class="image-wrap">
      <img v-if="imageUrl" :src="imageUrl" @load="handlePreviewLoad">
    </div>
    <div
      v-if="!busy"
      :class="{
        'icon': true,
        'el-icon-plus': !imageUrl,
        'el-icon-edit': imageUrl,
        'show-on-hover': imageUrl
      }"
      :style="{
        height: imageDimension,
        lineHeight: imageDimension
      }">
    </div>
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
import { Upload, Progress } from 'element-ui'
import bytes from 'bytes'
export default {
  components: {
    [Upload.name]: Upload,
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
      this.$emit('input', null)
      this.$emit('change', null)
      const isJPG = file.type === 'image/jpeg'
      const isLtMaxSize = file.size < this.maxSize
      if (!isJPG)
        this.$message({
          type: 'error',
          message: '上传的图片只能是 JPG 格式!',
        })
      if (!isLtMaxSize)
        this.$message({
          type: 'error',
          message: `上传的图片不能大于 ${bytes(this.maxSize)} !`,
        })
      return isJPG && isLtMaxSize
    },
    handleProgress(ev) {
      this.busy = true
      this.loadingPercent = Math.floor(ev.percent)
    },
    handlePreviewLoad() {
      this.previewBusy = false
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
.mask, .icon
  background-color: rgba(255, 255, 255, 0.8)
  height: 100%
  width: 100%
  top: 0
  left: 0
  position: absolute
.icon
  font-size: 28px
  color: #8c939d
  text-align: center
  &.show-on-hover
    visibility: hidden
.upload:hover .icon.show-on-hover
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
