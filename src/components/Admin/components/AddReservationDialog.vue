<template>
  <el-dialog
    title="新增预订"
    ref="dialog"
  >
    <HotelStock ref="stock">
      <template slot="operation" scope="scope">
        <el-button
          type="primary"
          size="small"
          :disabled="scope.hotel.available<=0"
          @click="setHotel(scope.hotel)"
        > 选择 </el-button>
      </template>
    </HotelStock>

    <div class="reservation">
      <h4>预订信息</h4>
      <el-form label-width="108px" label-position="right">
        <el-form-item label="酒店"> {{ hotel ? hotel.name: '' }} </el-form-item>
        <el-form-item label="房型"> {{ hotel ? hotel.type: '' }} </el-form-item>
        <el-form-item label="入住时间">
          <el-date-picker
            v-model="period"
            type="daterange"
            :disabled="!hotel || busy"
            placeholder="请选择入住时间"
            :picker-options="getPickerOptions(hotel)"
          />
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer">
      <div class="controls">
        <el-button
          :loading="busy"
          @click="close()"
        > 取消 </el-button>
        <el-button
          type="primary"
          :loading="busy"
          :disabled="!period || !period[0] || !period[1]"
          @click="emit"
        > 确认 </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import HotelStock from '../../School/components/HotelStock'
import toDateString from 'lib/to-date-string'
import moment from 'moment'
import momentTz from 'moment-timezone'

export default {
  name: 'add-reservation-dialog',
  components: {
    HotelStock
  },
  data: () => ({
    hotel: null,
    period: null
  }),
  props: {
    busy: { type: Boolean, default: false },
  },
  methods: {
    close() {
      this.$refs.dialog.close()
    },
    open() {
      this.hotel = null
      this.period = null
      this.$refs.dialog.open()
      if (this.$refs.stock)
        this.$refs.stock.fetch()
    },
    emit() {
      this.$emit('confirm', {
        hotel: this.hotel.id,
        checkIn: toDateString(this.period[0]),
        checkOut: toDateString(this.period[1])
      })
    },
    setHotel(hotel) {
      this.hotel = hotel
      this.period = null
    },
    getPickerOptions(hotel) {
      return {
        disabledDate(date) {
          if (hotel) {
            let notBefore = moment.tz(hotel.notBefore, 'Asia/Shanghai')
            let notAfter = moment.tz(hotel.notAfter, 'Asia/Shanghai')
            return !moment(date).isBetween(notBefore, notAfter, null, "[]")
          }else{
            return true
          }
        }
      }
    },
  }
}
</script>

<style lang="stylus" scoped>
@import "../../../style/flex"
.reservation
  margin-top: 2em
  flex-vert: flex-start center
  *
    flex-shrink: 0
  h4
    margin-bottom: .5em
.el-form-item
  margin-bottom: 0
</style>
