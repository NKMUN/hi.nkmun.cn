<template>
  <component :is="tag"
    v-loading="showLoading"
    element-loading-text="正在载入图片……"
    :class="{
      'image-loader-wrapper': true,
      'previewable': previewable
    }"
    :style="{
      width: renderWidth,
      height: renderHeight
    }"
  >
    <img @load="handleLoad" :src="src" />
    <div v-if="loaded && previewable" class="overlay" @click="$emit('click')">
      <Icon class="preview" name="search" />
    </div>
  </component>
</template>

<script>
import "vue-awesome/icons/search"
export default {
  name: 'image-loader',
  props: {
    tag: { type: String, default: 'div' },
    src: { type: String },
    defaultWidth: { type: String },
    defaultHeight: { type: String },
    height: { type: String },
    width: { type: String },
    previewable: { type: Boolean, default: false },
  },
  computed: {
    renderHeight() {
      const {loaded, height, defaultHeight} = this
      return (loaded ? height : defaultHeight) || ''
    },
    renderWidth() {
      const {loaded, width, defaultWidth} = this
      return (loaded ? width : defaultWidth) || ''
    }
  },
  watch: {
    src: {
      handler() {
        this.loaded = false
        this.scheduleAnimation()
      },
      immediate: true
    }
  },
  data: () => ({
    showLoading: false,
    loaded: false,
    timeout: null
  }),
  methods: {
    handleLoad() {
      this.showLoading = false
      this.loaded = true
      this.timeout && clearTimeout(this.timeout)
    },
    scheduleAnimation() {
      // if image takes > 120ms to load, show animation
      this.timeout = setTimeout(_ => {
        this.showLoading = true
        this.timeout = null
      }, 120)
    }
  },
}
</script>

<style lang="stylus">
.image-loader-wrapper
  height: 100%
  width: 100%
  display: inline-flex
  flex-direction: column
  align-items: center
  justify-content: center
  position: relative
  & img
    max-width: 100%
    max-height: 100%
    height: auto
    width: auto
    box-shadow: 0 0 1em black
  .overlay
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    .preview
      visibility: hidden
      width: 30%
      height: 30%
      position: absolute
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%)
      color: rgba(255, 255, 255, 0.9)
  &.previewable:hover
    img
      filter: brightness(0.3)
    .overlay
      cursor: pointer
      .preview
        visibility: visible
</style>
