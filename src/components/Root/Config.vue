<template>
  <div class="system-config" v-loading.body="!config">
    <h3>全局设置</h3>
    <template v-if="config">
      <el-form label-position="right" label-width="18ch" class="form">
        <el-form-item label="学术团队申请">
          <el-checkbox v-model="config.applyAcademicStaff" :disabled="busy" />
        </el-form-item>
        <el-form-item label="学校报名">
          <el-checkbox v-model="config.applySchool" :disabled="busy" />
        </el-form-item>
        <el-form-item label="个人代表报名">
          <el-checkbox v-model="config.applyIndividual" :disabled="busy" />
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
          <el-input v-model="config.conferenceName" autocomplete="off" :disabled="busy" />
        </el-form-item>
        <el-form-item label="会期ID">
          <el-input v-model="config.conferenceId" :disabled="busy" autocomplete="off" placeholder="请输入英文或数字" />
        </el-form-item>
        <el-form-item label="会议日期">
          <el-date-picker
            v-model="period"
            type="daterange"
            value-format="yyyy-MM-dd"
            :disabled="busy"
          />
        </el-form-item>
        <el-form-item label="早鸟折扣结束时间">
          <el-date-picker
            @input="localTs => { config.earlybirdDiscountEndTime = toChinaStandardTime(localTs) }"
            :value="toLocalTime(config.earlybirdDiscountEndTime)"
            type="datetime"
            value-format="timestamp"
            :disabled="busy"
            placeholder="未选时间，无早鸟折扣"
          />
          <span class="hint">（中国标准时间 / UTC+8）</span>
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
    /*
     * CAVEAT: toChinaStandardTime(), toLocalTime()
    *          works if `ts` +- TZ-diff does not lie within DST switching time
     */
    toChinaStandardTime(ts) {
      if (!ts) return ts
      const d = new Date(ts)
      return d.getTime() - (d.getTimezoneOffset() + 480) * 60 * 1000
    },
    toLocalTime(ts) {
      if (!ts) return ts
      const d = new Date(ts)
      return d.getTime() + (d.getTimezoneOffset() + 480) * 60 * 1000
    },
    parseConfig(config) {
      this.config = {
        applyAcademicStaff: config.applyAcademicStaff,
        register: config.register,
        applySchool: config.applySchool,
        applyIndividual: config.applyIndividual,
        login: config.login,
        reserveHotel: config.reserveHotel,
        conferenceName: config.conferenceName,
        conferenceId: config.conferenceId,
        earlybirdDiscountEndTime: config.earlybirdDiscountEndTime
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
  .hint
    font-size: 80%
    color: #8492A6
</style>
