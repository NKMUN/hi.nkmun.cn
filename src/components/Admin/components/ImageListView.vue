<template>
  <ol class="image-list-view">
    <ImageLoader
      v-for="imageUrl in imageUrls"
      :key="imageUrl"
      tag="li"
      class="preview-image"
      :width="width"
      :height="height"
      :default-width="width"
      :default-height="height"
      :src="`${imageUrl}&size=small`"
      previewable
      @click="handlePreview(imageUrl)"
    />
  </ol>
</template>

<script>
import ImageLoader from './ImageLoader'
import ImagePreview from '@/components/ImagePreview.js'

export default {
  name: 'payment-entry',
  components: { ImageLoader },
  props: {
    images: { type: Array, required: true },
    action: { type: String, default: '/api/images/' },
    width: { type: String, default: '320px' },
    height: { type: String, default: '320px' },
  },
  computed: {
    imageUrls() {
      return this.images.map(id => `${this.action}${id}?format=jpg`)
    }
  },
  methods: {
    handlePreview(imageUrl) {
      ImagePreview(`${imageUrl}&size=large`)
    }
  }
}
</script>

<style lang="stylus">
@import "../../../style/flex.styl"
.image-list-view
  ol
    list-style: none
    padding: 0
    margin: 0 auto
    flex-horz: flex-start center
    flex-wrap: wrap
    width: 704px
    li
      margin: 16px
</style>
