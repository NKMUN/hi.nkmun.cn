<template>
  <div class="relinquish-mgmt">
    <h3>名额确认</h3>

    <div class="note">
      <ul>
        <li>请确认一轮分配名额</li>
        <li>放弃后的名额不能进行名额交换</li>
        <li>请谨慎放弃双代会场的名额</li>
      </ul>
    </div>

    <SeatView :seat="seat" style="align-self: center">
      <template slot="operation" scope="scope">
        <el-button
          v-if="!scope.session.reserved"
          size="mini"
          type="danger"
          icon="warning"
          :disabled="busy"
          @click="relinquishSeat(scope.session)"
        > 放弃 </el-button>
      </template>
    </SeatView>

    <div class="leader-attendance">
      <LeaderAttendance v-model="leaderAttend" />
    </div>

    <el-button
      size="large"
      type="primary"
      :disabled="leaderAttend!==true && leaderAttend!==false"
      :loading="busy"
      @click="confirm"
    > 确认名额 </el-button>

  </div>
</template>

<script>

import LeaderAttendance from '../form/LeaderAttendance'
import SeatView from './components/SeatView'
import { mapGetters } from 'vuex'
import store from '@/store/index'

export default {
  name: 'school-relinquish',
  components: {
    LeaderAttendance,
    SeatView
  },
  computed: {
    ...mapGetters({
      id: 'user/school',
      seat: 'school/seat',
      sessions: 'config/sessions'
    })
  },
  data: () => ({
    busy: false,
    leaderAttend: null
  }),
  methods: {
    async relinquishSeat(session) {
      let remaining = this.seat['1'][session.id] - 1
      let name = session.name
      let message = '操作完成后，'+name+'的剩余名额为：'+remaining
      if ( await this.$serious(message, name) ) {
        this.busy = true
        try {
          const updatedSeat = await this.$agent
            .post('/api/schools/'+this.id+'/seat')
            .send({ session: session.id, round: '1', amount: -1 })
            .body()
          this.$store.commit('school/seat', updatedSeat)
          this.$notify({
            type: 'warning',
            title: '已放弃名额',
            duration: 5000
          })
        } catch(e) {
          this.$notify({
            type: 'error',
            title: '未能放弃名额',
            message: e.message,
            duration: 0
          })
        } finally {
          this.busy = false
        }
      }
    },
    async confirm() {
      this.busy = true
      try {
        const updatedSeat = await this.$agent
          .post('/api/schools/'+this.id+'/seat')
          .send({ confirmRelinquish: true, leaderAttend: this.leaderAttend })
          .body()
        this.$store.commit('school/seat', updatedSeat)
        this.$store.commit('school/stage', '1.exchange')
        this.$router.replace('/school/exchange/')
        this.$notify({
          type: 'success',
          title: '名额已确认',
          duration: 5000
        })
      } catch(e) {
        this.$notify({
          type: 'error',
          title: '名额确认失败',
          message: e.message,
          duration: 0
        })
      } finally {
        this.busy = false
      }
    }
  },
  beforeRouteEnter(from, to, next) {
    // guard against wrong stage
    if (store.getters['school/stage'] === '1.relinquishment')
      next()
    else
      next('/school/')
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
.relinquish-mgmt
  flex-vert: flex-start center
  .note
    white-space: nowrap
    color: #475669
    font-size: 14px
  .seat-view
    width: 100%
    max-width: 30ch
  .leader-attendance
    margin-top: 3em
</style>
