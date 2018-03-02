<template>
  <div class="academic-director-mgmt">
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
        <el-menu-item v-if="hasAccess('academic-director')" index="/academic-director/"> <i class="icon el-icon-menu" /> </el-menu-item>
        <el-menu-item v-if="hasAccess('academic-director')" index="/academic-director/config/"> 报名设置 </el-menu-item>
        <el-menu-item v-if="hasAccess('academic-director')" index="/academic-director/applications/"> 报名审核  </el-menu-item>
        <el-menu-item v-if="hasAccess('academic-director')" index="/academic-director/export/"> 导出 </el-menu-item>
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
import 'vue-awesome/icons/wrench'
import 'vue-awesome/icons/pencil'
import 'vue-awesome/icons/exclamation-circle'
import 'vue-awesome/icons/calendar-check-o'
import 'vue-awesome/icons/file-text-o'
import 'vue-awesome/icons/comments-o'
import 'vue-awesome/icons/envelope-o'
import 'vue-awesome/icons/bed'
import 'vue-awesome/icons/users'
import 'vue-awesome/icons/user-secret'
import 'vue-awesome/icons/table'
import 'vue-awesome/icons/institution'
import 'vue-awesome/icons/link'


export default {
  name: 'admin-mgmt',
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
.academic-director-mgmt
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
    overflow-y: auto
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
  .el-menu .fa-icon
    opacity: 0.8
    transform: scale(0.8, 0.8)
  .icon
    color: inherit
</style>