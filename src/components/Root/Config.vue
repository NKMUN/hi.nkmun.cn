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
import { mapGetters } from 'vuex'
import { toDateString } from 'lib/date-util'

export default {
  name: 'global-config',
  computed: {
    ... mapGetters({
      authorization: 'user/authorization'
    })
  },
  data: () => ({
    config: null,
    busy: false,
    period: null,
  }),
  methods: {
    async fetch() {
      try {
        let {
          body
        } = await this.$agent.get('/api/config/config')
        this.config = {
          register: body.register,
          apply: body.apply,
          login: body.login,
        }
        this.period = [body.conferenceStartDate, body.conferenceEndDate]
      } catch(e) {
        this.$notify({
          type: 'error',
          title: '获取全局设置失败',
          message: e.message,
          duration: 0
        })
      }
    },
    async update() {
      this.busy = true
      try {
        let {
          body
        } = await this.$agent.put('/api/config/config')
                  .set( ... this.authorization )
                  .send({
                    ... this.config,
                    conferenceStartDate: toDateString(this.period[0]),
                    conferenceEndDate: toDateString(this.period[1]),
                  })
        this.config = body
        this.$store.commit('config/update', body)
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
  .form
    white-space: nowrap
</style>
