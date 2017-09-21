<template>

  <ReviewControl
    ref="control"
    :list="applications"
    :order-by="bySchoolName"
    :id="id"
  >

    <Precondition
      :loader="configLoader"
      @loaded="configParser"
    />

    <template slot="reviewer" scope="props">
      <ApplicationReview
        slot="reviewer"
        ref="reviewer"
        :tests="tests"
        :sessions="sessions"
        :id="props.id"
        @next="$refs.control.handleNext"
        @processed="$refs.control.handleProcessed"
        @nuked="$refs.control.handleRemove"
      />
    </template>

  </ReviewControl>

</template>

<script>
import Precondition from '@/components/Precondition'
import ReviewControl from './ReviewControl'
import ApplicationReview from './components/ApplicationReview'

export default {
  name: 'application-mgmt',
  components: {
    Precondition,
    ReviewControl,
    ApplicationReview
  },
  props: { id: { type: String, default: '' } },
  data: () => ({
    tests: null,
    sessions: null,
    applications: null,
    bySchoolName: (a, b) => (a.name || '').localeCompare(b.name || ''),
  }),
  methods: {
    configLoader() {
      return Promise.all([
        this.$agent.get('/api/config/application').then( res => res.body ),
        this.$agent.get('/api/sessions/').then( res => res.body ),
        this.$agent.get('/api/applications/').then( res => res.body )
      ])
    },
    configParser([ appConf, sessions, applications ]) {
      this.tests = appConf.tests
      this.sessions = sessions.filter( session => !session.reserved )
      this.applications = applications
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
