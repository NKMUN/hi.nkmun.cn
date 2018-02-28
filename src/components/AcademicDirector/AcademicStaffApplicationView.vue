<template>
  <div class="academic-staff-application-view" v-loading="busy">
    <ApplicationView class="viewer" :value="this.application" :tests="this.tests" />
    <div class="vr"></div>
    <div class="review">
      <RateInput v-model="review" :disabled="busyReview || !application"/>
      <div class="buttons">
        <el-button
          type="info"
          icon="el-icon-back"
          plain
          @click="back"
          :disabled="busyReview"
        > 返回 </el-button>
        <el-button
          type="primary"
          icon="el-icon-edit"
          plain
          @click="saveReview"
          :disabled="!application || !review"
          :loading="busyReview"
        > 保存 </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import RateInput from './components/RateInput'
import ApplicationView from './components/ApplicationView'
export default {
  components: {
    RateInput,
    ApplicationView
  },
  props: {
    id: {}
  },
  watch: {
    id() {
      this.fetch()
    }
  },
  data() {
    return {
      busy: false,
      busyReview: false,
      tests: null,
      application: null,
      review: null
    }
  },
  methods: {
    fetch() {
      if (!this.id) return
      this.busy = true
      return Promise.all([
        this.fetchTests(),
        this.fetchApplication()
      ])
      .then(
        _ => this.busy = false,
        err => this.$message({
          type: 'error',
          message: err.message
        })
      )
    },
    fetchTests() {
      return this.$agent.get(`/api/config/academic-staff-application`).then(
        res => {
          this.tests = res.body
        }
      )
    },
    fetchApplication() {
      return this.$agent.get(`/api/academic-staff-applications/${this.id}`).then(
        res => {
          this.application = res.body
          this.review = this.application.reviews && this.application.reviews[0] || null
        }
      )
    },
    saveReview(showMessage = true) {
      this.busyReview = true
      return this.$agent.post(`/api/academic-staff-applications/${this.id}/reviews/`).send(this.review).then(
        res => showMessage && this.$message({
          type: 'success',
          message: '已保存'
        }),
        err => this.$message({
          type: 'error',
          message: err.message
        })
      )
      .then(_ => this.busyReview = false)
    },
    back() {
      this.saveReview(false)
      this.$router.push('/academic-director/applications/')
    }
  },
  created() {
    this.fetch()
  }
}
</script>


<style lang="stylus" scoped>
.academic-staff-application-view
  display: flex
  flex-direction: row
  justify-content: center
  align-items: flex-start
  margin: 0 auto
  max-width: 150ch
  align-self: stretch
.vr
  width: 1px
  margin: 2em 0
  align-self: stretch
  content: ""
  border-left: 1px solid #cdcfe6
.review
  min-width: 30ch
  max-width: 50ch
  flex-grow: 1
  flex-shrink: 0
  flex-basis: 360px
  margin: .5em 2ch
.viewer
  min-width: 50ch
  max-width: 80ch
  flex-grow: 3
  flex-shrink: 0
  margin: 0 0 0 2ch
  overflow-y: scroll
  height: 100%
  padding: 1em 3ch 2em 0
  box-sizing: border-box
.buttons
  margin: 1em auto
</style>
