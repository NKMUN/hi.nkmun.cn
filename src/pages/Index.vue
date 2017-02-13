<template>
  <div>
    <Banner />

    <div class="layout">
      <LayoutCenter class="welcome">
        <div class="homepic left">
          <img width="356" height="221" alt="Join us, now!" src="../assets/homepic.jpg" />
        </div>

        <div class="right">
          <div class="top">
            <Login v-if="showLogin" @success="" @failure="" />

            <el-button
              v-if="showRegister"
              type="primary"
              @click="goRegister()"
            > 领队注册 </el-button>

            <el-button
              v-if="showApply"
              type="primary"
              @click="goApply()"
            > 报名 </el-button>
          </div>

          <div class="bottom">
            <el-button
              class="admin-login"
              v-if="!showLogin"
              size="mini"
              :plain="true"
              type="text"
              @click="toggleAdminLogin()"
            > 管理员登录 </el-button>
          </div>
        </div>
      </LayoutCenter>
    </div>

    <Copyright />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Button } from 'element-ui'
import LayoutCenter from 'components/LayoutCenter'
import Login from 'components/Login'
import Banner from 'components/Banner'
import Copyright from 'components/Copyright'

export default {
  name: 'index',
  components: {
    [Button.name]: Button,
    LayoutCenter,
    Login,
    Banner,
    Copyright
  },
  data: () => ({
    showAdminLogin: false,
    loadingRegister: false,
    loadingApply: false,
  }),
  computed: {
    ...mapGetters({
      showApply:       'config/apply',
      showRegister:    'config/register',
      showLeaderLogin: 'config/login',
    }),
    showLogin() { return this.showLeaderLogin || this.showAdminLogin }
  },
  methods: {
    toggleAdminLogin() {
      this.showAdminLogin = !this.showAdminLogin
    },
    goRegister() {
      this.loadingRegister = true
      this.$router.push('/register/')
    },
    goApply() {
      this.loadingApply = true
      this.$router.push('/apply/')
    }
  }
}
</script>

<style lang="stylus">
@import "../style/flex"
</style>

<style lang="stylus" scoped>
@import "../style/flex"
.layout
  flex-grow: 1
.welcome
  margin-top: 96px
  align-items: flex-start
  .left
    flex-horz: center center
    margin: 0 5%
  .right
    flex-vert: flex-start center
    margin: 0 5%
    min-width: 356px
    align-self: stretch
    justify-content: flex-start
    align-items: center
    .top
      flex-grow: 1
      flex-vert: center center
      .el-button
        width: 160px
        margin: .5em 0
</style>
