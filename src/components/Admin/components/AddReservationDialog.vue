<template>
  <el-dialog title="新增预订" :visible="visible" :before-close="() => {visible = false}">
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
      <ul class="note">
        <li v-if="conferenceStartDate && conferenceEndDate">
          本次会议时间为
          <code class="date">{{conferenceStartDate}}</code>
          至
          <code class="date">{{conferenceEndDate}}</code>
        </li>
      </ul>
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
import { toDateString, between as dateBetween} from '@/lib/date-util'
import { mapGetters } from 'vuex'

export default {
  name: 'add-reservation-dialog',
  components: {
    HotelStock
  },
  computed: {
    ... mapGetters({
      conferenceStartDate: 'config/conferenceStartDate',
      conferenceEndDate: 'config/conferenceEndDate',
    }),
  },
  data: () => ({
    hotel: null,
    period: null,
    visible: false
  }),
  props: {
    busy: { type: Boolean, default: false },
  },
  methods: {
    close() {
      this.visible = false
    },
    open() {
      this.hotel = null
      this.period = null
      this.visible = true
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
            return !dateBetween(date, hotel.notBefore, hotel.notAfter)
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
.note
  white-space: nowrap
  color: #475669
  font-size: 14px
  .amount, .date
    font-weight: bolder
</style>
