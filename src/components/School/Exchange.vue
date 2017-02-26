<template>
  <div class="exchange-mgmt">

    <SeatView :seats="seats" class="seats">
      <template slot="operation" scope="scope">
        <el-tag v-if="scope.seat.exchange" type="gray">交换中</el-tag>
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

    <SeatExchangeControl class="seat-overview" @exchange="exchange" :busy="busy" />

  </div>
</template>

<script>
import { Alert, Button, Tag, Notification, Card, Dialog } from 'element-ui'
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
    busy: false
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
          body
        } = await this.$agent.post('/api/schools/'+this.school+'/exchanges/')
                  .set( ... this.authorization )
                  .send({ target, targetSession, selfSession })
                  .ok( ({ok, status}) => ok || status === 409 )
        if (status === 409) {
          Notification({
            type: 'warning',
            title: 'Oops. 名额不可用',
            duration: 5000
          })
          this.$refs.exchangeDialog.close()
        }
        if (ok) {
          Notification({
            type: 'success',
            title: '名额交换申请已发送',
            duration: 5000
          })
          this.$store.commit('school/seats', body)
        }
      } catch(e) {
        Notification({
          type: 'error',
          title: '名额交换失败',
          message: e.message
        })
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
  overflow-y: scroll
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
