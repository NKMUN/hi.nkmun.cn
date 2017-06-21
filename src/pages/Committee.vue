<template>
  <div class="committee-reg">
    <Banner />

    <div class="layout">
      <CommitteeMember v-model="data" class="form" ref="committee" />

      <h4 class="controls">声明</h4>
      <p class="hint">本人已完全了解并同意汇文模联关于主席/组委的报销政策（QQ群可下载），愿意遵守相关的细节和要求。</p>
      <p class="hint">本人重申已经签署并愿意遵守汇文学术团队声明书的各项要求，在会议期间愿意遵守大会组委会及学术总监关于活动的各项规定与安排。若有违反，本人愿意承担相应的责任，并负担相应的损失。</p>
      <div class="controls">
        <el-checkbox v-model="confirm">我已阅读并同意以上声明</el-checkbox>
      </div>

      <div class="controls">
        <el-button
          type="primary"
          icon="check"
          @click="submit"
          :disabled="!confirm"
        > 提交 </el-button>
      </div>
    </div>

    <Copyright />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LayoutCenter from 'components/LayoutCenter'
import Banner from 'components/Banner'
import Copyright from 'components/Copyright'
import CommitteeMember from 'components/form/CommitteeMember'
import { toDateString } from 'lib/date-util'

export default {
  components: {
    Banner,
    Copyright,
    CommitteeMember,
    LayoutCenter
  },
  data() {
    return {
      data: null,
      confirm: false
    }
  },
  methods: {
    async submit() {
      if (await this.$refs.committee.validate()) {
        try {
          let payload = {
            ... this.data,
            arriveDate: toDateString(this.data.arriveDepartDate[0]),
            departDate: toDateString(this.data.arriveDepartDate[1]),
            checkInDate: toDateString(this.data.hotelDate[0]),
            checkOutDate: toDateString(this.data.hotelDate[1])
          }
          delete payload.hotelDate
          delete payload.arriveDepartDate

          let {
            ok,
            body
          } = await this.$agent.post('/api/committees/').send(payload)

          if (ok) {
            await this.$msgbox({
              type: 'success',
              title: '提交成功',
              message: '点击确定返回首页',
              showCancelButton: false,
              showConfirmButton: true
            })
            this.$router.replace('/')
          }
        } catch(e) {
          this.$notify({
            type: 'error',
            title: '提交失败',
            message: e.message
          })
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
