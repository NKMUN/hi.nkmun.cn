<template>
  <div class="dais-mgmt">
    <div class="heading">
      <el-menu
        mode="horizontal"
        background-color="#56acf0"
        text-color="#ffffff"
        active-text-color="rgb(255, 214, 99)"
        default-active="overview"
        :router="true"
        class="menu"
      >
        <el-menu-item v-if="hasAccess('dais')" index="/dais/session-seats/"> <icon name="users" /> 席位管理 </el-menu-item>
        <el-menu-item v-if="hasAccess('dais')" index="/dais/user-info/"> <icon name="user" /> 个人信息 </el-menu-item>
      </el-menu>
      
      <Logout />
    </div>

    <div class="wrap">
      <router-view class="container" />
    </div>

  </div>
</template>

<script>
import { hasAccess } from '@/lib/access'
import 'vue-awesome/icons/users'
import 'vue-awesome/icons/user'
import 'vue-awesome/icons/sign-out'
import DaisUserInfo from '@/components/Dais/DaisUserInfo'

export default {
  name: 'dais-mgmt',
  components: {
    DaisUserInfo
  },
  methods: {
    logout() {
      this.$router.replace('/logout')
    },
    hasAccess(requiedAccess) {
      return hasAccess(this.$store.getters['user/access'], requiedAccess)
    }
  },
}
</script>

<style lang="stylus" scoped>
@import "../style/flex"
.dais-mgmt
  flex-vert: flex-start stretch
  max-height: 100vh
  overflow-y: auto
  .heading
    flex-horz: flex-start stretch
    flex-shrink: 0
    *
      border-radius: 0px
    .menu
      padding-left: 8ch
      flex-grow: 1
      vertical-align: sub
  .wrap
    flex-grow: 1
    overflow-y: scroll
    overflow-x: hidden
    flex-horz: stretch flex-start
    .container
      flex-grow: 1
  .el-alert
    width: auto
    align-self: center
    padding-left: 4ch
    padding-right: 4ch
    margin-top: 4em
  .fa-icon
    opacity: 0.7
    transform: scale(0.8, 0.8)
</style>
