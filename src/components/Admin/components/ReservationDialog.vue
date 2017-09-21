<template>
  <el-dialog
    :title="title"
    size="small"
    width="60ch"
    top="5%"
    :visible="Boolean(resolve)"
    :before-close="close"
  >
    <HotelStock v-if="mode === 'add'" ref="stock" style="margin-bottom: 2em" enable-selection v-model="hotel" />

    <div class="reservation">
      <ul class="note">
        <li v-if="conferenceStartDate && conferenceEndDate">
          本次会议时间为
          <code class="date">{{conferenceStartDate}}</code>
          至
          <code class="date">{{conferenceEndDate}}</code>
        </li>
      </ul>
      <el-form label-width="108px" label-position="right">
        <el-form-item v-if="mode === 'edit'" label="酒店"> {{ hotel ? hotel.name: '' }} </el-form-item>
        <el-form-item v-if="mode === 'edit'" label="房型"> {{ hotel ? hotel.type: '' }} </el-form-item>
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

        <el-form-item label="拼房状态" v-if="roomshareState">
          <el-tag v-if="roomshareState === 'pending'" type="primary"> 已发出 </el-tag>
          <el-tag v-if="roomshareState === 'accepted'" type="success"> 已确认 </el-tag>
          <el-tag v-if="roomshareState === 'rejected'" type="danger"> 已拒绝 </el-tag>
          <el-tag v-if="roomshareState === 'modified'" type="warning"> 已修改 </el-tag>
        </el-form-item>

        <el-form-item label="拼房学校">
          <el-select
            :disabled="!hotel || busy || (!isStaff && roomshareState === 'accepted')"
            v-model="roomshareSchool"
            v-loading="!schools"
            @change="clearRoomshareState"
          >
            <el-option-group label="不拼房">
              <el-option
                :value="null"
                label="[ 不拼房 ]"
              />
            </el-option-group>
            <el-option-group label="学校">
              <el-option
                v-for="s in roomshareSchools"
                :key="s.id"
                :disabled="s.disabled"
                :value="s.id"
                :label="s.name"
              > {{ s.name }} </el-option>
              <div
                v-if="roomshareSchools.length === 0"
                class="el-select-dropdown__item is-disabled"
              > 无可拼房学校 </div>
            </el-option-group>
            <!--
              NOTE: for future personal delegate
              <el-option-group label="个人代表">
              <el-option
                v-for="s in roomshareSchools"
                :key="s.id"
                :disabled="s.disabled"
                :value="s.id"
                :label="s.name"
              > {{ s.name }} </el-option>
              </el-option-group>
            -->
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div class="controls">
      <el-button
        :loading="busy"
        icon="circle-cross"
        @click="close"
      > 取消 </el-button>
      <el-button
        v-if="mode === 'add'"
        type="success"
        icon="circle-check"
        :loading="busy"
        :disabled="!checkIn || !checkOut"
        @click="confirm"
      > 确认 </el-button>
      <el-button
        v-if="mode === 'edit'"
        type="primary"
        icon="edit"
        :loading="busy"
        :disabled="!checkIn || !checkOut"
        @click="confirm"
      > 确认 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import HotelStock from './HotelStock'
import { toDateString, between as dateBetween } from '@/lib/date-util'
import { mapGetters } from 'vuex'
import { hasAccess } from '@/lib/access'

const ONE_DAY = 24 * 60 * 60 * 1000

const canRoomshareWithSchool = (school) =>
  school.stage.endsWith('.reservation')

export default {
  name: 'reservation-dialog',
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
    },
    roomshareSchools() {
      if (!this.schools) return null
      return this.schools
          .map(school => ({
            id: school.id,
            name: school.name,
            disabled: !canRoomshareWithSchool(school)
          }))
          .filter($ => $.id !== this.school)  // can't be self
          .filter($ => !$.disabled)
          .sort((a, b) => a.name.localeCompare(b.name))
    },
    title() {
      switch(this.mode) {
        case 'add': return '新增预定'
        case 'edit': return '修改预定'
        default: return ''
      }
    }
  },
  data: () => ({
    mode: 'add',
    hotel: null,
    checkIn: null,
    checkOut: null,
    roomshare: null,
    roomshareState: null,
    roomshareSchool: null,
    originalRoomshareSchool: null,
    school: null,
    schools: [],
    resolve: null,
    clearInterval: () => null,
  }),
  props: {
    busy: { type: Boolean, default: false },
  },
  methods: {
    close() {
      if (this.resolve)
        this.resolve = this.resolve(null)
    },
    open({
      hotel,
      checkIn,
      checkOut,
      school,
      roomshare = null
    } = {}, mode = 'add') {
      this.mode = mode
      this.hotel = hotel
      this.checkIn = checkIn
      this.checkOut = checkOut
      this.school = school || this.$store.getters['user/school']
      this.roomshare = roomshare
      this.roomshareState = roomshare ? roomshare.state : null
      this.roomshareSchool = roomshare ? roomshare.school.id : null
      this.originalRoomshareSchool = this.roomshareSchool
      
      this.$agent.get('/api/schools').then(({body}) => this.schools = body)

      if (this.$refs.stock)
        this.$refs.stock.fetch()

      return new Promise( r => this.resolve = r )
    },
    confirm() {
      if (this.resolve)
        this.resolve = this.resolve({
          hotel: this.hotel.id,
          checkIn: toDateString(this.checkIn),
          checkOut: toDateString(this.checkOut),
          roomshare: this.roomshareSchool
        })
    },
    setHotel(hotel) {
      this.hotel = hotel
      this.checkIn = null
      this.checkOut = null
    },
    clearRoomshareState() {
      if (this.roomshareState && this.roomshare) {
        this.roomshareState = this.originalRoomshareSchool === this.roomshareSchool ? this.roomshare.state : 'modified'
      }
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
  },
  mounted() {
    const interval = 1000
    const itvl = setInterval(() => {
      if (this.$refs.stock && this.resolve) {
        this.$refs.stock.refresh()
      }
    }, interval)
  },
  beforeDestroy() {
    this.clearInterval()
  }
}
</script>

<style lang="stylus" scoped>
@import "../../../style/flex"
.reservation
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
.controls
  margin: 1em auto
  text-align: center
</style>
