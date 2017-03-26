<template>
  <div class="reservation">
    <h3>一轮酒店预订</h3>

    <SeatView :showRound1="true" />

    <div class="note">
      <ul>
        <li>最多可预订 <code class="amount">{{ maxNumOfRooms }}</code> 个房间</li>
        <li>如果有特殊需求，请与组委联系</li>
      </ul>
    </div>

    <ReservationControl :round="'1'" :max="maxNumOfRooms" class="reservation-control" @success="handleSuccess" />
  </div>
</template>

<script>
import SeatView from './components/SeatView'
import ReservationControl from './components/ReservationControl'
import { mapGetters } from 'vuex'

export default {
  name: 'reservation',
  components: {
    SeatView,
    ReservationControl
  },
  computed: {
    ... mapGetters({
      seat: 'school/seat'
    }),
    maxNumOfRooms() {
      let s = 0
      for (let k in this.seat["1"])
        s += this.seat["1"][k]
      return Math.floor( s / 2 + 2 )
    }
  },
  methods: {
    handleSuccess() {
      this.$store.commit('school/stage', '1.payment')
      this.$router.replace('/school/payment/1')
    }
  },
  beforeRouteEnter(from, to, next) {
    // guard against wrong stage
    if (store.getters['school/stage'] === '1.reservation')
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
  .amount
    font-weight: bolder
  .reservation-control
    margin-bottom: 3em
</style>
