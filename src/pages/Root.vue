<template>
  <div class="root-mgmt">
    <el-alert
      type="error"
      title="上帝模式：请谨慎操作！"
      description="具有完全修改权限，不当操作会损坏系统。"
      :closable="false"
    />

    <el-menu
      mode="horizontal"
      theme="light"
      default-active="overview"
      :router="true"
      class="menu"
    >
      <el-menu-item index="overview"> 概要 </el-menu-item>
      <el-menu-item index="initialize"> 初始化 </el-menu-item>
      <el-menu-item index="sessions"> 会场设置 </el-menu-item>
    </el-menu>

    <router-view class="wrap" />
  </div>
</template>

<script>
import Vue from 'vue'
import { Alert, Menu, MenuItem } from 'element-ui'

export default {
  name: 'root-mgmt',
  components: {
    [Alert.name]: Alert,
    [Menu.name]: Menu,
    [MenuItem.name]: MenuItem,
  },
  data: () => ({
  }),
}
</script>

<style lang="stylus" scoped>
@import "../style/flex"
.root-mgmt
  flex-vert: flex-start stretch
  .menu
    padding-left: 8ch
  .wrap
    flex-grow: 1
</style>
