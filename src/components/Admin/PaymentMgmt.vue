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

    <template slot="reviewer" scope="props">
      <PaymentReview
        slot="reviewer"
        ref="reviewer"
        :id="props.id"
        :round="round"
        @next="$refs.reviewControl.handleNext"
        @processed="$refs.reviewControl.handleProcessed"
      />
    </template>

  </ReviewControl>

</template>

<script>
import { mapGetters } from 'vuex'
import Precondition from 'components/Precondition'
import ReviewControl from './ReviewControl'
import PaymentReview from './components/PaymentReview'

export default {
  name: 'payment-review',
  components: {
    Precondition,
    ReviewControl,
    PaymentReview
  },
  props: {
    id: { type: String, default: '' },
    round: {type: String, default: '1' }
  },
  computed: {
    ... mapGetters({
      authorization: 'user/authorization'
    })
  },
  data: () => ({
    schools: null,
    bySchoolName: (a, b) => (a.name || '').localeCompare(b.name || ''),
  }),
  methods: {
    configLoader() {
      return this.$agent.get('/api/schools/')
               .set( ... this.authorization )
               .then( res => res.body )
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