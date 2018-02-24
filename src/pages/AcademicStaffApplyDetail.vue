<template>
  <div class="academic-staff-apply-detail" v-loading="!application">
    <header ref="header">
      <el-steps direction="horizontal" simple>
        <el-step
          v-for="(step, idx) in steps"
          :key="step.title"
          :title="step.title"
          :status="
              applyComplete ? 'success'
            : idx === activeStep ? 'finish'
            : idx === reachedStep ? 'process'
            : idx < reachedStep ? 'success'
            : idx > reachedStep ? 'wait'
            : 'wait'
          "
          @click.native="handleStepClick(idx)"
          :class="{
            clickable: !applyComplete && step.route,
            disabled: idx <= reachedStep
          }"
        />
      </el-steps>
      <Logout type="info" plain />
    </header>

    <main ref="view">
      <router-view
        v-if="application && !applyComplete"
        ref="form"
        :value="application"
        @input="handleInput"
        :finishStep="finishStep"
        @page-validation-error="handlePageValidationError"
        @success="handleSuccess"
      />

      <div class="layout" v-if="application && !applyComplete && activeStep < finishStep - 1">
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="update(application, true)"
          > 保存 </el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            @click="nextStep()"
          > 下一步 </el-button>
        </el-button-group>
      </div>

      <h4 class="layout" v-if="application && applyComplete">申请已提交，请等待组委审核</h4>
    </main>

  </div>
</template>

<script>
import Logout from '@/components/Logout'
import { mapGetters } from 'vuex'
export default {
  components: {
    Logout
  },
  computed: {
    ...mapGetters({ user: 'user/user' }),
    steps() {
      return [
        { title: '注册' },
        { title: '基本信息', route: 'basic' },
        { title: '职位', route: 'roles' },
        { title: '经历', route: 'experiences' },
        { title: '学术', route: 'academics' },
        { title: '其他', route: 'extras' },
        { title: '确认', route: 'confirm' }
      ]
    },
    finishStep() {
      return this.steps.length
    },
    reachedStep() {
      return this.application && this.application.reachedStep || 1
    },
    applyComplete() {
      return this.application && this.application.submitted
    }
  },
  data() {
    return {
      activeStep: 1,
      application: null
    }
  },
  methods: {
    handleStepClick(idx) {
      if (this.applyComplete) return
      if (idx >= this.steps.length) return
      const step = this.steps[idx]
      if (this.activeStep === idx && this.$route.path.includes(`/academic-staff/apply/${step.route}`)) return
      if (step.route && this.reachedStep >= idx) {
        this.$router.push(`/academic-staff/apply/${step.route}/`)
        this.activeStep = idx
      }
    },
    handleResize() {
      if (this.$refs.view && this.$refs.header)
        this.$refs.view.style.paddingTop = this.$refs.header.offsetHeight + 'px'
    },
    fetch() {
      return this.$agent.get(`/api/academic-staff-applications/user/${this.user}`)
        .ok(({status}) => status === 200 || status === 404)
        .then(
          res => {
            this.application = res.body || {}
            if (this.application.reachedStep) {
              this.activeStep = this.application.reachedStep
              this.handleStepClick(this.activeStep)
            }
          },
          error => this.$message({
            type: 'error',
            message: error.message
          })
        )
    },
    update(payload, showMessage = false) {
      return this.$agent.patch(`/api/academic-staff-applications/user/${this.user}`)
        .set('X-Timestamp', `${Date.now()}`)
        .send(payload)
        .then(
          res => {
            if (showMessage) {
              this.$message({
                type: 'success',
                message: '已更新'
              })
            }
            return res.body
          },
          error => {
            this.$message({
              type: 'error',
              message: error.message
            })
            return null
          }
        )
    },
    handleInput(val) {
      this.application = { ...(this.application || {}), ...val }
      return this.update(val, false)
    },
    async scrollToFirstError() {
      const firstError = this.$refs.view.querySelector('.is-error')
      if (firstError) {
        firstError.scrollIntoView()
        const { top } = firstError.getBoundingClientRect()
        const headerHeight = this.$refs.header.offsetHeight
        if (top < headerHeight) {
          document.scrollingElement.scrollTop -= headerHeight
        }
        return true
      }
    },
    async nextStep() {
      if (this.$refs.form.validate && await this.$refs.form.validate()) {
        const reachedStep = this.application.reachedStep || 1
        const nextStep = this.activeStep + 1
        const updatedApplication = await this.update({ ...this.application, reachedStep: Math.max(reachedStep, nextStep) }, true)
        if (updatedApplication) {
          this.application = updatedApplication
          this.handleStepClick(nextStep)
        }
      } else {
        this.$nextTick(_ => {
          if (this.scrollToFirstError()) {
            this.$message({
              type: 'error',
              message: '请先修正表单中用红色标出的错误项'
            })
          }
        })
      }
    },
    handleSuccess() {
      this.fetch()
      this.$router.push('/academic-staff/apply/')
    },
    handlePageValidationError(idx) {
      this.$message({
        type: 'error',
        message: this.steps[idx].title + ' 中的信息有错误，请修正。'
      })
      this.handleStepClick(idx)
      this.$refs.form.$nextTick(_ => {
        this.$refs.form.validate()
        .then(result => !result && this.scrollToFirstError())
      })
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
    this.$nextTick(this.handleResize)
    this.fetch()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style lang="stylus" scoped>
@import "../style/flex.styl";
.clickable
  cursor: pointer
header
  flex-horz: flex-start stretch
  position: fixed
  top: 0
  left: 0
  width: 100%
  z-index: 99
  .el-steps
    flex-grow: 1
    border-radius: 0
  .el-button
    flex-shrink: 0
    border-radius: 0
    border: 0
    border-bottom: 1px solid #f5f7fa
main
  padding-bottom: 3em
  .layout
    text-align: center
</style>

<style lang="stylus">
.academic-staff-apply-detail
  .el-step__icon
    display: none
</style>