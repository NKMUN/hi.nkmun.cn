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

      <ReservationUpdater
        title="酒店预订"
        :value="reservations"
        :round="round"
        :busy="busy"
        :disabled="disableModification"
        @delete="deleteReservation"
        @add="addReservation"
      />

    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Precondition from 'components/Precondition'
import SchoolBrief from './SchoolBrief'
import SeatUpdater from './SeatUpdater'
import NukeSchoolButton from './NukeSchoolButton'
import ReservationUpdater from './ReservationUpdater'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/exclamation-triangle'

export default {
  name: 'school-view',
  components: {
    SchoolBrief,
    SeatUpdater,
    NukeSchoolButton,
    ReservationUpdater,
    Icon,
  },
  props: {
    sessions: { type: Array, default: () => [] },
    id: { type: String, default: null }
  },
  computed: {
    ... mapGetters({
      authorization: 'user/authorization'
    }),
    round() {
      return (this.school && this.school.stage && this.school.stage[0]) || null
    },
    disableModification() {
      // certain stage does not allow modification
      let stage = (this.school && this.school.stage) || ''
      return !stage || stage.endsWith('.paid') || stage.endsWith('complete')
    }
  },
  data: () => ({
    busy: false,
    loading: true,
    school: null,
    reservations: null
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
          let [ school, reservations ] = await Promise.all([
            this.$agent.get('/api/schools/'+this.id)
                       .set( ... this.authorization )
                       .then( res => res.body ),
            this.$agent.get('/api/schools/'+this.id+'/reservations/')
                       .set( ... this.authorization )
                       .then( res => res.body ),
          ])
          this.school = school
          this.reservations = reservations
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
        let {
          ok,
          status
        } = await this.$agent.patch('/api/schools/'+this.id)
                             .set( ... this.authorization )
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
        let {
          ok
        } = await this.$agent.delete('/api/schools/'+this.id)
                             .set( ... this.authorization )
                             .send({})
        this.$notify({
          type: 'success',
          title: '已成功爆破',
          message: ''+this.school.school.name+'は消えました。素晴らしの成功です！',
          duration: 5000
        })
        this.$emit('next', this.id)
        this.$emit('nuked', this.id)
      } catch(e) {
        this.notifyError(e, '爆破失败')
      } finally {
        this.busy = false
      }
    },
    async addReservation(reservation) {
      this.busy = true
      try {
        let {
          ok,
          body
        } = await this.$agent.post('/api/schools/'+this.id+'/reservations/')
                             .set( ... this.authorization )
                             .send( [reservation] )
                             .ok( ({ok, status}) => ok || status === 410 )
        if (ok) {
          this.reservations.push(
            await this.$agent.get('/api/schools/'+this.id+'/reservations/'+body.inserted[0])
                             .set( ... this.authorization )
                             .then( res => res.body )
          )
          this.$notify({
            type: 'success',
            title: '已新增预订',
            duration: 5000
          })
        }
        if (status === 410) {
          this.$notify({
            type: 'warning',
            title: '酒店已被抢订，请重新预订！',
            duration: 5000
          })
        }
      } catch(e) {
        this.notifyError(e, '预订失败')
      } finally {
        this.busy = false
      }
    },
    async deleteReservation(rid) {
      this.busy = true
      try {
        let {
          ok
        } = await this.$agent.delete('/api/schools/'+this.id+'/reservations/'+rid)
                             .set( ... this.authorization )
                             .send({})
        this.reservations.splice(
          this.reservations.findIndex( $ => $.id === rid ),
          1
        )
        this.$notify({
          type: 'success',
          title: '已删除预订',
          duration: 5000
        })
      } catch(e) {
        this.notifyError(e, '删除失败')
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
                  .set( ... this.authorization )
                  .ok( ({ok, status}) => ok || status === 410 )
        if (status === 410) {
          this.$notify({
            type: 'warning',
            title: '未能确认名额交换',
            message: '双代会场没有偶数名额，请刷新页面！'
          })
          await this.fetch()
        } else if (ok) {
          this.$notify({
            type: 'success',
            title: '名额交换已确认',
            duration: 5000
          })
          await this.fetch()
        }
      } catch(e) {
        this.notifyError(e, '未能强制结束交换')
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
</style>
