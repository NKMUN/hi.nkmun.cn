<template>
  <div class="school-mgmt">

    <Precondition
      :loader="loadSchool"
      @loaded="parseSchool"
    />

    <template v-if="loaded">

      <div class="heading">
        <el-menu
          mode="horizontal"
          background-color="#56acf0"
          text-color="#ffffff"
          active-text-color="rgb(255, 214, 99)"
          default-active="/school/"
          :router="true"
          class="menu"
        >
          <el-menu-item index="/school/"> 概要 </el-menu-item>
          <el-menu-item v-if="stage === '1.relinquishment'"
                        index="/school/relinquishment/"> 一轮名额确认 </el-menu-item>
          <el-menu-item v-if="stage === '1.exchange'"
                        index="/school/exchange/"> 一轮名额交换 </el-menu-item>
          <el-menu-item v-if="stage === '1.reservation'"
                        index="/school/reservation/"> 一轮酒店预订 </el-menu-item>
          <el-menu-item v-if="stage === '1.payment'"
                        index="/school/payment/"> 一轮付款 </el-menu-item>
          <el-menu-item v-if="stage === '2.reservation'"
                        index="/school/reservation/"> 追加酒店预订 </el-menu-item>
          <el-menu-item v-if="stage === '2.payment'"
                        index="/school/payment/"> 追加付款 </el-menu-item>
          <el-menu-item v-if="stage === '3.confirm'"
                        index="/school/representatives/"> 代表信息 </el-menu-item>
          <el-menu-item v-if="stage === '3.confirm' || stage === '9.complete'"
                        index="/school/confirm/"> 确认 </el-menu-item>
        </el-menu>

        <Logout />
      </div>

      <div class="overview" v-if="!renderSubComponent">
        <el-alert
          v-for="(m, index) in messages"
          :key="index"
          type="warning"
          :title="m.title"
          :description="m.description"
          :closable="false"
          show-icon
        />
        <div class="layout">
          <Todo class="todo" :stage="stage" />
          <div class="right">
            <SeatView
              :showRound1="true"
              :showExchange="stage === '1.exchange'"
              :showRound2="hasRound2Seat"
              :showTotal="hasRound2Seat"
            />
            <ReservationControl
              style="margin-top: 2em;"
              readonly
              :school="id"
            />
          </div>
        </div>
      </div>

      <router-view class="wrap" v-if="renderSubComponent" />

    </template>

  </div>
</template>

<script>
import Precondition from '@/components/Precondition'
import Todo from '@/components/School/Todo'
import SeatView from '@/components/School/components/SeatView'
import ReservationControl from '@/components/Admin/components/ReservationControl'
import { mapGetters } from 'vuex'
import 'vue-awesome/icons/sign-out'

export default {
  name: 'school-mgmt',
  components: {
    Precondition,
    Todo,
    SeatView,
    ReservationControl,
  },
  computed: {
    ... mapGetters({
      id: 'user/school',
      stage: 'school/stage',
      seat: 'school/seat',
      messages: 'school/messages',
    }),
    loaded() {
      return this.stage
    },
    renderSubComponent() {
      return this.$route.path !== '/school/' && this.id
    },
    hasRound2Seat() {
      const seat2 = this.seat && this.seat['2']
      let seat2Total = 0
      for (let k in seat2)
        seat2Total += seat2[k]
      return parseInt(this.stage[0], 10) >= 2 || seat2Total > 0
    }
  },
  methods: {
    logout() {
      this.$router.replace('/logout')
    },
    loadSchool() {
      return this.$agent.get('/api/schools/'+this.id).body()
    },
    parseSchool(school) {
      this.$store.commit('school/school', school)
    }
  }
}
</script>


<style lang="stylus" scoped>
@import "../style/flex"
.school-mgmt
  flex-vert: flex-start stretch
  max-height: 100vh
  overflow-y: auto
  .heading
    flex-horz: flex-start stretch
    flex-shrink: 0
    *
      border-radius: 0px
    .menu
      padding-left: 8ch
      flex-grow: 1
  .wrap
    flex-grow: 1
    flex-shrink: 0
    padding-bottom: 3em
    &.stretch
      padding-bottom: 0
      flex-shrink: 1
      flex-grow: 1
  .overview
    flex-vert: flex-start center
    margin-top: 2em
    align-self: center
    width: 100%
    .layout
      align-self: stretch
      flex-horz: center flex-start
      .todo
        flex-shrink: 0
        margin-right: 48px
      .right
        min-width: 25ch
    .el-alert
      width: auto
      align-self: center
      padding-left: 4ch
      padding-right: 4ch
      margin: 2em 0
      max-width: 40ch
</style>
