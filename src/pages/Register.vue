<template>
  <div class="wrap">
    <Banner />

    <h2>{{ title }}</h2>

    <div class="register">

      <div class="step invitation-code small" v-if="showInvitationCode">
        <InvitationCode v-model="invitationCode" :disabled="busy" />
        <el-alert
          v-if="showInvitationCodeError"
          type="error"
          title="邀请码不正确或已被使用"
          :closable="false"
          show-icon
        />
        <el-button
          type="primary"
          class="btn next"
          :loading="busy"
          :disabled="!invitationCode"
          @click="checkInvitation"
        > 下一步 </el-button>
      </div>

      <div class="step service-agreement large" v-if="showServiceAgreement">
        <ServiceAgreement v-model="serviceAgreementChecked" ref="serviceAgreement"/>
        <el-button
          type="primary"
          class="btn next"
          :disabled="!serviceAgreementChecked"
          @click="checkServiceAgreement"
        > 下一步 </el-button>
      </div>

      <div class="step leader-info large" v-if="showRegistrationForm">
        <RegistrationSchool
          v-if="type === 'school'"
          ref="registration"
          v-model="registration"
          :identifier="identifier"
          :school="school"
          :contact="contact"
        />
        <RegistrationIndividual
          v-if="type === 'individual'"
          ref="registration"
          v-model="registration"
          :identifier="identifier"
          :school="school"
          :contact="contact"
        />

        <el-button
          type="success"
          class="btn next"
          @click="submit"
        > 提交 </el-button>
      </div>

    </div>

    <Copyright />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Banner from '@/components/Banner'
import InvitationCode from '@/components/form/InvitationCode'
import ServiceAgreement from '@/components/form/ServiceAgreement'
import RegistrationSchool from '@/components/form/RegistrationSchool'
import RegistrationIndividual from '@/components/form/RegistrationIndividual'
import Copyright from '@/components/Copyright'

export default {
  name: 'register',
  components: {
    Banner,
    InvitationCode,
    ServiceAgreement,
    RegistrationSchool,
    RegistrationIndividual,
    Copyright
  },
  computed: {
    ... mapGetters({
      canRegister: 'config/register'
    }),
    showInvitationCode()   { return this.step === 0 },
    showServiceAgreement() { return this.step === 1 },
    showRegistrationForm() { return this.step === 2 },
    title() {
      return this.type === 'school' ? '领队注册'
           : this.type === 'individual' ? '个人代表注册'
           : '参会注册'
    }
  },
  data: () => ({
    busy: false,
    invitationCode: null,
    serviceAgreementChecked: false,
    type: null,
    identifier: null,
    school: null,
    token: null,
    registration: null,
    showInvitationCodeError: false,
    step: 0,    // steps
  }),
  methods: {
    checkInvitation() {
      this.busy = true
      this.showInvitationCodeError = false
      return this.$agent
        .get('/api/invitations/' + this.invitationCode)
        .ok(({ok, status}) => ok || status === 409 || status === 404)
        .then(
          resp => {
            if (resp.ok) {
              this.step = 1
              for (let key of ['type', 'identifier', 'school', 'contact', 'token'])
                this[key] = resp.body[key] || null
            }
            if (resp.status === 409 || status === 404) {
              this.showInvitationCodeError = true
            }
          },
          err => this.$alert('服务器故障：'+err.message, '注册失败', {type: 'error'})
        ).then(
          _ => this.busy = false
        )
    },
    checkServiceAgreement() {
      if (this.serviceAgreementChecked) {
        this.serviceAgreementChecked = false
        this.step = 2
      }
    },
    submit() {
      return this.$refs.registration.validate().then(
        isValid => {
          if (!isValid) return false
          this.busy = true
          return this.$agent
            .post('/api/registration/')
            .auth(this.token, null, {type: 'bearer'})
            .ok( ({ok, status}) => ok || status === 409 || status === 401 || status === 403)
            .send(this.registration)
            .then(
              resp => {
                if (resp.ok) {
                  this.$alert('请从主页登录', '注册成功', {
                    type: 'success',
                    confirmButtonText: '返回主页',
                    callback: () => {
                      this.reset()
                      this.$router.push('/')
                    }
                  })
                }
                if (resp.status === 409) {
                  this.$alert('您已注册过，请从主页登录。如有问题，请联系组委。', '不能重复注册', {
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: '返回主页',
                    cancelButtonText: '取消',
                    callback: (action) => {
                      if (action === 'confirm') {
                        this.$refs.registration.reset()
                        this.$router.push('/')
                      }
                    }
                  })
                }
                if (resp.status === 401 || resp.status === 403) {
                  this.$alert('请重新注册', '操作超时', {
                    type: 'warning',
                    confirmButtonText: '返回',
                    callback: _ => { this.reset() }
                  })
                }
              },
              err => this.$alert('服务器故障：'+err.message, '注册失败', { type: 'error' })
            )
            .then(_ => this.busy = false)
        }
      )
    },
    reset() {
      this.step = 0
      this.invitationCode = null
      this.serviceAgreementChecked = false
      this.school = null
      this.token = null
      this.$refs.registration.reset()
    },
    scrollTop() {
      document.scrollingElement.scrollTop = 0
    }
  },
  watch: {
    step() {
      this.scrollTop()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../style/flex"
.wrap
  flex-vert: flex-start stretch
  h2
    text-align: center
  .register
    flex-vert: flex-start center
    flex-grow: 1
    margin-bottom: 84px
    .step
      margin: 0 auto
      width: 80%
      min-width: 360px
      &.small
        max-width: 36ch
      &.large
        max-width: 80ch
      &.invitation-code
        margin-top: 48px
  .btn
    &.next, &.submit
      display: block
      margin: 0 auto
      min-width: 240px
      min-height: 48px
  .el-alert
    width: auto
    margin: 1em auto
</style>

<style lang="stylus">
.register .registration-form
  align-self: stretch
  .school
    .name
      font-size: 16px
      font-weight: bolder
      text-align: center
    .english-name
      margin-top: 1em
      font-size: 13px
      font-weight: normal
      text-align: center
      color: #8492A6
  .hint
    margin: 1em 0
    text-align: center
    font-size: 90%
    color: #606266
    b
      color: inherit
      font-weight: inherit
      text-decoration: underline
  .section
    min-width: 360px
    width: 80%
    margin: 0 auto
    padding: 2em 0
    &:not(:first-child)
      border-top: 1px solid #D3DCE6
    h4
      margin-top: 0
      text-align: center
    .form
      margin: 0 auto
      &.small
        max-width: 36ch
      &.large
        max-width: 80ch
</style>
