<template>
  <el-dialog
    title="新增预订"
    size="full"
    width="100%"
    :visible="visible"
    :before-close="() => {visible = false}"
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
        <el-form-item label="入住日期">
          <el-date-picker
            v-model="checkIn"
            type="date"
            :disabled="!hotel || busy"
            placeholder="请选择入住日期"
            :picker-options="getCheckInPickerOptions(hotel)"
            @input="checkCheckOutDate"
            :default-value="conferenceStartDate"
          />
        </el-form-item>
        <el-form-item label="退房日期">
           <el-date-picker
            v-model="checkOut"
            type="date"
            :disabled="!hotel || busy"
            placeholder="请选择退房日期"
            :picker-options="getCheckOutPickerOptions(hotel)"
            :default-value="conferenceEndDate"
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
          :disabled="!checkIn || !checkOut"
          @click="emit"
        > 确认 </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import HotelStock from '../../School/components/HotelStock'
import { toDateString, between as dateBetween } from '@/lib/date-util'
import { mapGetters } from 'vuex'
import { hasAccess } from '@/lib/access'

const ONE_DAY = 24 * 60 * 60 * 1000

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
    isStaff() {
      return hasAccess(this.$store.getters['user/access'], 'staff.accommodation')
    }
  },
  data: () => ({
    hotel: null,
    checkIn: null,
    checkOut: null,
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
      this.checkIn = null
      this.checkOut = null
      this.visible = true
      if (this.$refs.stock)
        this.$refs.stock.fetch()
    },
    emit() {
      this.$emit('confirm', {
        hotel: this.hotel.id,
        checkIn: toDateString(this.checkIn),
        checkOut: toDateString(this.checkOut)
      })
    },
    setHotel(hotel) {
      this.hotel = hotel
      this.checkIn = null
      this.checkOut = null
    },
    getCheckInPickerOptions(hotel) {
      if (!hotel) return {}
      const oneDayBeforeLastDay = new Date(hotel.notAfter) - ONE_DAY
      const startDate = hotel.notBefore
      const endDate = this.isStaff ? oneDayBeforeLastDay : this.conferenceStartDate
      return { disabledDate: date => ! dateBetween(date, startDate, endDate) }
    },
    getCheckOutPickerOptions(hotel) {
      if (!hotel || !this.checkIn) return {}
      const startDate = this.isStaff ? +this.checkIn + ONE_DAY : this.conferenceEndDate
      const endDate = hotel.notAfter
      return { disabledDate: date => ! dateBetween(date, startDate, endDate) }
    },
    checkCheckOutDate() {
      if (this.checkIn && this.checkOut) {
        const oneDayAfterCheckIn = +this.checkIn + ONE_DAY
        if (this.checkOut < oneDayAfterCheckIn)
          this.checkOut = new Date(oneDayAfterCheckIn)
      }
    }
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
