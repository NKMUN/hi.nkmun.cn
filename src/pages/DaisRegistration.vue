<template>
  <div class="dais-reg">
    <Banner />

    <div class="layout">
      <DaisMember v-model="data" class="form" ref="dais" />

      <h4 class="controls">声明</h4>
      <p class="hint">本人已完全了解并同意汇文模联关于学术团队的报销政策（QQ群可下载），愿意遵守相关的细节和要求。</p>
      <p class="hint">本人重申已经签署并愿意遵守汇文学术团队声明书的各项要求，在会议期间愿意遵守大会组委会及学术总监关于活动的各项规定与安排。若有违反，本人愿意承担相应的责任，并负担相应的损失。</p>
      <div class="controls">
        <el-checkbox v-model="confirm">我已阅读并同意以上声明</el-checkbox>
      </div>

      <div class="controls">
        <el-button
          type="primary"
          icon="el-icon-check"
          @click="submit"
          :disabled="!confirm"
        > 提交 </el-button>
      </div>
    </div>

    <Copyright />
  </div>
</template>

<script>
import LayoutCenter from '@/components/LayoutCenter'
import Banner from '@/components/Banner'
import Copyright from '@/components/Copyright'
import DaisMember from '@/components/form/DaisMember'
import { toDateString } from '@/lib/date-util'

export default {
  components: {
    Banner,
    Copyright,
    DaisMember,
    LayoutCenter
  },
  data() {
    return {
      data: null,
      confirm: false,
      busy: false
    }
  },
  methods: {
    async submit() {
      if (await this.$refs.dais.validate()) {
        this.busy = true
        try {
          let payload = {
            ... this.data,
            arriveDate: this.data.arriveDepartDate ? toDateString(this.data.arriveDepartDate[0]) : null,
            departDate: this.data.arriveDepartDate ? toDateString(this.data.arriveDepartDate[1]) : null,
            checkInDate: this.data.hotelDate ? toDateString(this.data.hotelDate[0]) : null,
            checkOutDate: this.data.hotelDate ? toDateString(this.data.hotelDate[1]) : null
          }
          delete payload.hotelDate
          delete payload.arriveDepartDate

          await this.$agent.post('/api/daises/').send(payload)
          await this.$msgbox({
            type: 'success',
            title: '提交成功',
            message: '点击确定返回首页',
            showCancelButton: false,
            showConfirmButton: true
          })
          this.$router.replace('/')
        } catch(e) {
          this.$notify({
            type: 'error',
            title: '提交失败',
            message: e.message
          })
        } finally {
          this.busy = false
        }
      }
    }
  },
}

</script>

<style lang="stylus" scoped>
.layout
  flex-grow: 1
  padding-bottom: 3em
.form
  min-width: 40ch
  margin: 0 auto
  & *
    flex-shrink: 0
.controls
  text-align: center
  margin: 1em auto
.hint
  font-size: 80%
  max-width: 80ch
  margin: 1em auto
</style>
