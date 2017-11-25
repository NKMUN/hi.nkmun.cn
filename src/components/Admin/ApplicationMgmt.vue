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

    <ApplicationReview
      slot="reviewer"
      slot-scope="props"
      ref="reviewer"
      :tests="tests"
      :sessions="sessions"
      :id="props.id"
      @next="$refs.control.handleNext"
      @processed="$refs.control.handleProcessed"
      @nuked="$refs.control.handleRemove"
    />

  </ReviewControl>

</template>

<script>
import Precondition from '@/components/Precondition'
import ReviewControl from './ReviewControl'
import ApplicationReview from './components/ApplicationReview'
import pinyinCmp from '@/lib/pinyin-cmp'

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
    bySchoolName: (a, b) => pinyinCmp(a.name, b.name),
  }),
  methods: {
    configLoader() {
      return Promise.all([
        this.$agent.get('/api/config/application').body(),
        this.$agent.get('/api/sessions/').body(),
        this.$agent.get('/api/applications/').body()
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
