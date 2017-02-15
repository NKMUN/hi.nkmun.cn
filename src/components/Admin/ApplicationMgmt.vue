<template>

  <ReviewLayout>

    <Precondition
      :loader="configLoader"
      @loaded="configParser"
    />

    <GroupedNavList
      v-if="applications"
      slot="list"
      :groups="groups"
      @select="handleSelect"
      ref="list"
      :actived="id"
    />

    <ApplicationReview
      v-if="applications"
      slot="reviewer"
      ref="reviewer"
      :tests="tests"
      :sessions="sessions"
      :id="id"
      @next="gotoNext"
      @processed="handleProcessed"
    />

  </ReviewLayout>

</template>

<script>
import { mapGetters } from 'vuex'
import { Notification } from 'element-ui'
import Precondition from 'components/Precondition'
import GroupedNavList from 'components/GroupedNavList'
import ReviewLayout from './ReviewLayout'
import ApplicationReview from './ApplicationReview'

function bySchoolName(_a, _b) {
  let a = (_a.school && _a.school.name) || ''
  let b = (_a.school && _a.school.name) || ''
  return a.localeCompare(b)
}

export default {
  name: 'application-mgmt',
  components: {
    Precondition,
    ReviewLayout,
    GroupedNavList,
    ApplicationReview
  },
  props: { id: { type: String, default: '' } },
  computed: {
    ... mapGetters({
      authorization: 'user/authorization'
    }),
    listPending() {
      return this.applications.filter( $ => !$.processed ).sort( bySchoolName )
    },
    listProcessed() {
      return this.applications.filter( $ => $.processed ).sort( bySchoolName )
    },
    groups() {
      return [
        { name: '待处理', list: this.listPending },
        { name: '已处理', list: this.listProcessed }
      ]
    }
  },
  data: () => ({
    tests: null,
    sessions: null,
    applications: null,
  }),
  methods: {
    configLoader() {
      return Promise.all([
        this.$agent.get('/api/config/application')
          .then( res => res.body ),
        this.$agent.get('/api/sessions')
          .then( res => res.body ),
        this.$agent.get('/api/applications')
          .set( ... this.authorization )
          .then( res => res.body )
      ])
    },
    configParser([ appConf, sessions, applications ]) {
      this.tests = appConf.tests
      this.sessions = sessions
      this.applications = applications
    },
    async handleSelect(id) {
      this.$router.push(id)
    },
    async handleProcessed(id) {
      let idx = this.applications.findIndex( $ => $.id === id )
      this.applications.splice(idx, 1, {
        ...this.applications[idx],
        processed: true
      })
    },
    gotoNext(id) {
      let nextIdx = this.listPending.findIndex( $ => $.id === id ) + 1
      if (nextIdx < this.listPending.length) {
        this.$router.push(this.listPending[nextIdx].id)
      } else {
        Notification({
          type: 'info',
          title: '没有更多的待处理项目',
          duration: 5000
        })
        this.$router.push('./')
      }
    }
  },
  async beforeRouteUpdate(to, from, next) {
    next( await this.$refs.reviewer.update() )
  },
  async beforeRouteLeave(to, from, next) {
    next( await this.$refs.reviewer.update() )
  }
}
</script>
