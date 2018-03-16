<template>
  <div class="individual-mgmt">

    <Precondition
      :loader="loadSchool"
      @loaded="parseSchool"
    />

    <template v-if="loaded">

      <div class="heading">
        <el-menu
          ref="menu"
          mode="horizontal"
          background-color="#56acf0"
          text-color="#ffffff"
          active-text-color="rgb(255, 214, 99)"
          default-active="/individual/"
          :router="true"
          class="menu"
        >
          <el-menu-item index="/individual/"> 概要 </el-menu-item>
          <el-menu-item v-if="stage === '1.payment'"
                        index="/individual/payment/"> 付款 </el-menu-item>
          <el-menu-item index="/individual/info/"> 个人信息 </el-menu-item>
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
          <h4>{{ identifier }}</h4>
          <IndividualSeatView />
          <IndividualReservation style="margin: 2em 0"/>
        </div>

        <el-button
          v-if="stage.endsWith('.payment')"
          type="primary"
          icon="el-icon-arrow-right"
          @click="ev => { $router.push('/individual/payment/'); $refs.menu.activeIndex = '/individual/payment/' }"
        > 去缴费 </el-button>

        <p v-if="stage.endsWith('.paid')"> 已付款，请等待组委审核。 </p>

        <p v-if="stage === '1.complete' || stage === '3.confirm'"> 请核对 <router-link to='/individual/info/'>个人信息</router-link>。 </p>

        <p v-if="stage === '9.complete'"> 个人流程已完成 </p>
      </div>

      <router-view class="wrap" v-if="renderSubComponent" />

    </template>

  </div>
</template>

<script>
import Precondition from '@/components/Precondition'
import IndividualSeatView from '@/components/Individual/components/IndividualSeatView'
import IndividualReservation from '@/components/Individual/components/IndividualReservation'
import { mapGetters } from 'vuex'
import 'vue-awesome/icons/sign-out'

export default {
  name: 'individual-mgmt',
  components: {
    Precondition,
    IndividualSeatView,
    IndividualReservation,
  },
  computed: {
    ... mapGetters({
      id: 'user/school',
      identifier: 'school/identifier',
      stage: 'school/stage',
      messages: 'school/messages',
      reserveHotel: 'config/reserveHotel',
    }),
    loaded() {
      return this.stage
    },
    renderSubComponent() {
      return this.$route.path !== '/individual/' && this.id
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
.individual-mgmt
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
    h4
      text-align: center
    .el-alert
      width: auto
      align-self: center
      padding-left: 4ch
      padding-right: 4ch
      margin: 2em 0
      max-width: 40ch
</style>
