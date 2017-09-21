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
      <SecondRoundReview
        slot="reviewer"
        ref="reviewer"
        :sessions="sessions"
        :id="props.id"
        @next="$refs.reviewControl.handleNext"
        @processed="$refs.reviewControl.handleProcessed"
      />
    </template>

  </ReviewControl>

</template>

<script>
import Precondition from '@/components/Precondition'
import ReviewControl from './ReviewControl'
import SecondRoundReview from './components/SecondRoundReview'

export default {
  name: 'second-round-mgmt',
  components: {
    Precondition,
    ReviewControl,
    SecondRoundReview
  },
  props: { id: { type: String, default: '' } },
  data: () => ({
    tests: null,
    sessions: null,
    schools: null,
    bySchoolName: (a, b) => (a.name || '').localeCompare(b.name || ''),
  }),
  methods: {
    configLoader() {
      return Promise.all([
        this.$agent.get('/api/sessions/').then( res => res.body ),
        this.$agent.get('/api/schools/').then( res => res.body )
      ])
    },
    configParser([ sessions, schools ]) {
      this.sessions = sessions.filter( session => !session.reserved )
      this.schools = schools.filter( $ => Number($.stage[0])>1 || $.stage==='1.complete' )
                            .map( $ => ({
                              id: $.id,
                              name: $.name,
                              stage: $.stage,
                              processed: Number($.stage[0])>1
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
