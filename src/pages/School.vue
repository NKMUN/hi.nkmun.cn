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
          theme="light"
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
                        index="/school/payment"> 一轮付款 </el-menu-item>
          <el-menu-item v-if="stage === '2.reservation'"
                        index="/school/reservation-2/"> 二轮酒店预订 </el-menu-item>
          <el-menu-item v-if="stage === '2.payment'"
                        index="/school/payment-2/"> 二轮付款 </el-menu-item>
          <el-menu-item v-if="stage === '3.confirm'"
                        index="/school/confirm/"> 信息确认 </el-menu-item>
        </el-menu>

        <el-button
          type="warning"
          icon="upload2"
          @click="logout"
        > 退出 </el-button>
      </div>

      <div class="overview" v-if="!renderSubComponent">
        <el-alert
          v-for="m in messages"
          type="warning"
          :title="m.title"
          :description="m.description"
          :closable="false"
          show-icon
        />
        <div class="layout">
          <Todo class="todo" :stage="stage" />
          <div class="right">
            <h4>现有名额</h4>
            <SeatView
              :seat="seat"
              :showRound1="true"
              :showRound2="parseInt(stage[0], 10) >= 2"
              :showExchange="stage === '1.exchange'"
              :showTotal="parseInt(stage[0], 10) >= 2"
            />
          </div>
        </div>
      </div>

      <router-view class="wrap" v-if="renderSubComponent" />

    </template>

  </div>
</template>

<script>
import { Alert, Menu, MenuItem, Button, Tag } from 'element-ui'
import Precondition from 'components/Precondition'
import Todo from 'components/School/Todo'
import SeatView from 'components/School/SeatView'
import { mapGetters } from 'vuex'

export default {
  name: 'school-mgmt',
  components: {
    [Alert.name]: Alert,
    [Menu.name]: Menu,
    [MenuItem.name]: MenuItem,
    [Button.name]: Button,
    [Tag.name]: Tag,
    Precondition,
    Todo,
    SeatView
  },
  computed: {
    ... mapGetters({
      authorization:  'user/authorization',
      id: 'user/school',
      stage: 'school/stage',
      seat: 'school/seat',
      messages: 'school/messages'
    }),
    loaded() {
      return this.stage
    },
    renderSubComponent() {
      return this.$route.path !== '/school/' && this.id
    }
  },
  methods: {
    logout() {
      this.$router.replace('/logout')
    },
    loadSchool() {
      return this.$agent.get('/api/schools/'+this.id)
             .set( ... this.authorization )
             .then( r => r.body )
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
