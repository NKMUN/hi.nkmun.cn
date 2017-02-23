<template>
  <div class="exchange-mgmt">

    <SeatView :seats="seats" class="seats">
      <template slot="operation" scope="scope">
        <el-tooltip placement="top" v-if="scope.seat.exchange">
          <div slot="content">
            {{ scope.seat.exchange.school }} {{ SESSION(scope.seat.exchange.session).name }}
          </div>
          <el-tag type="gray">交换中</el-tag>
        </el-tooltip>
      </template>
    </SeatView>

    <el-button
      size="large"
      type="primary"
      :disabled="!seatValid"
      :loading="busy"
      @click="confirm"
      class="btn-confirm"
    > 确认名额 </el-button>

    <hr style="align-self: stretch; width: 80%; color: #D3DCE6; border-style: solid; border-width: 1px" />

    <div class="note">
      <ul>
        <li>交换中的名额不能再次用于交换</li>
        <li>名额确认时，双代会场必须有偶数名额</li>
      </ul>
    </div>

    <ExchangeRequestList class="requests" />

    <SeatExchangeControl class="seat-overview" @exchange="handleExchange" />

  </div>
</template>

<script>
import { Alert, Button, Tag, Notification, Tooltip, Card, Dialog } from 'element-ui'
import ExchangeRequestList from './ExchangeRequestList'
import SeatView from './SeatView'
import SeatExchangeControl from './SeatExchangeControl'
import { mapGetters } from 'vuex'
import store from 'store/index'
import groupSeatsBySession from 'lib/group-seats'
import SessionUtils from 'lib/session-utils'

export default {
  name: 'school-exchange',
  components: {
    [Tag.name]: Tag,
    [Button.name]: Button,
    [Tooltip.name]: Tooltip,
    [Card.name]: Card,
    [Dialog.name]: Dialog,
    ExchangeRequestList,
    SeatView,
    SeatExchangeControl
  },
  mixins: [
    SessionUtils
  ],
  computed: {
    ...mapGetters({
      school: 'user/school',
      authorization: 'user/authorization',
      seats: 'school/seats',
      sessions: 'config/sessions'
    }),
    seatValid() {
      return groupSeatsBySession(this.seats).every( g => {
        let session = this.SESSION(g.session)
        if (session.dual && g.list.length % 2 !==0)
          return false
        return true
      })
    }
  },
  data: () => ({
    busy: false,
    exchange: {
      target: null,
      targetSession: null,
      selfSeat: null
    }
  }),
  methods: {
    async confirm() {
      this.busy = true
      try {
        let {
          ok
        } = await this.$agent.post('/api/schools/'+this.school+'/seats/')
                  .query({ confirmExchange: true })
                  .set( ... this.authorization )
        this.$store.commit('school/stage', '1.reservation')
        this.$router.replace('/school/reservation/')
        Notification({
          type: 'success',
          title: '名额已确认',
          duration: 5000
        })
      } catch(e) {
        Notification({
          type: 'error',
          title: '名额确认失败',
          message: e.message,
          duration: 0
        })
      } finally {
        this.busy = false
      }
    },
    async handleExchange(school, session) {
      this.exchange.target = school
      this.exchange.targetSession = session
      this.exchange.selfSeat = null
      this.$refs.exchangeDialog.open()
    },
    async confirmExchange() {
      let targetId = this.exchange.target.school
      let targetSession = this.exchange.targetSession.id
      let selfSeat = this.exchange.selfSeat
      this.busy = true
      try {
        this.$refs.exchangeDialog.close()
        this.$store.commit('school/setSeatExchangable', {id: selfSeat.id, flag: false})
        Notification({
          type: 'success',
          title: '名额交换申请已发送',
          duration: 5000
        })
      } catch(e) {
      } finally {
        this.busy = false
      }

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
.exchange-dialog-content
  flex-vert: flex-start center
</style>
