<template>
  <div class="admin-mgmt">
    <div class="heading">
      <el-menu
        mode="horizontal"
        theme="dark"
        default-active="overview"
        :router="true"
        class="menu"
      >
        <el-menu-item index="/admin/applications/"> 报名管理 </el-menu-item>
        <el-menu-item index="/admin/schools/"> 学校管理 </el-menu-item>
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
export default {
  name: 'admin-mgmt',
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
