<template>
  <div class="wrap">
    <Banner />

    <h2>领队注册</h2>

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
        <RegistrationForm ref="registration" v-model="registration" :school="school"/>

        <el-alert
           v-if="showValidationError"
           type="error"
           title="注册信息有错误"
           description="请检查并修正以红色标出的项目"
           :closable="false"
           show-icon
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
import RegistrationForm from '@/components/form/Registration'
import Copyright from '@/components/Copyright'

export default {
  name: 'register',
  components: {
    Banner,
    InvitationCode,
    ServiceAgreement,
    RegistrationForm,
    Copyright
  },
  computed: {
    ... mapGetters({
      canRegister: 'config/register'
    }),
    showInvitationCode()   { return this.step === 0 },
    showServiceAgreement() { return this.step === 1 },
    showRegistrationForm() { return this.step === 2 },
  },
  data: () => ({
    busy: false,
    invitationCode: null,
    serviceAgreementChecked: false,
    school: null,
    token: null,
    registration: null,
    showValidationError: false,
    showInvitationCodeError: false,
    step: 0,    // steps
  }),
  methods: {
    async checkInvitation() {
      this.busy = true
      this.showInvitationCodeError = false
      try {
        let {
          ok,
          status,
          body
        } = await this.$agent.get('/api/invitations/'+this.invitationCode)
                  .ok( ({ok, status}) => ok || status === 410 || status === 404 )
        if (ok) {
          this.step = 1
          this.school = body.school
          this.token = body.token
        } else if (status === 410 || status === 404) {
          this.showInvitationCodeError = true
        }
      } catch(e) {
        this.$alert('服务器故障：'+e.message, '注册失败', {type: 'error'})
      } finally {
        this.busy = false
      }
    },
    async checkServiceAgreement() {
      if ( await this.$refs.serviceAgreement.validate ) {
        this.serviceAgreementChecked = false
        this.step = 2
      }
    },
    async submit() {
      this.showValidationError = false
      if ( ! await this.$refs.registration.validate() ) {
        this.showValidationError = true
      } else {
        this.busy = true
        try {
          let {
            ok,
            status
          } = await this.$agent.post('/api/registration', this.registration)
                    .auth(this.token, null, {type: 'bearer'})
                    .ok( ({ok, status}) => ok || status === 409 || status === 410 )
          if ( ok ) {
            this.$alert('请从主页登录', '注册成功', {
              type: 'success',
              confirmButtonText: '返回主页',
              callback: () => {
                this.reset()
                this.$router.push('/')
              }
            })
          }
          if ( status === 409 ) {
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
          if ( status === 410 ) {
            this.$alert('请重新注册', '操作超时', {
              type: 'warning',
              confirmButtonText: '返回',
              callback: (action) => { this.reset() }
            })
          }
        } catch(e) {
          this.$alert('服务器故障：'+e.message, '注册失败', { type: 'error' })
        } finally {
          this.busy = false
        }
      }
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
      document.body.scrollTop = 0
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
