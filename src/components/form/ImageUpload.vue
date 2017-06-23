<template>
  <el-upload
    class="upload"
    :action="action"
    accept="image/jpeg"
    :show-file-list="false"
    :on-success="handleSuccess"
    :on-progress="handleProgress"
    :before-upload="beforeUpload"
    :disabled="busy"
  >
    <div v-if="imageUrl" class="image-wrap">
      <img v-if="imageUrl" :src="imageUrl">
    </div>
    <div v-if="!imageUrl && !busy "class="el-icon-plus icon"></div>
    <el-progress v-if="busy" :width="126" type="circle" :percentage="loadingPercent"></el-progress>
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
    maxSize: {
      type: Number,
      default: 10 * 1024 * 1024
    }
  },
  data() {
    return {
      imageUrl: null,
      busy: false,
      loadingPercent: 0,
    }
  },
  methods: {
    handleSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.$emit('input', res.id)
      this.$emit('change', res.id)
    },
    beforeUpload(file) {
      this.$emit('input', null)
      this.$emit('change', null)
      this.imageUrl = null
      const isJPG = file.type === 'image/jpeg'
      const isLtMaxSize = file.size < this.maxSize
      if (!isJPG)
        this.$notify({
          type: 'error',
          title: '上传的图片只能是 JPG 格式!',
          duration: 5000,
        })
      if (!isLtMaxSize)
        this.$notify({
          type: 'error',
          title: `上传的图片不能大于 ${bytes(this.maxSize)} !`,
          duration: 5000,
        })
      return isJPG && isLtMaxSize;
    },
    handleProgress(ev) {
      this.loadingPercent = Math.floor(ev.percent)
      this.busy = ev.percent !== 100
    }
  }
}
</script>

<style lang="stylus" scoped>
$image-size = 178px
.upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  height: $image-size
  display: block
.upload:hover
  border-color: #20a0ff
.icon
  font-size: 28px
  color: #8c939d
  width: 100%
  height: $image-size
  line-height: $image-size
  text-align: center
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
.is-error .upload {
  border-color: #ff4949
}
.el-progress {
  top: (($image-size - 126) / 2)    // match with el-progress's width
}
</style>

<style lang="stylus">
.upload .el-upload
  display: block
  height: 100%
  width: 100%
</style>
