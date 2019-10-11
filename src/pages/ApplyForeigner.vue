<template>
  <div class="foreigner-reg">
    <Banner />

    <div class="layout">
      <ApplicationForeigner v-model="data" class="form" ref="foreigner" />

      <div class="section">
        <h4>Declaration</h4>
        <p>An email will be sent to confirm your application within 2 working days, further steps will be provided in the email.</p>
        <p>NKMUN organizing committee is committed to processing data in accordance with its responsibilities under the GDPR and Personal Information Protection Law of the People's Republic of China.</p>
        <p>All information you provided will be transmitted, stored, and processed in People's Republic of China, and will not be shared with third parties.</p>

        <div>
          <el-checkbox
            border
            v-model="declaration_confirm"
            style="height: 60px; display: block; width: 480px; margin: 0 auto"
            class="confirm-checkbox"
          >I have read and fully understood the above Declaration. <br>I confirm all the information in this application form is correct.</el-checkbox>
        </div>
      </div>

      <div class="section">
        <h4>Contact Us</h4>
        <p style="margin: 0 auto; width: 240px">
          Instagram: <a target="_blank" href="https://www.instagram.com/nkmunc/">@nkmunc</a> <br>
          Facebook: <a target="_blank" href="https://www.facebook.com/NKInternational/">@NKInternational</a> <br>
          Email: <a target="_blank" href="mailto:staff@nkmun.cn">staff@nkmun.cn</a> <br>
          WhatsApp: <a target="_blank" href="https://wa.me/31619883996">+31619883996</a> <br>
        </p>
      </div>

      <div class="controls">
        <el-button
          type="primary"
          icon="el-icon-check"
          @click="submit"
          :loading="busy"
          :disabled="!declaration_confirm"
        > Submit </el-button>
      </div>
    </div>

    <Copyright />
  </div>
</template>

<script>
import LayoutCenter from '@/components/LayoutCenter'
import Banner from '@/components/Banner'
import Copyright from '@/components/Copyright'
import ApplicationForeigner from '@/components/form/ApplicationForeigner'

export default {
  components: {
    Banner,
    Copyright,
    LayoutCenter,
    ApplicationForeigner
  },
  data() {
    return {
      data: null,
      busy: false,
      declaration_confirm: false
    }
  },
  methods: {
    scrollToFirstError() {
      const firstError = this.$refs.foreigner.$el.querySelector('.is-error')
      if (firstError) {
        firstError.scrollIntoView()
      }
    },
    async submit() {
      if (await this.$refs.foreigner.validate()) {
        this.busy = true
        try {
          await this.$agent.post('/api/foreigner-applications/').send(this.data)
          await this.$msgbox({
            type: 'success',
            title: 'Application Received',
            message: 'You can close this page now.',
            showCancelButton: false,
            showConfirmButton: true,
            showClose: false
          })
          this.$router.replace('/')
        } catch(err) {
          if (err.status) {
            const errorText = (
              typeof err.response.body === 'object'
              ? err.response.body.text
              : err.response.text
            )
            this.$notify({
              type: 'error',
              title: errorText,
              message: `(${err.status}) This identity is already registered, please contact staff for assistance.`
            })
          } else {
            this.$notify({
              type: 'error',
              title: 'Submission Error',
              message: `${err.status || '-'} ${err.message}`
            })
          }
        } finally {
          this.busy = false
        }
      } else {
        this.scrollToFirstError()
      }
    }
  },
}

</script>

<style lang="stylus" scoped>
.layout
  flex-grow: 1
  padding-bottom: 3em
.form
  min-width: 40ch
  margin: 0 auto
  & *
    flex-shrink: 0
.controls
  text-align: center
  margin: 1em auto
.hint
  font-size: 80%
  max-width: 80ch
  margin: 1em auto
.section
  max-width: 540px
  margin: 0 auto
  padding: 2em 0
  border-top: 1px solid #D3DCE6
  h4
    margin-top: 0
    text-align: center
  p
    margin: 1em 0
.confirm-checkbox
  >>> .el-checkbox__input
    transform: scale(1.5)
    top: -7px
    margin-left: .5ch
    margin-right: .5ch
</style>
