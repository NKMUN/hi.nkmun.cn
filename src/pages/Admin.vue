<template>
  <div class="admin-mgmt">
    <div class="heading">
      <el-menu
        mode="horizontal"
        theme="light"
        default-active="overview"
        :router="true"
        class="menu"
      >
        <el-menu-item index="/admin/applications/"> 报名管理 </el-menu-item>
      </el-menu>

      <el-button
        type="warning"
        icon="upload2"
        @click="logout"
      > 退出 </el-button>
    </div>

    <router-view class="wrap" v-if="subComponentSelected" />

    <el-alert
      v-if="!subComponentSelected"
      type="info"
      title="欢迎"
      description="请在上方导航栏选择功能"
      show-icon
      :closable="false"
    />

  </div>
</template>

<script>
import { Alert, Menu, MenuItem, Button } from 'element-ui'

export default {
  name: 'admin-mgmt',
  components: {
    [Alert.name]: Alert,
    [Menu.name]: Menu,
    [MenuItem.name]: MenuItem,
    [Button.name]: Button
  },
  data: () => ({
  }),
  computed: {
    subComponentSelected() { return this.$route.path !== '/admin/'}
  },
  methods: {
    logout() {
      this.$router.replace('/logout')
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
  .wrap
    flex-grow: 1
  .el-alert
    width: auto
    align-self: center
    padding-left: 4ch
    padding-right: 4ch
    margin-top: 4em
</style>
