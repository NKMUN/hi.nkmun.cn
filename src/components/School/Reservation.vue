<template>
  <div class="reservation">
    <h3>{{round | roundText}}酒店预订</h3>

    <SeatView :showRound1="this.round==='1'" :showRound2="this.round==='2'" />

    <div class="note">
      <ul>
        <li>最多可预订 <code class="amount">{{ maxNumOfRooms }}</code> 个房间</li>
        <li v-if="conferenceStartDate && conferenceEndDate">
          本次会议时间为
          <code class="date">{{conferenceStartDate}}</code>
          至
          <code class="date">{{conferenceEndDate}}</code>
        </li>
        <li>如果有特殊需求，请与组委联系</li>
      </ul>
    </div>

    <ReservationControl :round="round" :max="maxNumOfRooms" class="reservation-control" @success="handleSuccess" />
  </div>
</template>

<script>
import SeatView from './components/SeatView'
import ReservationControl from './components/ReservationControl'
import { mapGetters } from 'vuex'
import store from '@/store/index'
import roundText from '@/lib/round-text'

export default {
  name: 'reservation',
  components: {
    SeatView,
    ReservationControl
  },
  computed: {
    ... mapGetters({
      seat: 'school/seat',
      round: 'school/round',
      conferenceStartDate: 'config/conferenceStartDate',
      conferenceEndDate: 'config/conferenceEndDate'
    }),
    maxNumOfRooms() {
      let s = 0
      for (let k in this.seat[this.round])
        s += this.seat[this.round][k]
      return Math.floor( s / 2 + 2 )
    }
  },
  methods: {
    handleSuccess() {
      this.$store.commit('school/stage', `${this.round}.payment`)
      this.$router.replace(`/school/payment`)
    }
  },
  filters: { roundText },
  beforeRouteEnter(from, to, next) {
    // guard against wrong stage
    if ( (store.getters['school/stage'] || '').endsWith('.reservation') )
      next()
    else
      next('/school/')
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
.reservation
  flex-vert: flex-start center
  .note
    white-space: nowrap
    color: #475669
    font-size: 14px
  .seat-view
    width: 100%
    max-width: 30ch
  .amount, .date
    font-weight: bolder
  .reservation-control
    margin-bottom: 3em
</style>
