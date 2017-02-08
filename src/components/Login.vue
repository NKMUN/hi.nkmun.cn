<template>
  <div class="login-ctrl">
    <el-alert
      :style=" alert.show ? 'visibility: initial' : 'visibility: hidden' "
      show-icon
      :type="alert.type"
      :title="alert.title"
      :closable="false"
    />

    <el-form
      class="login-form"
      label-width="64px"
      :model="loginPayload"
      ref="loginForm"
    >

      <el-form-item label="用户名" prop="user">
        <el-input
          type="text"
          placeholder="邮箱或用户名"
          autofocus
          :disabled="busy"
          v-model="loginPayload.user"
        />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          placeholder="密码"
          :disabled="busy"
          v-model="loginPayload.password"
        />
      </el-form-item>

    </el-form>

    <el-button
      type="success"
      :loading="busy"
      @click="login()"
    > 登录 </el-button>

  </div>
</template>

<script>
import { Form, Input, Button, FormItem, Alert, Popover } from 'element-ui'
import { getToken, storeToken, clearToken } from 'persistence/token'
import getRoleRoute from 'router/role-dispatch.js'

export default {
  name: 'login',
  components: {
    [Form.name]:     Form,
    [FormItem.name]: FormItem,
    [Input.name]:    Input,
    [Button.name]:   Button,
    [Alert.name]:    Alert,
    [Popover.name]:  Popover
  },
  data: () => ({
    busy: false,
    alert: {
      show: false,
      type: "warning",
      title: "placeholder"    // use placeholder to provide proper height computation ?
    },
    loginPayload: {
      user: null,
      password: null
    }
  }),
  methods: {
    showAlert(title, type="warning") {
      this.alert.title = title
      this.alert.type = type
      this.alert.show = true
    },
    clearAlert() {
      this.alert.show = false
    },
    async login() {
      // TODO: login with credential
      if ( await this.validateForm() ) {
        this.busy = true
        try {

          let {
            ok,
            forbidden,
            body: { token }
          } = await this.$agent.post('/api/login', this.loginPayload)
                    .ok( ({ok, forbidden}) => ok || forbidden )

          if (forbidden)
            throw new Error('用户名或密码不正确')

          // TODO: store token, redirect to approperiate page
          storeToken(token)
          this.$store.commit('user/token', token)
          this.$router.push( getRoleRoute(this.$store.getters['user/role'] ) )

          // Note: this.busy is NOT cleared for successful login
          this.showAlert('登录成功，请稍等……')
        } catch(e) {
          this.showAlert(e.message, 'error')
          this.busy = false
        }
      }
    },
    async refreshToken(token) {
      // TODO: refresh previously stored token
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
  .el-form-item
    margin-bottom: .5em
  .el-button
    width: 160px
    margin: .5em 0
  .el-alert
    width: auto
    padding: 4px 16px
    margin-bottom: .5em
</style>
