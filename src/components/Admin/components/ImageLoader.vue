<template>
  <div v-loading="!src" element-loading-text="正在载入图片……">
    <img
      :height="renderHeight"
      :width="renderWidth"
      :src="src"
    />
  </div>
</template>

<script>
export default {
  name: 'image-loader',
  props: {
    defaultWidth: { type: Number, default: 640 },
    defaultHeight: { type: Number, default: 480 },
    height: { type: Number },
    width: { type: Number },
    loader: { type: Function, default: () => Promise.reject("Not provided") }
  },
  computed: {
    renderHeight() {
      const {src, height, defaultHeight} = this
      return (src ? height : defaultHeight) || ''
    },
    renderWidth() {
      const {src, width, defaultWidth} = this
      return (src ? width : defaultWidth) || ''
    }
  },
  data: () => ({
    src: '',
    loading: false,
    loadOnNextTick: false
  }),
  methods: {
    load() {
      this.loading = true
      let loader = this.loader()
      if (loader && typeof loader.then === 'function') {
        return loader.then( blob => {
          window.URL.revokeObjectURL(this.src)
          this.src = window.URL.createObjectURL(blob)
          this.loading = false
        })
      }
      return Promise.reject(new Error("loader is not promise"))
    },
  },
  mounted() {
    this.loading = true
    this.load()
  }
}
</script>

<style lang="stylus" scoped>
img
  width: 100%
</style>
