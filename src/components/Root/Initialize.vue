<template>
  <div class="initialization">
    <el-alert
      class="alert"
      title="警告！"
      description="初始化会清空所有数据！"
      type="warning"
      :closable="false"
      show-icon>
    </el-alert>

    <el-button
      type="danger"
      size="large"
      icon="el-icon-setting"
      :loading="busy"
      @click="confirmInitialization"
    >{{ busy ? '正在初始化...' : '系统初始化' }}</el-button>

  </div>
</template>

<script>
export default {
  name: 'root-overview',
  data: () => ({
    busy: false
  }),
  methods: {
    async confirmInitialization() {
      let confirmed = await this.$serious('初始化会清空所有数据，请再次确认！', 'hi.nkmun.cn')
      if (confirmed) {
        this.busy = true
        try{
          await this.$agent.post('/api/initialize', {confirm: true} )
          this.$notify({
            type: 'success',
            title: '初始化成功',
            duration: 5000
          })
        } catch(e) {
          this.$notify({
            type: 'error',
            title: '初始化失败',
            message: '请联系运维：'+e.message,
            duration: 0
          })
        } finally {
          this.busy = false
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
.initialization
  flex-vert: flex-start center
  padding-bottom: 2em
  overflow: auto
  .alert
    width: auto
    margin: 2em 0
</style>
