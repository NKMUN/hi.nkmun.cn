<template>

  <div class="seat-overview">
    <h3>名额总览</h3>
    <div class="layout">
      <SeatAllocationView class="seat-allocation-view" />
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import SeatAllocationView from "../SeatAllocationView"

export default {
  name: 'school-mgmt',
  components: {
    SeatAllocationView
  },
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex";
.seat-overview
  flex-vert: flex-start center
  *
    flex-shrink: 0
  .layout
    align-self: stretch
    padding-left: 8ch
    padding-right: 8ch
</style>
