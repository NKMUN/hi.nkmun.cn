<template>
  <div
    :class="{
      'avatar-upload': true,
      'load-error': imageStatus === 'error'
    }"
    :style="{ width: displayWidth, height: displayHeight }"
    v-loading="imageStatus === 'loading'"
    :readonly="this.readonly"
    :disabled="this.disabled"
  >
    <img
      v-if="value && imageStatus !== 'error'"
      :src="imgSrc"
      class="stretch-fit"
      @load="handleImageLoaded"
      @error="handleImageLoadError" />
    <div
      v-if="!value || imageStatus === 'error'"
      class="placeholder stretch-fit"
    >
      <slot :image-status="imageStatus" :value="value">
        <icon
          class="hint"
          height="72" width="72" style="font-size: 72px"
          :name="imageStatus === 'error' ? 'exclamation-triangle' : 'user-circle'"
        />
      </slot>
    </div>

    <div class="tooltip stretch-fit" @click="handleClick">
      <i v-if="value" class="el-icon el-icon-edit hint" />
      <i v-if="!value" class="el-icon el-icon-upload hint" />
    </div>

    <input ref="input" type="file" name="avatar-raw" accept="image/*" @change="handleFilePick" style="display: none">

    <el-dialog
      title="上传照片"
      :visible.sync="showCropDialog"
      custom-class="avatar-upload-crop-dialog"
      @closed="handleCropDialogClosed"
      :width="isPortraitOrientation() ? '97%' : '75%'"
      :top="isPortraitOrientation() ? '15%' : '10%'"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      :append-to-body="true"
    >
      <Cropper
        :src="cropImgSrc"
        :canvas="false"
        :stencil-props="{
          aspectRatio: this.dimension.width / this.dimension.height,
        }"
        ref="cropper"
        :style="{
          maxWidth: isPortraitOrientation() ? '90vw' : '70vw',
          maxHeight: isPortraitOrientation() ? '60vh' : '50vh',
          margin: '0 auto',
        }"
      />

      <div slot="footer">
        <el-button
          type="info"
          @click="handleCropCancel"
          icon="el-icon-close"
          size="medium"
        > 取消 </el-button>
        <el-button
          type="success"
          @click="handleCropConfirm"
          icon="el-icon-check"
          size="medium"
        > 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'
import 'vue-awesome/icons/user-circle'
import 'vue-awesome/icons/exclamation-triangle'

export default {
  name: 'avatar-upload',
  components: {
    Cropper
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    action: {
      type: String,
      default: '/api/images/'
    },
    data: {
      type: Object,
      default: () => ({})
    },
    value: {},
    displayWidth: {
      type: String,
      default: '150px'
    },
    displayHeight: {
      type: String,
      default: '210px'
    },
    dimension: {
      type: Object,
      validator: (value) => {
        return ( typeof value === 'object'
              && Number.isInteger(value.width)
              && Number.isInteger(value.height)
        )
      },
      default: () => ({
        width: 800,
        height: 1120,
      })
    },
    imageMime: {
      type: String,
      default: 'image/jpeg'
    },
    imageQuality: {
      type: Number,
      default: 0.92,
    },
    previewSize: {
      type: String,
      default: 'small'
    },
    previewFormat: {
      type: String,
      default: 'jpg'
    },
  },
  computed: {
    imgSrc() {
      if (!this.value)
        return ''
      if (this.imageStatus === 'empty')
        return ''
      if (this.imageStatus === 'error')
        return ''
      return `${this.action}${this.value}?size=${this.previewSize}&format=${this.previewFormat}`
    }
  },
  watch: {
    value(newVal, oldVal) {
      if (!newVal) {
        this.imageStatus = 'empty'
      } else if (newVal !== oldVal) {
        this.imageStatus = 'loading'
      }
    }
  },
  data() {
    return {
      // imageStatus: 'empty', 'loading', 'loaded', 'error'
      imageStatus: this.value ? 'loading' : 'empty',
      showCropDialog: false,
      resolveCropDialogOpened: null,
      cropImgSrc: null,
    }
  },
  methods: {
    handleClick() {
      if (!this.disabled && !this.readonly)
        this.$refs.input.click()
    },
    handleFilePick(ev) {
      this.showCropDialog = true
      this.cropImgSrc = URL.createObjectURL(ev.target.files[0])
      this.$refs.input.value = ''
    },
    handleCropDialogClosed() {
      URL.revokeObjectURL(this.cropImgSrc)
      this.cropImgSrc = null
    },
    handleCropCancel() {
      this.showCropDialog = false
    },
    handleCropConfirm() {
      const {coordinates} = this.$refs.cropper.getResult()
      const canvas = document.createElement('canvas')
      canvas.width = this.dimension.width
      canvas.height = this.dimension.height
      const context = canvas.getContext('2d')

      // Reuse Cropper's <img>
      const {left, top, width, height} = coordinates
      context.drawImage(
        this.$refs.cropper.$el.querySelector('img'),
        left, top, width, height,  // source x,y,w,h
        0, 0, this.dimension.width, this.dimension.height  // destination x,y,w,h
      )

      canvas.toBlob(this.uploadBlob, this.imageMime, this.imageQuality)
      this.showCropDialog = false
    },
    uploadBlob(blob) {
      return this.$agent.post(this.action)
        .attach('file', blob, 'image.jpg')
        .field(this.data)
        .then(
          resp => {
            const imageId = resp.body.id
            this.$emit('input', imageId)
            this.$emit('change', imageId)
          },
          error => {
            this.$notify({
              title: 'Error Uploading Image',
              message: error.res ? `${error.res.status} / ${error.res.text}` : error.message,
              type: 'error'
            })
          }
        )
    },
    handleImageLoaded() {
      this.imageStatus = 'loaded'
    },
    handleImageLoadError() {
      this.imageStatus = 'error'
    },
    isPortraitOrientation() {
      return window.innerHeight > window.innerWidth
    }
  }
}

</script>

<style lang="stylus">
@import "../../style/flex"

.avatar-upload
  position: relative
  border: 1px dashed #d9d9d9
  border-radius: 6px
  min-height: 178px
  .stretch-fit
    display: block
    width: 100%
    height: 100%
    &img
      object-fit: contain
  .placeholder, .tooltip
    flex-vert: center center
  .tooltip
    position: absolute
    left: 0
    top: 0
    z-index: 1
    opacity: 0
    .el-icon
      font-size: 48px
  &:not([disabled]):not([readonly])
    cursor: pointer
    &.is-error
      border-color: #f56b6b
    &.load-error
      .hint
        color: #f7ba2a
    &:hover
      border-color: #1f9eff
      .tooltip
        opacity: 1
        background-color: rgba(255, 255, 255, 0.87)
  &[disabled]
    pointer: not-allowed
  &[readonly]
    pointer: default
  .hint
    color: #8492A6
    font-size: 90%
</style>
