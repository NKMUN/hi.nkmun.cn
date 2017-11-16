<template>
  <div class="reviewer" v-loading="id && (!school || loading)">
    <template v-if="school">

      <SchoolBrief class="brief" :data="school" />

      <NukeSchoolButton :repeat="school.school.name" @click="nuke" />

      <div class="seat-view">
        <SeatUpdater
          v-show="!loading"
          v-model="school.seat['1']"
          title="一轮名额"
          :sessions="sessions"
          :disabled="round!=='1' || disableModification"
          :busy="busy"
          @confirm="patch('seat.1', school.seat['1'])"
        />
        <SeatUpdater
          v-show="!loading"
          v-model="school.seat['2']"
          title="二轮名额"
          :sessions="sessions"
          :disabled="round!=='2' || disableModification"
          :busy="busy"
          @confirm="patch('seat.2', school.seat['2'])"
        />
      </div>

      <div class="leader-type">
        <LeaderAttendance
          v-show="!loading"
          @change="setLeaderAttend"
          :value="leaderAttend"
          :disabled="Number(round)>=3 || busy"
        />
      </div>

      <div v-if="school.stage==='1.exchange'" class="controls end-exchange">
        <el-button
          type="warning"
          :busy="busy"
          @click="endExchange"
        >
          <icon class="el-icon-" name="exclamation-triangle" style="vertical-align: bottom;" />
          强制结束名额交换
        </el-button>
      </div>

      <ReservationControl
        title="酒店预订"
        :round="round"
        :busy="busy"
        :school="id"
      />

      <div v-if="school.stage==='1.complete' || school.stage==='2.complete'" class="start-confirm">
        <el-checkbox v-model="enableStartConfirm">信息录入</el-checkbox>
        <p class="note">开始信息录入后，不能修改会场名额、领队参会、酒店预订信息！</p>
        <el-button
          type="primary"
          icon="document"
          :disabled="!enableStartConfirm"
          :busy="busy"
          @click="startConfirm"
        >开始信息录入</el-button>
      </div>

    </template>
  </div>
</template>

<script>
import Precondition from '@/components/Precondition'
import SchoolBrief from './SchoolBrief'
import SeatUpdater from './SeatUpdater'
import NukeSchoolButton from './NukeSchoolButton'
import ReservationControl from './ReservationControl'
import LeaderAttendance from '../../form/LeaderAttendance'
import 'vue-awesome/icons/exclamation-triangle'

export default {
  name: 'school-view',
  components: {
    SchoolBrief,
    SeatUpdater,
    LeaderAttendance,
    NukeSchoolButton,
    ReservationControl
  },
  props: {
    sessions: { type: Array, default: () => [] },
    id: { type: String, default: null }
  },
  computed: {
    round() {
      return (this.school && this.school.stage && this.school.stage[0]) || null
    },
    disableModification() {
      // certain stage does not allow modification
      let stage = (this.school && this.school.stage) || ''
      return !stage || stage.endsWith('.paid') || stage.endsWith('complete') || stage==='3.confirm' || stage==='9.complete'
    },
    leaderAttend() {
      if (this.school && this.school.seat && this.school.seat['1']) {
        if (this.school.seat['1']['_leader_r'] >= 1) return true
        if (this.school.seat['1']['_leader_nr'] >= 1) return false
        return null
      } else {
        return null
      }
    }
  },
  data: () => ({
    busy: false,
    loading: true,
    school: null,
    reservations: null,
    enableStartConfirm: false,
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
          this.school = await this.$agent.get('/api/schools/'+this.id).body()
        } catch(e) {
          this.notifyError(e, '获取失败')
          this.school = null
        } finally {
          this.loading = false
        }
      } else {
        this.school = null
        this.seat = null
      }
    },
    async patch(field, payload) {
      try {
        await this.$agent
          .patch('/api/schools/'+this.id)
          .query({ field: field })
          .send(payload)
        this.$notify({
          type: 'success',
          title: '更新成功',
          message: '已更新 '+this.school.school.name,
          duration: 5000
        })
        return true
      } catch(e) {
        this.notifyError(e, '更新失败')
      } finally {
        this.busy = false
      }
      return false
    },
    async nuke() {
      this.busy = true
      try {
        const {
          ok,
          status,
          body
        } = await this.$agent.delete('/api/schools/'+this.id)
                .ok(({ok, status}) => ok || status === 412)
        if (ok) {
          this.$notify({
            type: 'success',
            title: '已成功爆破',
            message: ''+this.school.school.name+'は消えました。素晴らしの成功です！',
            duration: 5000
          })
          this.$emit('next', this.id)
          this.$emit('nuked', this.id)
          return
        }
        if (status === 412 && body.cause === 'roomshare') {
          this.$notify({
            type: 'error',
            title: '爆破失败',
            message: '学校有确认的拼房预定',
            duration: 5000
          })
          return
        }
        throw new Error('Not handled 412 error: ' + body.error)
      } catch(e) {
        this.notifyError(e, '爆破失败')
      } finally {
        this.busy = false
      }
    },
    async endExchange() {
      this.busy = true
      try {
        if ( ! await this.patch('seat.1', this.school.seat['1']) )
          return
        let {
          ok,
          status
        } = await this.$agent.post('/api/schools/'+this.id+'/seat')
                  .send({ confirmExchange: true })
                  .ok( ({ok, status}) => ok || status === 410 )
        if (ok) {
          this.$notify({
            type: 'success',
            title: '名额交换已确认',
            duration: 5000
          })
        }
        if (status === 410) {
          this.$notify({
            type: 'warning',
            title: '未能确认名额交换',
            message: '双代会场没有偶数名额，请刷新页面！'
          })
        }
        await this.fetch()
      } catch(e) {
        this.notifyError(e, '未能强制结束交换')
      } finally {
        this.busy = false
      }
    },
    async setLeaderAttend(value) {
      if (value === this.leaderAttend)
        return
      try {
        const updatedSeat = await this.$agent
          .post('/api/schools/'+this.id+'/seat')
          .send({ leaderAttend: value })
          .body()
        this.school = {
          ... this.school,
          seat: updatedSeat
        }
        this.$notify({
          type: 'success',
          title: '已修改领队参会标记',
          duration: 5000
        })
      } catch(e) {
        this.notifyError(e, '未能设置领队参会标记')
      } finally {
        this.busy = false
      }
    },
    async startConfirm() {
      try {
        const newSeat = await this.$agent
          .post('/api/schools/'+this.id+'/seat')
          .send({ startConfirm: true })
          .body()
        this.school = {
          ... this.school,
          seat: newSeat,
          stage: '3.confirm'
        }
        this.$notify({
          type: 'success',
          title: '已开放信息录入 '+this.school.school.name,
          duration: 5000
        })
      } catch(e) {
        this.notifyError(e, '未能开放信息录入')
      } finally {
        this.busy = false
      }
    }
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
@import "../../../style/flex"
.brief
  display: table
  margin: 1em auto
.seat-view
  flex-horz: center flex-start
.reviewer
  padding-bottom: 3em
.end-exchange
  text-align: center
  margin-top: 1em
.leader-type
  text-align: center
  margin-top: 1em
.start-confirm
  text-align: center
  margin-top: 2em
.note
  white-space: nowrap
  color: #475669
  font-size: 14px
</style>
