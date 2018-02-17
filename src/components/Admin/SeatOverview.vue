<template>

  <div class="seat-overview">
    <h3>
      名额总览
      <RefreshButton @click="fetch" :loading="busy" throttle />
    </h3>
    <div class="layout">
      <SeatAllocationView ref="seatAllocation" />
    </div>
  </div>

</template>

<script>
import SeatAllocationView from "../SeatAllocationView"

export default {
  name: 'school-mgmt',
  components: {
    SeatAllocationView
  },
  data() {
    return {
      busy: false
    }
  },
  methods: {
    async fetch() {
      this.busy = true
      await this.$refs.seatAllocation.fetch()
      this.busy = false
    }
  }
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
