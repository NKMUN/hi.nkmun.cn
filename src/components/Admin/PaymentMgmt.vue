<template>

  <ReviewControl
    ref="reviewControl"
    :list="schools"
    :order-by="bySchoolName"
    :id="id"
  >

    <Precondition
      :loader="configLoader"
      @loaded="configParser"
    />

    <PaymentReview
      slot="reviewer"
      slot-scope="props"
      ref="reviewer"
      :id="props.id"
      @next="$refs.reviewControl.handleNext"
      @processed="$refs.reviewControl.handleProcessed"
    />


  </ReviewControl>

</template>

<script>
import Precondition from '@/components/Precondition'
import ReviewControl from './ReviewControl'
import PaymentReview from './components/PaymentReview'
import pinyinCmp from '@/lib/pinyin-cmp'

export default {
  name: 'payment-mgmt',
  components: {
    Precondition,
    ReviewControl,
    PaymentReview
  },
  props: {
    id: { type: String, default: '' },
  },
  data: () => ({
    schools: null,
    bySchoolName: (a, b) => pinyinCmp(a.name, b.name),
  }),
  methods: {
    configLoader() {
      return this.$agent.get('/api/schools/').body()
    },
    configParser(schools) {
      this.schools = schools
      .filter( $ => $.stage.endsWith('.paid') || Number($.stage[0]) > 1 || $.stage === '1.complete' )
      .map( $ => ({
        ... $,
        processed: !$.stage.endsWith('.paid')
      }) )
    }
  },
  async beforeRouteUpdate(to, from, next) {
    if (this.$refs.reviwer)
      next( await this.$refs.reviewer.update() )
    else
      next()
  },
  async beforeRouteLeave(to, from, next) {
    if (this.$refs.reviwer)
      next( await this.$refs.reviewer.update() )
    else
      next()
  }
}
</script>
