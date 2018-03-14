<template>
  <div class="wrap">
    <Banner />
    <Precondition
      :loader="configLoader"
      @loaded="configParser"
    />

    <div class="application" v-if="config && !canApply">
      <el-alert
        class="application-period-alert"
        title="现在不能报名"
        type="warning"
        description="现在不是报名阶段"
        :closable="false"
        show-icon
      />
    </div>

    <div class="application" v-if="config && canApply">
      <h2>个人代表报名</h2>
      <div class="disclaimer" v-html="config.disclaimer"></div>
      <ApplicationIndividualForm
        :tests="config.tests"
        :press="config.press"
        :disabled="busy"
        v-model="application"
        ref="applicationForm"
      />

      <el-button
        ref="submit"
        class="btn submit"
        type="success"
        :loading="busy"
        size="large"
        @click="submit()"
      > 提交 </el-button>
    </div>
    <Copyright />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Banner from '@/components/Banner'
import ApplicationIndividualForm from '@/components/form/ApplicationIndividual'
import Precondition from '@/components/Precondition'
import Copyright from '@/components/Copyright'
import popoverAt from '@/lib/popover-at'

export default {
  name: 'apply-individual',
  components: {
    Banner,
    ApplicationIndividualForm,
    Precondition,
    Copyright
  },
  data: () => ({
    busy: false,
    config: null,
    application: {},
    msg: null,
  }),
  computed: {
    ...mapGetters({
      canApply: 'config/applyIndividual'
    })
  },
  methods: {
    configLoader() {
      return this.$agent.get('/api/config/application').body()
    },
    configParser(config) {
      this.config = config
    },
    scrollToFirstError() {
      const firstError = this.$refs.applicationForm.$el.querySelector('.is-error')
      if (firstError) {
        firstError.scrollIntoView()
      }
    },
    async submit() {
      if ( ! await this.$refs.applicationForm.validate() )
        return this.$nextTick(_ => this.scrollToFirstError())

      this.busy = true
      try {
        let {
          status,
          ok,
          body
        } = await this.$agent.post('/api/individual-applications/')
                  .ok( ({status, ok}) => ok || status === 409 )
                  .send(this.application)
        if (ok) {
          this.$msgbox({
            type: 'success',
            title: '报名成功',
            message: '报名成功，请等待组委通知。'
          }).then(
            success => null,
            err => null
          ).then(_ => {
            this.$refs.applicationForm.reset()
            this.$router.push('/')
          })
        }
        if (status === 409) {
          popoverAt(
            this.$refs.submit.$el,
            this.$message({
              type: 'error',
              message: '您已报过名：' + (body.text || body.code || body.error),
            }).$el
          )
        }
      } catch(e) {
        popoverAt(
          this.$refs.submit.$el,
          this.$message({
            type: 'error',
            message: '服务器故障：'+e.message
          }).$el
        )
      } finally {
        this.busy = false
      }
    }
  },
}
</script>

<style lang="stylus" scoped>
@import "../style/flex"
.wrap
  flex-vert: flex-start stretch
  .application
    flex-vert: flex-start center
    flex-grow: 1
    margin-bottom: 82px
  .btn.submit
    min-width: 240px
    min-height: 48px
  .el-alert
    width: auto
    margin: 1em auto
</style>
