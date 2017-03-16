<template>
  <div class="reservation-control">
    <HotelStock ref="stock">
      <template slot="operation" scope="scope">
        <el-button
          type="primary"
          size="small"
          :disabled="scope.hotel.available <= reservations.filter( function(e) { return e.hotel.id === scope.hotel.id } ).length"
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
        <el-table-column prop="period" label="入住时间" min-width="260">
          <template scope="scope">
            <el-date-picker
              v-model="scope.row.period"
              type="daterange"
              :disabled="busy"
              placeholder="请选择入住时间"
              :picker-options="getPickerOptions(scope.row.hotel)"
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
import toDateString from 'lib/to-date-string'
import moment from 'moment'
import momentTz from 'moment-timezone'

export default {
  name: 'reservation-control',
  components: {
    HotelStock,
  },
  props: {
    round: {
      type: String,
      default: "1",
    },
    max: {
      type: Number,
      default: +Infinity
    }
  },
  computed: {
    ... mapGetters({
      school: 'user/school',
      authorization: 'user/authorization'
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
        period: []
      })
      this.validate()
    },
    removeReservation(idx) {
      this.reservations.splice(idx, 1)
      this.validate()
    },
    getPickerOptions(hotel) {
      return {
        disabledDate(date) {
          let notBefore = moment.tz(hotel.notBefore, 'Asia/Shanghai')
          let notAfter = moment.tz(hotel.notAfter, 'Asia/Shanghai')
          return !moment(date).isBetween(notBefore, notAfter, null, "[]")
        }
      }
    },
    async validate() {
      this.valid =  this.reservations.every( $ => $.period[0] && $.period[1] )
      return this.valid
    },
    async submit() {
      this.busy = true
      let payload = this.reservations.map( $ => ({
        hotel: $.hotel.id,
        checkIn: toDateString($.period[0]),
        checkOut: toDateString($.period[1]),
        round: this.round
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
          Notification({
            type: 'success',
            title: '预订成功',
            duration: 5000
          })
          this.$emit('success')
        }
        if (status == 410) {
          Notification({
            type: 'warning',
            title: '酒店已被抢订，请修改预订信息！',
            duration: 5000
          })
          await this.$refs.stock.fetch()
        }
      } catch(e) {
        Notification({
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
</style>
