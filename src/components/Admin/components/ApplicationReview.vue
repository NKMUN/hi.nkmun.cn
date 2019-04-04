<template>
  <div class="reviewer" v-loading="id && (!application || loading)">
    <template v-if="application">
      <InvitationCodeView v-if="application.processed" :id="id" />

      <ApplicationCard
        v-show="!loading"
        :data="application"
        :tests="tests"
        class="application-card"
      />

      <NukeApplicationButton :repeat="application.school.name" @click="nuke" v-show="!loading" />

      <SeatInput
        v-if="application.type === 'school' && !loading"
        class="seat-input"
        v-model="seat"
        :sessions="sessions"
        :disabled="busy || application.processed"
        @change="dirty = true"
      />

      <SeatSelect
        v-if="application.type === 'individual' && !loading"
        class="seat-input"
        v-model="seat"
        :sessions="sessions"
        :disabled="busy || application.processed"
        @change="dirty = true"
      />

      <div class="confirm-guard" v-show="!loading && !application.processed">
        <el-checkbox v-model="canInvite">发送邀请</el-checkbox>
      </div>

      <el-button-group class="controls" v-show="!loading && !application.processed">
        <el-button
          type="success"
          :disabled="!canInvite || !seatAllocated"
          :loading="busy"
          icon="el-icon-message"
          @click="sendInvitation"
        > 发送邀请 </el-button>
        <el-button
          type="primary"
          :loading="busy"
          @click="update"
        > 保存 <i class="el-icon-arrow-right el-icon--right"/> </el-button>
      </el-button-group>

      <el-button-group class="controls" v-show="!loading && application.processed">
        <el-button
          v-if="application.processed && !application.registered"
          type="success"
          :loading="busy"
          icon="el-icon-message"
          @click="sendInvitation"
        > 重发邀请 </el-button>
      </el-button-group>

    </template>
  </div>
</template>

<script>
import SeatInput from './SeatInput'
import SeatSelect from './SeatSelect'
import ApplicationCard from './ApplicationCard'
import NukeApplicationButton from './NukeApplicationButton'
import InvitationCodeView from './InvitationCodeView'

export default {
  name: 'application-review',
  components: {
    ApplicationCard,
    SeatInput,
    SeatSelect,
    NukeApplicationButton,
    InvitationCodeView,
  },
  props: {
    sessions: { type: Array, default: () => [] },
    tests: { type: Array, default: () => [] },
    id: { type: String, default: null }
  },
  computed: {
    seatAllocated() {
      const seat = this.seat || this.application && this.application.seat
      if (!seat) return false
      for (let key in seat)
        if (seat[key] > 0)
          return true
      return false
    }
  },
  data: () => ({
    busy: false,
    loading: true,
    application: null,
    seat: null,
    dirty: false,
    canInvite: false
  }),
  methods: {
    notifyError(e, title='操作失败') {
      this.$notify({
        type: 'error',
        title,
        message: e.message,
        duration: 0
      })
    },
    async fetch() {
      if (this.id) {
        this.loading = true
        try {
          this.application = await this.$agent.get('/api/applications/'+this.id).body()
          this.seat = this.application.seat
        } catch(e) {
          this.notifyError(e, '获取失败')
          this.application = null
          this.seat = null
        } finally {
          this.loading = false
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
        await this.$agent.patch('/api/applications/'+this.id).send({ seat: this.seat })
        await this.fetch()
        this.dirty = false
        if (!silent) {
          this.$notify({
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
    async sendInvitation() {
      if ( ! await this.update(true) )
        return

      this.busy = true
      try {
        await this.$agent.post('/api/invitations/').send({ school: this.id })
        this.$notify({
          type: 'success',
          title: '邀请已发送',
          message: '已向 '+this.application.school.name+' 发送邀请',
          duration: 5000
        })
        this.$nextTick( () => {
          this.$emit('update', this.id, {processed: true})
          this.application = { ... this.application, processed: true }
        })
      } catch(e) {
        this.notifyError(e)
      } finally {
        this.busy = false
      }
    },
    async nuke() {
      this.busy = true
      try {
        await this.$agent.delete('/api/applications/'+this.id)
        this.$notify({
          type: 'success',
          title: '已成功爆破',
          message: ''+this.application.school.name+'の申請は消えました。。素晴らしの成功です！',
          duration: 5000
        })
        this.$emit('nuked', this.id)
      } catch(e) {
        this.notifyError(e, '爆破失败')
      } finally {
        this.busy = false
      }
    },
  },
  mounted() {
    return this.fetch()
  },
  watch: {
    id() {
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
