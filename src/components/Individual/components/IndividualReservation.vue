<template>
  <div class="reservation">
    <template v-if="reserveHotel">
      <div class="top" v-if="!readonly">
        <ul class="note">
          <li>最多可预订 <code class="amount">{{ maxNumOfRooms }}</code> 个房间</li>
          <li v-if="conferenceStartDate && conferenceEndDate">
            本次会议时间为
            <code class="date">{{conferenceStartDate}}</code>
            至
            <code class="date">{{conferenceEndDate}}</code>
          </li>
          <li>如果有特殊需求，请与组委联系</li>
        </ul>
      </div>

      <ReservationControl
        :disabled="busy"
        :readonly="readonly"
        :round="round"
        :max="maxNumOfRooms"
        :school="school"
      />

      <el-button
        v-if="!readonly"
        class="confirm"
        type="danger"
        size="large"
        icon="el-icon-check"
        @click="confirm"
      > 结束预定 </el-button>
    </template>

    <template v-else>
      <el-alert
        class="element-alert-icon-align-fix"
        title="酒店预订暂未开放"
        description="请关注组委最新通知"
        type="info"
        show-icon
        :closable="false">
      </el-alert>
    </template>
  </div>
</template>

<script>
import ReservationControl from '@/components/Admin/components/ReservationControl'
import { mapGetters } from 'vuex'

export default {
  name: 'reservation',
  components: {
    ReservationControl
  },
  computed: {
    ...mapGetters({
      stage: 'school/stage',
      round: 'school/round',
      reserveHotel: 'config/reserveHotel',
      conferenceStartDate: 'config/conferenceStartDate',
      conferenceEndDate: 'config/conferenceEndDate',
      school: 'user/school',
    }),
    maxNumOfRooms() {
      return null
    },
    readonly() {
      return !this.stage.endsWith('.reservation')
    }
  },
  data() {
    return {
      busy: false
    }
  },
  methods: {
    handleSuccess() {
      this.$store.commit('school/stage', `${this.round}.payment`)
      this.$router.replace(`/individual/payment`)
    },
    async confirm() {
      if ( await this.$serious('将确认酒店预订，请确定拼房请求已全部处理。', '我确认我已经完成酒店预订') ) {
        return this.$agent
          .post('/api/schools/'+this.school+'/progress')
          .send({ confirmReservation: 1 })
          .then(
            res => {
              this.$message({
                type: 'success',
                title: '已确认住宿预定'
              })
              this.$store.commit('school/stage', this.$store.getters['school/stage'].replace('.reservation', '.payment'))
              this.$router.replace('/individual/payment/')
            },
            err => {
              this.$msgbox({
                type: 'warning',
                title: '未能确认预定',
                message: '请处理所有拼房请求，并撤回未被接受的拼房请求'
              })
            }
          )
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../../style/flex"
.reservation
  flex-vert: flex-start center
  .top
    flex-horz: flex-start center
    margin-bottom: 2em
    & > :last-child
      margin-left: 4ch
  .note
    white-space: nowrap
    color: #475669
    font-size: 14px
  .seat-view
    width: 100%
    max-width: 30ch
  .amount, .date
    font-weight: bolder
  .reservation-control
    margin-bottom: 3em
  .confirm
    margin-top: 2em
  .el-alert
    margin: 2em auto
    width: auto
</style>
