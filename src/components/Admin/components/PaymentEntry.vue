<template>
  <div class="payment-entry">
    <ol>
      <ImageLoader
        v-for="imageUrl in imageUrls"
        :key="imageUrl"
        tag="li"
        class="preview-image"
        width="320px"
        height="320px"
        default-width="320px"
        default-height="320px"
        :src="`${imageUrl}&size=small`"
        previewable
        @click="handlePreview(imageUrl)"
      />
    </ol>

    <el-dialog title="预览" width="70%" :visible.sync="dialogVisible" top="5vh" @click.native="dialogVisible = false">
      <ImageLoader default-width="720px" default-height="480px" :src="dialogVisible ? dialogImageUrl : ''" />
    </el-dialog>
  </div>
</template>

<script>
import ImageLoader from './ImageLoader'
import { toDateTimeString } from '../../../lib/date-util'
import roundText from '../../../lib/round-text'
export default {
  name: 'payment-entry',
  components: { ImageLoader },
  props: {
    data: { type: Object, required: true }
  },
  computed: {
    imageUrls() {
      const images = this.data && this.data.images || []
      return images.map(id => `/api/images/${id}?format=jpg`)
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  filters: {
    date: toDateTimeString,
    roundText
  },
  methods: {
    handlePreview(url) {
      this.dialogImageUrl = url + '&size=large'
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="stylus">
@import "../../../style/flex.styl"
.payment-entry
  .brief
    text-align: center
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
