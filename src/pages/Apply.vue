<template>
  <div class="wrap">
    <Banner />
    <LayoutMiddle
      v-if="loading || !canApply"
      v-loading.body="loading"
      element-loading-text="正在载入，请稍等……"
    >
      <el-alert
        class="maintainance-alert"
        v-if="error"
        title="维护中，请稍后再试。"
        type="warning"
        :description="error ? String(error) : ''"
        :closable="false"
        show-icon
      />

      <div>
        <el-alert
          class="application-period-alert"
          v-if="!canApply"
          title="现在不能报名"
          type="warning"
          :description="现在不是报名阶段"
          :closable="false"
          show-icon
        />
      </div>

    </LayoutMiddle>

    <div class="application" v-if="!loading && canApply">
      <h2>报名</h2>
      <div class="disclaimer" v-html="config.disclaimer"></div>
      <ApplicationForm
        :tests="config.tests"
        :press="config.press"
        :disabled="busy"
        v-model="application"
        ref="applicationForm"
      />

      <el-alert
        v-if="showValidationError"
        type="error"
        title="申请表中有错误"
        description="请检查并修正以红色标出的项目"
        :closable="false"
        show-icon
      />

      <el-button
        class="btn submit"
        type="success"
        :loading="busy"
        size="large"
        @click="submit()"
      > 提交 </el-button>
    </div>

    <el-dialog
      v-model="showSuccess"
      title="报名成功"
      @close="$router.push('/')"
    >
      <!-- TODO: Insert onSuccess content -->
      <h4>报名成功，请等待组委通知。</h4>
      <el-button
        type="primary"
        @click="$router.push('/')"
      > 返回主页 </el-button>
    </el-dialog>

    <el-dialog
      v-model="showFailure"
      title="报名失败"
    >
      <h4>报名失败</h4>
      <pre>{{ applyError }}</pre>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Banner from 'components/Banner'
import { Alert, Dialog, Button } from 'element-ui'
import LayoutMiddle from 'components/LayoutMiddle'
import ApplicationForm from 'components/ApplicationForm'

export default {
  name: 'submit-application',
  components: {
    Banner,
    [Alert.name]: Alert,
    [Dialog.name]: Dialog,
    [Button.name]: Button,
    LayoutMiddle,
    ApplicationForm
  },
  data: () => ({
    busy: false,
    loading: false,
    error: false,
    config: {},
    application: {},
    showValidationError: false,
    showSuccess: false,
    applyError: null
  }),
  computed: {
    ...mapGetters({
      canApply: 'config/apply'
    }),
    showFailure() {
      return this.applyError || this.error
    }
  },
  methods: {
    async submit() {
      this.showValidationError = false
      if ( ! await this.$refs.applicationForm.validate() ) {
        this.showValidationError = true
        return
      }
      try {
        this.busy = true
        let {
          status,
          ok,
          body
        } = await this.$agent.post('/api/application', this.application)
                  .ok( ({status, ok}) => ok || status === 409 )
        if (ok) {
          this.showSuccess = true
        }
        if (status === 409) {
          this.applyError = '请不要重复报名！'
        }
      } catch(e) {
        this.applyError = '服务器故障：'+e.message
      } finally {
        this.busy = false
      }
    },
  },
  async created() {
    if (this.canApply) {
      this.loading = true
      try {
        let { body } = await this.$agent.get('/api/application')
        this.config = body
      }catch(e){
        this.error = e.message
      }finally{
        this.loading = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../style/flex"
.wrap
  flex-vert: flex-start stretch
  margin-bottom: 82px
  .application
    flex-vert: flex-start center
  .btn.submit
    min-width: 240px
    min-height: 48px
  .el-alert
    width: auto
    margin: 1em auto
</style>
