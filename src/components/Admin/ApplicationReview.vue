<template>
  <div class="reviewer" v-loading="id && !application" ref="scroll">
    <ApplicationCard
      v-if="application"
      :data="application"
      :tests="tests"
      class="application-card"
    />

    <SeatInput
      v-if="application"
      class="seat-input"
      v-model="seat"
      :sessions="sessions"
      :disabled="busy || application.processed"
      @change="dirty = true"
    />

    <div class="confirm-guard" v-if="application && !application.processed">
      <el-checkbox v-model="canInvite">发送邀请</el-checkbox>
    </div>

    <el-button-group class="controls" v-if="application && !application.processed">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  Button,
  ButtonGroup,
  Checkbox,
  Notification
} from 'element-ui'

import SeatInput from 'components/Admin/SeatInput'
import ApplicationCard from 'components/Admin/ApplicationCard'
import Precondition from 'components/Precondition'

export default {
  name: 'application-review',
  components: {
    [Button.name]: Button,
    [ButtonGroup.name]: ButtonGroup,
    [Checkbox.name]: Checkbox,
    ApplicationCard,
    SeatInput
  },
  props: {
    sessions: { type: Array, default: () => [] },
    tests: { type: Array, default: () => [] },
    id: { type: String, default: null }
  },
  computed: {
    ... mapGetters({
      authorization: 'user/authorization'
    }),
  },
  data: () => ({
    busy: false,
    application: null,
    seat: null,
    dirty: false,
    canInvite: false
  }),
  methods: {
    notifyError(e, title='操作失败') {
      Notification({
        type: 'error',
        title,
        message: e.message,
        duration: 0
      })
    },
    async fetch() {
      if (this.id) {
        this.application = null
        try {
          let {
            body: application
          } = await this.$agent.get('/api/applications/'+this.id)
                               .set( ... this.authorization )
          this.application = application
          this.seat = application.seat
        } catch(e) {
          this.notifyError(e, '获取失败')
          this.application = null
          this.seat = null
        }
      } else {
        this.application = null
        this.seat = null
      }
    },
    async update(silent=false) {
      if (!this.dirty)
        return true
      let result = false
      try {
        let {
          ok,
          status
        } = await this.$agent.patch('/api/applications/'+this.id)
                             .set( ... this.authorization )
        this.dirty = false
        if (!silent) {
          Notification({
            type: 'success',
            title: '更新成功',
            message: '已更新 '+this.application.school.name,
            duration: 5000
          })
        }
        result = true
      } catch(e) {
        this.notifyError(e, '更新失败')
      } finally {
        this.busy = false
      }
      return result
    },
    async updateAndNext() {
      await this.update()
      this.$nextTick( () => {
        this.$emit('next', this.id)
      })
    },
    async sendInvitation() {
      if ( ! await this.update(true) )
        return

      this.busy = true
      try {
        //
        // TODO: send invitation
        //
        Notification({
          type: 'success',
          title: '邀请已发送',
          message: '已向 '+this.application.school.name+' 发送邀请',
          duration: 5000
        })
        this.$nextTick( () => {
          this.$emit('next', this.id)
          this.$emit('processed', this.id)
        })
      } catch(e) {
        this.notifyError(e)
      } finally {
        this.busy = false
      }
    },
  },
  mounted() {
    return this.fetch()
  },
  watch: {
    id(val) {
      this.$nextTick( () => this.fetch() )
    }
  }
}
</script>

<style lang="stylus" scoped>
  .application-card, .seat-input, .controls, .confirm-guard
    display: table
    margin: 1em auto
</style>
