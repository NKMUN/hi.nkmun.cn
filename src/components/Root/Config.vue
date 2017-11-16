<template>
  <div class="system-config" v-loading.body="!config">
    <h3>全局设置</h3>
    <template v-if="config">
      <el-form label-position="right" label-width="10ch" class="form">
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
            :disabled="busy"
          />
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        icon="circle-check"
        :loading="busy"
        @click="update"
      > 确定 </el-button>
    </template>
  </div>
</template>

<script>
import { toDateString } from '@/lib/date-util'

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
        register: config.register,
        apply: config.apply,
        login: config.login,
        reserveHotel: config.reserveHotel,
        conferenceName: config.conferenceName,
        conferenceId: config.conferenceId
      }
      this.period = [config.conferenceStartDate, config.conferenceEndDate]
    },
    fetch() {
      return this.$agent
      .get('/api/config/config')
      .body()
      .then(
        config => this.parseConfig(config),
        err => this.$notify({
          type: 'error',
          title: '获取全局设置失败',
          message: err.message,
          duration: 0
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
            conferenceStartDate: toDateString(this.period[0]),
            conferenceEndDate: toDateString(this.period[1]),
          })
          .body()
        this.parseConfig(updatedConfig)
        this.$store.commit('config/update', updatedConfig)
        this.$notify({
          type: 'success',
          title: '已更新',
          duration: 5000
        })
      } catch(e) {
        this.$notify({
          type: 'error',
          title: '更新全局设置失败',
          message: e.message,
          duration: 0
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
