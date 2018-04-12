<template>
  <div class="exchange-mgmt">

    <SeatView
      class="seat-view"
      :seat="seat"
      :showRound1="true"
      :showExchange="stage === '1.exchange'"
      :showTotal="parseInt(stage[0], 10) >= 2"
    />

    <div class="note">
      <ul>
        <li>交换中的名额不能再次用于交换</li>
        <li>结束交换时，双代会场必须有偶数名额</li>
        <li>结束交换时，待处理的交换申请将<b>全部拒绝</b></li>
        <li>结束交换时，己方已发出，但对方未确认的交换申请会<b>全部取消</b></li>
      </ul>
    </div>

    <el-button
      size="large"
      type="danger"
      :disabled="!seatValid"
      :loading="busy"
      @click="confirm"
      class="btn-confirm"
    > 结束名额交换 </el-button>

    <hr style="align-self: center; width: 80%; color: #D3DCE6; border-style: solid; border-width: 1px" />

    <div class="request-lists">
      <ExchangeRequestList class="requests" @accept="handleAccept" />
      <ExchangeRequestCancelList class="requests" />
    </div>

    <SeatExchangeControl class="seat-overview" ref="list" @exchange="exchange" :busy="busy" />

  </div>
</template>

<script>
import ExchangeRequestList from './components/ExchangeRequestList'
import ExchangeRequestCancelList from './components/ExchangeRequestCancelList'
import SeatView from './components/SeatView'
import SeatExchangeControl from './components/SeatExchangeControl'
import { mapGetters } from 'vuex'
import store from '@/store/index'
import SessionUtils from '@/lib/session-utils'


export default {
  name: 'school-exchange',
  components: {
    ExchangeRequestList,
    ExchangeRequestCancelList,
    SeatView,
    SeatExchangeControl
  },
  mixins: [
    SessionUtils
  ],
  computed: {
    ...mapGetters({
      id: 'user/school',
      seat: 'school/seat',
      stage: 'school/stage',
      sessions: 'config/sessions'
    }),
    seatValid() {
      return this.SESSIONS().every( session => {
        let numOfSeat = (this.seat && this.seat['1'] && this.seat['1'][session.id]) || 0
        if (session.dual && numOfSeat % 2 !== 0)
          return false
        return true
      })
    }
  },
  data: () => ({
    busy: false
  }),
  methods: {
    async confirm() {
      if ( ! await this.$serious('将确认名额交换，未处理的请求将全部取消。', '我确认当前名额正确') )
        return
      this.busy = true
      try {
        let {
          status,
          ok,
          body: updatedSeat
        } = await this.$agent.post('/api/schools/'+this.id+'/seat')
                  .send({ confirmExchange: true })
                  .ok( ({ok, status}) => ok || status === 410 )
        if (status === 410) {
          this.$notify({
            type: 'warning',
            title: '未能确认名额交换',
            message: '双代会场没有偶数名额，请刷新页面！'
          })
        }
        if (ok) {
          this.$store.commit('school/seat', updatedSeat)
          this.$store.commit('school/stage', '1.reservation')
          this.$router.replace('/school/reservation')
          this.$notify({
            type: 'success',
            title: '名额交换已确认',
            duration: 5000
          })
        }
      } catch(e) {
        this.$notify({
          type: 'error',
          title: '未能确认名额交换',
          message: e.message,
          duration: 0
        })
      } finally {
        this.busy = false
      }
    },
    async exchange({
      target,
      targetSession,
      selfSession
    }) {
      this.busy = true
      try {
        let {
          ok,
          status,
          body: newExchange
        } = await this.$agent.post('/api/exchanges/')
                  .send({ target, targetSession, selfSession })
                  .ok( ({ok, status}) => ok || status === 409 )
        if (status === 410) {
          this.$notify({
            type: 'warning',
            title: 'Oops. 可交换名额不足',
            duration: 5000
          })
          this.$refs.exchangeDialog.close()
        }
        if (ok) {
          this.$notify({
            type: 'success',
            title: '名额交换申请已发送',
            duration: 5000
          })
          this.$store.commit('school/addExchange', newExchange)
        }
      } catch(e) {
        this.$notify({
          type: 'error',
          title: '名额交换失败',
          message: e.message
        })
      } finally {
        this.busy = false
      }
    },
    async handleAccept() {
      await this.$refs.list.fetch()
    }
  },
  beforeRouteEnter(from, to, next) {
    // guard against wrong stage
    if (store.getters['school/stage'] === '1.exchange')
      next()
    else
      next('/school/')
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
.exchange-mgmt
  flex-vert: flex-start center
  padding-bottom: 3em
  overflow-y: scroll
  .seat-view
    margin: 2em 0 1em 0
  .btn-confirm
    margin: 0 0 1em 0
  .note
    white-space: nowrap
    color: #475669
    font-size: 14px
  .seats
    margin: 1em 0
    width: 100%
    max-width: 30ch
  .requests
    margin: 1em 0
    width: 100%
    max-width: 40ch
  .seat-overview
    min-width: 480px
    width: 80%
  .request-lists
    align-self: stretch
    flex-horz: center flex-start
    > *
      flex: 1 0 auto
      max-width: 45ch
      &:first-child
        margin-right: 4ch
.exchange-dialog-content
  flex-vert: flex-start center
</style>
