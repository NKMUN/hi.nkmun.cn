<template>
  <el-dialog :visible.sync="previewVisible" title="预览">
    <div ref="mask">
      <img class="preview-image" :src="url" @load="$nextTick(_ => loading.close())" />
    </div>
  </el-dialog>
</template>

<script>
import { Loading } from 'element-ui'
export default {
  name: 'image-preview-dialog',
  props: {
    url: {}
  },
  data: () => ({
    previewVisible: true,
    loading: null
  }),
  watch: {
    previewVisible(val) {
      if (!val) this.$emit('close')
    }
  },
  mounted() {
    this.$nextTick(_ => {
      this.loading = Loading.service({
        target: this.$refs.mask,
        fullscreen: false,
      })
    })
  }
}
</script>

<style lang="stylus" scoped>
.preview-image
  min-width: 400px
  min-height: 300px
  max-width: 100%
  max-height: 100%
</style>
