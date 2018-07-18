<template>
  <div class="login-ctrl">
    <el-form
      class="login-form"
      label-width="48px"
      :model="loginPayload"
      ref="loginForm"
    >

      <el-form-item label="邮箱" prop="user">
        <el-input
          type="text"
          placeholder="邮箱或用户名"
          autofocus
          :disabled="busy"
          v-model="loginPayload.user"
          @keydown.enter.native="$refs.inputPassword.focus()"
        />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          ref="inputPassword"
          type="password"
          placeholder="密码"
          :disabled="busy"
          v-model="loginPayload.password"
          @keydown.enter.native="login"
        />
      </el-form-item>
    </el-form>

    <el-button
      class="btn"
      type="success"
      :loading="busy"
      @click="login"
    >
      <i v-if="success" class="el-icon--right el-icon-success"></i>
      <template v-else> 登录 </template>
    </el-button>
  </div>
</template>

<script>
import { storeToken } from '@/persistence/token'
import { getRoleRoute } from '@/router'

export default {
  name: 'login',
  data: () => ({
    busy: false,
    success: false,
    loginPayload: {
      user: null,
      password: null
    }
  }),
  methods: {
    async login() {
      this.$ga.event('userInfo', 'login', 'username', this.loginPayload.user)
      // TODO: login with credential
      if ( await this.validateForm() ) {
        this.busy = true
        try {

          let {
            unauthorized,
            forbidden,
            body: { token }
          } = await this.$agent.post('/api/login', this.loginPayload)
                    .ok( ({ok, unauthorized, forbidden}) => ok || unauthorized || forbidden)

          if (unauthorized)
            throw new Error('邮箱或密码不正确')
          if (forbidden)
            throw new Error('账号未启用，请等待组委审核')

          // TODO: store token, redirect to approperiate page
          storeToken(token)
          this.$store.commit('user/token', token)
          this.$router.push( getRoleRoute(this.$store.getters['user/access']) )

          // Note: this.busy is NOT cleared for successful login
          // Should be lazy loading subsequent page
          this.success = true
        } catch(e) {
          this.$message({
            type: 'error',
            message: e.message
          })
          this.busy = false
        }
      }
    },
    validateForm() {
      return new Promise( resolve => this.$refs.loginForm.validate(resolve) )
    }
  },
  async mounted() {
    // TODO: find stored token, then try auto login
  }
}
</script>

<style lang="stylus" scoped>
@import "../style/flex"
.login-ctrl
  flex-vert: flex-start center
  .login-form
    width: 100%
  .el-form-item
    margin-bottom: .5em
  .el-button
    width: 160px
    margin: .5em 0
  .el-alert
    width: auto
    padding: 4px 16px
    margin-bottom: .5em
  .btn
    min-width: 240px
</style>
