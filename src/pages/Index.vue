<template>
  <div class="wrap">
    <Banner />

    <div class="layout">
      <LayoutCenter class="welcome">
        <div class="homepic left">
          <img width="484" height="300" alt="Motion, now!" src="../assets/homepic.jpg" />
        </div>

        <div class="right">
          <div class="top">
            <Login v-if="showLogin" />

            <el-button
              class="btn"
              v-if="showRegister"
              type="primary"
              @click="$router.push('/register/')"
            > 参会注册 </el-button>

            <el-button
              class="btn"
              v-if="showApplyAcademicStaff"
              type="primary"
              @click="$router.push('/apply/academic/')"
            > 学术团队报名 </el-button>

            <el-button
              class="btn"
              v-if="showApply"
              type="primary"
              @click="$router.push('/apply/')"
            > 报名 </el-button>
          </div>

          <div class="bottom">
            <el-button
              class="btn admin-login"
              v-if="!showLogin"
              size="mini"
              plain
              type="text"
              @click="showAdminLogin = !showAdminLogin"
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
import LayoutCenter from '@/components/LayoutCenter'
import Login from '@/components/Login'
import Banner from '@/components/Banner'
import Copyright from '@/components/Copyright'

export default {
  name: 'index',
  components: {
    LayoutCenter,
    Login,
    Banner,
    Copyright
  },
  data: () => ({
    showAdminLogin: false
  }),
  computed: {
    ...mapGetters({
      showApplyAcademicStaff: 'config/applyAcademicStaff',
      showRegister: 'config/register',
      showLeaderLogin: 'config/login',
      applySchool: 'config/applySchool',
      applyIndividual: 'config/applyIndividual',
    }),
    showApply() { return this.applySchool || this.applyIndividual },
    showLogin() { return this.showLeaderLogin || this.showAdminLogin }
  }
}
</script>

<style lang="stylus">
@import "../style/flex"
</style>

<style lang="stylus" scoped>
@import "../style/flex"
.wrap
  flex-vert: flex-start stretch
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
  .btn
    min-width: 240px
</style>
