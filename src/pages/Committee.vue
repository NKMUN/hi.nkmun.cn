<template>
  <div class="committee-reg">
    <Banner />

    <div class="layout">
      <CommitteeMember v-model="data" class="form" ref="committee" />

      <div class="controls">
        <el-button
          type="primary"
          icon="el-icon-check"
          @click="submit"
          :loading="busy"
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
import CommitteeMember from '@/components/form/CommitteeMember'
import { toDateString } from '@/lib/date-util'

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
      busy: false
    }
  },
  methods: {
    async submit() {
      if (await this.$refs.committee.validate()) {
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

          await this.$agent.post('/api/committees/').send(payload)
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
