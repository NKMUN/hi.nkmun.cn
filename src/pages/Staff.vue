<template>
  <div class="admin-mgmt">
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
        <el-submenu index="0" v-if="hasAccess('admin')">
          <template slot="title"> <icon name="wrench"/> 系统管理 </template>
          <el-menu-item index="/staff/admin/initialize/"> <icon name="exclamation-circle"/> 初始化 </el-menu-item>
          <el-menu-item index="/staff/admin/config/"> <icon name="calendar-check"/> 会议进程 </el-menu-item>
          <el-menu-item index="/staff/admin/application/"> <icon name="file-alt"/> 报名 </el-menu-item>
          <el-menu-item index="/staff/admin/sessions/"> <icon name="comments"/> 会场 </el-menu-item>
          <el-menu-item index="/staff/admin/mail/"> <icon name="envelope"/> 邮件 </el-menu-item>
          <el-menu-item index="/staff/admin/hotels/"> <icon name="bed"/> 酒店 </el-menu-item>
          <el-menu-item index="/staff/admin/users/"> <icon name="users"/> 用户 </el-menu-item>
          <el-menu-item index="/staff/admin/links/"> <icon name="link"/> 内部链接 </el-menu-item>
        </el-submenu>

        <el-submenu index="1" v-if="hasAccess('academic-director') || hasAccess('admin')">
          <template slot="title"> <icon name="pencil-alt"/> 学术总监 </template>
          <el-menu-item index="/staff/academic-director/config/"> <icon name="file-alt"/> 学术团队申请 </el-menu-item>
          <el-menu-item index="/staff/academic-director/applications/"> <icon name="check-square"/> 报名审核  </el-menu-item>
          <el-menu-item index="/staff/academic-director/daises/"> <icon name="user-secret"/> 主席管理  </el-menu-item>
        </el-submenu>

        <el-submenu index="2" v-if="hasAccess('staff')">
          <template slot="title"> 总览 </template>
          <el-menu-item index="/staff/overview/seat"> <icon name="table"/> 名额 </el-menu-item>
          <el-menu-item index="/staff/overview/stage"> <icon name="university"/> 学校 </el-menu-item>
        </el-submenu>

        <el-menu-item v-if="hasAccess('staff.application')" index="/staff/applications/"> 报名管理 </el-menu-item>
        <el-menu-item v-if="hasAccess('staff')" index="/staff/schools/"> 参会管理 </el-menu-item>
        <el-menu-item v-if="hasAccess('staff', 'finance')" index="/staff/payments/"> 缴费管理 </el-menu-item>
        <el-menu-item v-if="hasAccess('finance')" index="/staff/reimbursements/"> 报销管理 </el-menu-item>
        <el-menu-item v-if="hasAccess('staff.representative')" index="/staff/representatives/"> 代表管理 </el-menu-item>
        <el-menu-item v-if="hasAccess('finance')" index="/staff/exports/"> 导出 </el-menu-item>
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
import 'vue-awesome/icons/pencil-alt'
import 'vue-awesome/icons/exclamation-circle'
import 'vue-awesome/icons/calendar-check'
import 'vue-awesome/icons/file-alt'
import 'vue-awesome/icons/check-square'
import 'vue-awesome/icons/user-secret'
import 'vue-awesome/icons/comments'
import 'vue-awesome/icons/envelope'
import 'vue-awesome/icons/bed'
import 'vue-awesome/icons/users'
import 'vue-awesome/icons/table'
import 'vue-awesome/icons/university'
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
.admin-mgmt
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
</style>