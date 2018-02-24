<template>
  <div class="system-config" v-loading.body="!config">
    <h3>全局设置</h3>
    <template v-if="config">
      <el-form label-position="right" label-width="14ch" class="form">
        <el-form-item label="学术团队申请">
          <el-checkbox v-model="config.applyAcademicStaff" :disabled="busy" />
        </el-form-item>
        <el-form-item label="报名">
          <el-checkbox v-model="config.apply" :disabled="busy" />
        </el-form-item>
        <el-form-item label="代表注册">
          <el-checkbox v-model="config.register" :disabled="busy" />
        </el-form-item>
        <el-form-item label="代表登陆">
          <el-checkbox v-model="config.login" :disabled="busy" />
        </el-form-item>
        <el-form-item label="酒店预订">
          <el-checkbox v-model="config.reserveHotel" :disabled="busy" />
        </el-form-item>
        <el-form-item label="会期名称">
          <el-input v-model="config.conferenceName" :disabled="busy" />
        </el-form-item>
        <el-form-item label="会期ID">
          <el-input v-model="config.conferenceId" :disabled="busy"  placeholder="请输入英文或数字" />
        </el-form-item>
        <el-form-item label="会议日期">
          <el-date-picker
            v-model="period"
            type="daterange"
            value-format="yyyy-MM-dd"
            :disabled="busy"
          />
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        icon="el-icon-check"
        :loading="busy"
        @click="update"
      > 确定 </el-button>
    </template>
  </div>
</template>

<script>
export default {
  name: 'global-config',
  data: () => ({
    config: null,
    busy: false,
    period: null,
  }),
  methods: {
    parseConfig(config) {
      this.config = {
        applyAcademicStaff: config.applyAcademicStaff,
        register: config.register,
        apply: config.apply,
        login: config.login,
        reserveHotel: config.reserveHotel,
        conferenceName: config.conferenceName,
        conferenceId: config.conferenceId
      }
      this.period = config.conferenceStartDate && config.conferenceEndDate
          ? [config.conferenceStartDate, config.conferenceEndDate]
          : null
    },
    fetch() {
      return this.$agent
      .get('/api/config/config')
      .body()
      .then(
        config => this.parseConfig(config),
        err => this.$message({
          type: 'error',
          message: '获取全局设置失败：' + err.message
        })
      )
    },
    async update() {
      this.busy = true
      try {
        const updatedConfig = await this.$agent
          .put('/api/config/config')
          .send({
            ... this.config,
            conferenceStartDate: this.period ? this.period[0] : null,
            conferenceEndDate: this.period ? this.period[1] : null
          })
          .body()
        this.parseConfig(updatedConfig)
        this.$store.commit('config/update', updatedConfig)
        this.$message({
          type: 'success',
          message: '已更新'
        })
      } catch(e) {
        this.$message({
          type: 'error',
          message: '更新全局设置失败：'+ e.message
        })
      } finally {
        this.busy = false
      }
    }
  },
  mounted() {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
.system-config
  flex-vert: flex-start center
  padding-bottom: 2em
  overflow: auto
  .form
    white-space: nowrap
</style>
