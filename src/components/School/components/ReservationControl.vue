<template>
  <div class="reservation-control">
    <HotelStock ref="stock">
      <template slot="operation" scope="scope">
        <el-button
          type="primary"
          size="small"
          :disabled="scope.hotel.available <= reservations.filter( function(e) { return e.hotel.id === scope.hotel.id } ).length || reservations.length >= max"
          @click="addReservation(scope.hotel)"
        > 预订 </el-button>
      </template>
    </HotelStock>

    <div class="reservation-list">
      <div class="header">
        <b>预订：</b>
      </div>

      <el-table :data="reservations">
        <el-table-column prop="hotel.name" label="酒店" min-width="240" sortable />
        <el-table-column prop="hotel.type" label="房型" width="180" sortable />
        <el-table-column prop="period" label="入住日期" min-width="180">
          <template scope="scope">
            <el-date-picker
              v-model="scope.row.checkIn"
              class="date-picker"
              type="date"
              :disabled="busy"
              placeholder="请选择入住时间"
              :picker-options="getCheckInPickerOptions(scope.row.hotel)"
              @change="validate"
            />
          </template>
        </el-table-column>
        <el-table-column prop="period" label="退房日期" min-width="180">
          <template scope="scope">
            <el-date-picker
              v-model="scope.row.checkOut"
              class="date-picker"
              type="date"
              :disabled="busy"
              placeholder="请选择退房时间"
              :picker-options="getCheckOutPickerOptions(scope.row.hotel)"
              @change="validate"
            />
          </template>
        </el-table-column>
        <el-table-column width="120">
          <template scope="scope">
            <el-button
              type="danger"
              icon="close"
              size="mini"
              @click="removeReservation(scope.$index)"
            > 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="controls">
      <el-button
        type="success"
        size="large"
        :loading="busy"
        :disabled="!valid"
        @click="submit"
      > 确认预订 </el-button>
    </div>

  </div>
</template>

<script>
import HotelStock from './HotelStock'
import { mapGetters } from 'vuex'
import { toDateString, between as dateBetween } from 'lib/date-util'

export default {
  name: 'reservation-control',
  components: {
    HotelStock,
  },
  props: {
    round: {
      type: String,
      required: true,
    },
    max: {
      type: Number,
      default: +Infinity
    }
  },
  computed: {
    ... mapGetters({
      school: 'user/school',
      authorization: 'user/authorization',
      conferenceStartDate: 'config/conferenceStartDate',
      conferenceEndDate: 'config/conferenceEndDate',
    })
  },
  data: () => ({
    busy: false,
    reservations: [],
    valid: false
  }),
  methods: {
    addReservation(hotel) {
      this.reservations.push({
        hotel,
        checkIn: null,
        checkOut: null
      })
      this.validate()
    },
    removeReservation(idx) {
      this.reservations.splice(idx, 1)
      this.validate()
    },
    getCheckInPickerOptions(hotel) {
      return {
        disabledDate: (date) => ! dateBetween(date, hotel.notBefore, this.conferenceStartDate || hotel.notAfter)
      }
    },
    getCheckOutPickerOptions(hotel) {
      return {
        disabledDate: (date) => ! dateBetween(date, this.conferenceEndDate || hotel.notBefore, hotel.notAfter)
      }
    },
    async validate() {
      this.valid =  this.reservations.every( $ => $.checkIn && $.checkOut )
      return this.valid
    },
    async submit() {
      this.busy = true
      let payload = this.reservations.map( $ => ({
        hotel: $.hotel.id,
        checkIn: toDateString($.checkIn),
        checkOut: toDateString($.checkOut),
      }) )
      try {
        let {
          ok,
          status
        } = await this.$agent.post('/api/schools/'+this.school+'/reservations/')
                  .set( ... this.authorization )
                  .send( payload )
                  .ok( ({ok, status}) => ok || status === 410 )
        if (ok) {
          this.$notify({
            type: 'success',
            title: '预订成功',
            duration: 5000
          })
          this.$emit('success')
        }
        if (status == 410) {
          this.$notify({
            type: 'warning',
            title: '酒店已被抢订，请修改预订信息！',
            duration: 5000
          })
          await this.$refs.stock.fetch()
        }
      } catch(e) {
        this.$notify({
          type: 'error',
          title: e.message,
          duration: 0
        })
      } finally {
        this.busy = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../../style/flex"
.header
  padding: 10px 15px
.reservation-list
  margin: 2em 0
.controls
  text-align: center
.el-date-editor.date-picker
  width: 100%
</style>
