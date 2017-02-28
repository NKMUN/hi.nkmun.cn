<template>
  <div class="root-mgmt">
    <div class="heading">
      <el-alert
        type="error"
        title="上帝模式：请谨慎操作！"
        description="具有完全修改权限，不当操作会损坏系统。"
        :closable="false"
      />
      <el-button
        type="warning"
        icon="upload2"
        @click="logout"
      > 退出 </el-button>
    </div>

    <el-menu
      mode="horizontal"
      theme="light"
      default-active="overview"
      :router="true"
      class="menu"
    >
      <el-menu-item index="overview"> 概要 </el-menu-item>
      <el-menu-item index="initialize"> 初始化 </el-menu-item>
      <el-menu-item index="config"> 全局设置 </el-menu-item>
      <el-menu-item index="application"> 报名表 </el-menu-item>
      <el-menu-item index="sessions"> 会场管理 </el-menu-item>
      <el-menu-item index="mail"> 邮件 </el-menu-item>
      <el-menu-item index="hotels"> 酒店管理 </el-menu-item>
    </el-menu>

    <router-view class="wrap" />
  </div>
</template>

<script>
import { Alert, Menu, MenuItem, Button } from 'element-ui'

export default {
  name: 'root-mgmt',
  components: {
    [Alert.name]: Alert,
    [Menu.name]: Menu,
    [MenuItem.name]: MenuItem,
    [Button.name]: Button
  },
  data: () => ({
  }),
  methods: {
    logout() {
      this.$router.replace('/logout')
    }
  },
}
</script>

<style lang="stylus" scoped>
@import "../style/flex"
.root-mgmt
  flex-vert: flex-start stretch
  max-height: 100vh
  overflow-y: auto
  .heading
    flex-horz: flex-start stretch
    flex-shrink: 0
    *
      border-radius: 0px
    .el-alert
      display: block
      width: auto
      flex-grow: 1
  .menu
    padding-left: 8ch
  .wrap
    flex-grow: 1
    flex-shrink: 0
    padding-bottom: 2em
</style>
