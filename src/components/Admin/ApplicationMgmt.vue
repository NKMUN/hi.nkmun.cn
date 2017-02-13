<template>
  <div class="wrap">
    <Precondition
      :loader="configLoader"
      @loaded="configParser"
    />

    <el-menu
      v-if="loaded"
      mode="vertical"
      theme="dark"
      :router="false"
      class="school-list"
      ref="schoolList"
      @select="handleSchoolListSelect"
    >
      <el-menu-item-group title="待处理">
        <el-menu-item
          v-for="entry in listPending"
          :index="entry.id"
        > {{ entry.name }} </el-menu-item>
      </el-menu-item-group>

      <el-menu-item-group title="已处理">
        <el-menu-item
          v-for="entry in listProcessed"
          :index="entry.id"
        > {{ entry.name }} </el-menu-item>
      </el-menu-item-group>
    </el-menu>

    <div class="layout right" v-if="loaded" ref="scroll">

      <div class="layout viewer" v-loading="loadingApplication">
        <template v-if="curApplication">
          <ApplicationViewer
            :data="curApplication"
            :tests="tests"
            class="application-viewer"
          />
          <SeatInput
            class="seat-input"
            v-model="curSeat"
            :sessions="sessions"
            :disabled="busy || curApplication.processed"
            @change="dirty = true"
          />

          <div class="confirm-guard" v-if="!curApplication.processed">
            <el-checkbox v-model="canInvite">发送邀请</el-checkbox>
          </div>

          <el-button-group class="controls" v-if="!curApplication.processed">
            <el-button
              type="success"
              :disabled="!canInvite"
              :loading="busy"
              icon="message"
              @click="sendInvitation"
            > 发送邀请 </el-button>
            <el-button
              type="info"
              :loading="busy"
              icon="check"
              @click="updateAndNext"
            > 保存 <i class="el-icon-arrow-right el-icon--right"> </el-button>
          </el-button-group>
        </template>
      </div>

    </div>
  </div>
</template>

<script>
import {
  Menu,
  MenuItem,
  MenuItemGroup,
  Button,
  ButtonGroup,
  Checkbox,
  Tooltip,
  Notification
} from 'element-ui'
import { mapGetters } from 'vuex'
import Precondition from 'components/Precondition'
import ApplicationViewer from 'components/Admin/ApplicationViewer'
import SeatInput from 'components/Admin/SeatInput'

function bySchoolName(_a, _b) {
  let a = (_a.school && _a.school.name) || ''
  let b = (_a.school && _a.school.name) || ''
  return a.localeCompare(b)
}

export default {
  name: 'application-mgmt',
  components: {
    [Menu.name]: Menu,
    [MenuItem.name]: MenuItem,
    [MenuItemGroup.name]: MenuItemGroup,
    [Button.name]: Button,
    [ButtonGroup.name]: ButtonGroup,
    [Checkbox.name]: Checkbox,
    [Tooltip.name]: Tooltip,
    Precondition,
    ApplicationViewer,
    SeatInput
  },
  computed: {
    ... mapGetters({ authorization: 'user/authorization' }),
    listPending() { return this.applicationList.filter( entry => !entry.processed ) },
    listProcessed() { return this.applicationList.filter( entry => entry.processed ) },
    loaded() { return this.tests && this.sessions && this.applicationList }
  },
  data: () => ({
    loadingApplication: false,
    busy: false,
    applicationList: null,
    tests: null,
    sessions: null,
    canInvite: false,
    curApplication: null,
    curSeat: {},
    dirty: false,
    lastApplicationId: ''
  }),
  methods: {
    configLoader() {
      return Promise.all([
        this.$agent.get('/api/config/application')
          .then( res => res.body ),
        this.$agent.get('/api/sessions')
          .then( res => res.body ),
        this.$agent.get('/api/applications')
          .set( ... this.authorization )
          .then( res => res.body )
      ])
    },
    configParser([ appConf, sessions, applicationList ]) {
      this.tests = appConf.tests
      this.sessions = sessions
      this.applicationList = applicationList
    },
    notifyError(e, message = '操作失败') {
      Notification({
        type: 'error',
        title: message,
        message: e.message,
        duration: 0
      })
    },
    async handleSchoolListSelect(id) {
      if ( !this.loadingApplication && await this.updateSeats()) {
        this.lastApplicationId = id
        await this.fetchApplication(id)
        this.$refs.scroll.scrollTop = 0
      } else {
        this.$refs.schoolList.activedIndex = this.lastApplicationId
      }
    },
    async fetchApplication(id) {
      try {
        this.loadingApplication = true
        let {
          body: application
        } = await this.$agent.get('/api/applications/'+id)
                  .set( ... this.authorization )
        this.curApplication = application
        this.curSeat = application.seat
      } catch(e) {
        this.notifyError(e)
      } finally {
        this.loadingApplication = false
      }
    },
    nextSchool() {
      let curId = (this.curApplication && this.curApplication.id) || null
      let nextIdx = curId ? this.listPending.findIndex( $ => $.id === curId ) + 1 : 0
      if ( nextIdx === this.listPending.length ) {
        this.curApplication = null
        this.$refs.schoolList.activedIndex = ''
        Notification({
          type: 'info',
          title: '申请已全部处理',
          message: '没有更多的待处理申请了',
          duration: 5000
        })
      } else {
        this.$refs.schoolList.activedIndex = this.listPending[nextIdx].id
        this.$refs.schoolList.$emit('select', this.$refs.schoolList.activedIndex)
      }
    },
    async updateSeats() {
      let result = ! this.dirty
      try {
        if ( this.dirty ) {
          let {
            ok,
            status
          } = await this.$agent.patch('/api/applications/'+this.curApplication.id, { seat: this.seat })
                    .set( ... this.authorization )
          if (ok) {
            this.dirty = false
            result = true
            Notification({
              type: 'success',
              title: '已更新',
              message: '已更新'+this.curApplication.school.name+'的名额',
              duration: 5000
            })
          }
        }
      } catch(e) {
        this.notifyError(e)
      } finally {
        this.busy = false
      }
      return result
    },
    async sendInvitation() {
      // TODO: determine send invitation's API
      // TODO: set processed flag if successful
    },
    async updateAndNext() {
      if ( await this.updateSeats() )
        return this.$nextTick( $ => this.nextSchool() )
    }
  },
  async beforeRouteLeave(to, from, next) {
    if ( await this.updateSeats() ) {
      next()
    } else {
      next(false)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
.wrap
  flex-horz: flex-start stretch
  overflow: hidden
  .school-list
    min-width: 20ch
    overflow-x: initial
    overflow-y: scroll
  .layout.right
    overflow-x: initial
    overflow-y: scroll
    flex-grow: 1
  .confirm-guard
    text-align: center
  .application-viewer, .seat-input, .confirm-guard, .controls
    display: table
    margin: 1em auto
</style>
