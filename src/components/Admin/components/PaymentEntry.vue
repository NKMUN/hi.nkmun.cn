<template>
  <div class="payment-entry">
    <ImageLoader
      class="image"
      :defaultHeight="480"
      :defaultWidth="640"
      :width="640"
      :loader="createImageLoader(data)"
    />
    <div class="brief">
      <b>{{ data.round | toRoundText }}</b>，上传时间：{{ data.time | date }}
    </div>
  </div>
</template>

<script>
import ImageLoader from './ImageLoader'
import { toDateTimeString } from '../../../lib/date-util'
export default {
  name: 'payment-entry',
  components: { ImageLoader },
  props: {
    data: { type: Object, required: true }
  },
  methods: {
    createImageLoader(payment) {
      return () => this.$agent.get('/api/schools/'+payment.school.id+'/payments/'+payment.id).blob()
    },
  },
  filters: {
    date(val) {
      return toDateTimeString(val)
    },
    toRoundText(val) {
      return ({'1': '一轮', '2': '二轮'}[val] || '其他')
    }
  },
}
</script>

<style lang="stylus" scoped>
.payment-entry
  margin: 2em 0
  .image
    max-width: 640px
    display: block
    margin: .5em auto
  .brief
    text-align: center
</style>
