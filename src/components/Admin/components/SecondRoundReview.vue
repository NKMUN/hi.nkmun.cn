<template>
  <div class="reviewer" v-loading="id && (!school || loading)">

    <el-alert
      v-if="!id || !school"
      type="warning"
      title="注意"
      description="学校必须完成一轮缴费才能进行二轮分配"
      show-icon
      :closable="false"
    />

    <template v-if="school">

      <SchoolBrief class="brief" :data="school" />

      <SeatInput
        v-show="!loading"
        class="seat-input"
        v-model="seat"
        :sessions="sessions"
        :disabled="busy || !canAllocSecondRound"
        @change="dirty = true"
      />

      <div class="confirm-guard" v-show="!loading && canAllocSecondRound">
        <el-checkbox v-model="canAlloc">确认分配二轮名额</el-checkbox>
      </div>

      <el-button-group class="controls" v-show="!loading && canAllocSecondRound">
        <el-button
          type="success"
          :disabled="!canAlloc"
          :loading="busy"
          icon="message"
          @click="allocSecondRound"
        > 确认分配 </el-button>
        <el-button
          type="info"
          :loading="busy"
          icon="check"
          @click="updateAndNext"
        > 保存 <i class="el-icon-arrow-right el-icon--right"/> </el-button>
      </el-button-group>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SeatInput from './SeatInput'
import SchoolBrief from './SchoolBrief'

export default {
  name: 'second-round-review',
  components: {
    SchoolBrief,
    SeatInput,
  },
  props: {
    sessions: { type: Array, default: () => [] },
    id: { type: String, default: null }
  },
  computed: {
    ... mapGetters({
      authorization: 'user/authorization'
    }),
    canAllocSecondRound() {
      return this.school && this.school.stage === '1.complete'
    }
  },
  data: () => ({
    busy: false,
    loading: true,
    seat: null,
    dirty: false,
    school: null,
    canAlloc: false
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
          let {
            body: school
          } = await this.$agent.get('/api/schools/'+this.id)
                               .set( ... this.authorization )
          this.school = school
          this.seat = school.seat['2']
        } catch(e) {
          this.notifyError(e, '获取失败')
          this.school = null
          this.seat = null
        } finally {
          this.loading = false
        }
      } else {
        this.school = null
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
        } = await this.$agent.patch('/api/schools/'+this.id)
                             .set( ... this.authorization )
                             .query({ field: 'seat.2' })
                             .send( this.seat )
        this.dirty = false
        if (!silent) {
          this.$notify({
            type: 'success',
            title: '更新成功',
            message: '已更新 '+this.school.name,
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
      if ( await this.update() ) {
        this.$nextTick( () => {
          this.$emit('next', this.id)
        })
      }
    },
    async allocSecondRound() {
      if ( ! await this.update(true) )
        return

      this.busy = true
      try {
        await this.$agent.post('/api/schools/'+this.id+'/progress')
              .set( ... this.authorization )
              .send({ confirmSecondRound: 1 })
        this.$notify({
          type: 'success',
          title: '已分配二轮名额',
          duration: 5000
        })
        this.$nextTick( () => {
          this.$emit('next', this.id)
          this.$emit('processed', this.id)
          this.school = { ... this.school, stage: '2.reservation', processed: true }
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
@import "../../../style/flex"
.reviewer
  flex-vert: flex-start center
  *
    flex-shrink: 0
  .seat-input, .controls, .confirm-guard
    display: table
    margin: 1em auto
.el-alert
  width: auto
  margin-top: 3em
  padding-left: 4ch
  padding-right: 4ch
  align-self: center
</style>
