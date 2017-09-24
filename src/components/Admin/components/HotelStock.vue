<template>
  <div class="hotel-stock">
    <el-table
      :data="hotels || []"
      v-loading.body="loading"
      :row-class-name="getRowClassName"
      @click.native="handleClick"
    >
      <el-table-column v-if="enableSelection" width="48">
        <template scope="scope">
          <el-radio
            :value="value"
            :data-id="scope.row.id"
            :label="scope.row"
            :disabled="isHotelDisabled(scope.row)"
            @input="val => $emit('input', val)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="酒店" min-width="240" sortable />
      <el-table-column prop="type" label="房型" width="108" sortable />
      <el-table-column prop="available" label="余量" width="108" sortable />
    </el-table>

  </div>
</template>

<script>
export default {
  name: 'hotel-stock',
  props: {
    value: {
      default: null
    },
    enableSelection: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    loading: false,
    hotels: [],
    clearInterval: () => null
  }),
  methods: {
    async fetch() {
      this.loading = true
      try {
        this.hotels = await this.$agent.get('/api/hotels/').body()
      } catch(e) {

      } finally {
        this.loading = false
      }
    },
    async refresh() {
      // do not set loading flag
      try {
        this.hotels = await this.$agent.get('/api/hotels/').body()
      } catch(e) {
        // ignore error during refresh
      }
      if (this.enableSelection && this.value) {
        // emit new value if selection was made
        const newValue = this.hotels.find(hotel => hotel.id === this.value.id)
        if (this.isHotelDisabled(newValue)) {
          this.$emit('input', null)
          // notify about hotel availability
          this.$notify({
            title: '库存不足',
            message: `${newValue.name} ${newValue.type} 库存不足，请重新选择`,
            type: 'warning',
            duration: 10000,
          })
        } else {
          this.$emit('input', newValue)
        }
      }
    },
    getRowClassName(row, index) {
      if (this.enableSelection) {
        if (row.available === 0)
          return 'disabled'
        if (row === this.value)
          return 'highlight'
      }
    },
    handleClick(ev) {
      if (!this.enableSelection) return
      // NOTE: should PR row click to element
      // find clicked row, then get data-id from radio button
      let cur = ev.target
      while (!cur.classList.contains('el-table')) {
        if (cur.classList.contains('el-table__row')) {
          const hotelId = cur.querySelector('.el-radio').getAttribute('data-id')
          if (hotelId) {
            const hotel = this.hotels.find(hotel => hotel.id === hotelId)
            if (!this.isHotelDisabled(hotel))
              this.$emit('input', hotel)
          }
          return
        }
        cur = cur.parentElement
      }
    },
    isHotelDisabled(hotel) {
      return hotel.available <= 0
    }
  }
}
</script>

<style lang="stylus" scoped>
.header
  padding: 10px 15px
.append-row
  text-align: center
  .fa-icon
    vertical-align: sub
</style>

<style lang="stylus">
.hotel-stock
  margin: 0 auto
  max-width 90ch
  .el-table__row
    cursor: pointer
    &.disabled
      color: #99A9BF
      cursor: not-allowed
    &.highlight
      background-color: #e2f0e4
      &:hover > td
        background-color: #e2f0e4
</style>