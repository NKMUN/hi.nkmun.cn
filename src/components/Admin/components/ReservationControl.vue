<template>
  <div class="reservation-updater" v-loading="!reservations">
    <h4 v-if="title">{{ title }}</h4>
    <el-table :data="reservations || []" class="reservations">
      <el-table-column label="类型" width="88" align="center" sortable>
        <span slot-scope="{row}">{{ row.round | parseRound }}</span>
      </el-table-column>
      <el-table-column prop="hotel.name" label="酒店" min-width="180" sortable fit />
      <el-table-column prop="hotel.type" label="房型" width="108" sortable />
      <el-table-column label="时间" width="180">
        <template slot-scope="{row}">
          <div><span class="hint">入住：</span><span class="date">{{ row.checkIn }}</span></div>
          <div><span class="hint">退房：</span><span class="date">{{ row.checkOut }}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="拼房状态" align="left" width="240">
        <div class="roomshare-state" slot-scope="{row}">
          <el-tag v-if="!row.roomshare" type="gray">未拼房</el-tag>
          <template v-if="row.roomshare">
            <el-tag v-if="row.roomshare.state === 'pending'" type="primary">{{
              row.round === 'roomshare'
              ? '待处理'
              : '已发出' }}</el-tag>
            <el-tag v-if="row.roomshare.state === 'accepted'" type="success">{{
              row.round === 'roomshare'
              ? '已接受'
              : '已确认' }}</el-tag>
            <el-tag v-if="row.roomshare.state === 'rejected'" type="danger">{{
              row.round === 'roomshare'
              ? '已拒绝'
              : '被拒绝' }}</el-tag>
            <el-tag v-if="row.roomshare.state === 'peer-withdraw'" type="danger">
              <icon name="bomb"/> 对方退会
            </el-tag>
            <span v-if="row.roomshare && row.roomshare.school" class="school-name">{{
              row.roomshare.school.name
            }}</span>
          </template>
        </div>
      </el-table-column>
      <el-table-column width="64" class-name="no-padding" v-if="!readonly">
        <template slot-scope="{row}">
          <el-button-group v-if="row.round !== 'roomshare' && allowsModification(row)">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              :loading="busy"
              :disabled="disabled"
              @click="edit(row)"
            />
            <el-button
              type="danger"
              icon="el-icon-close"
              size="small"
              :loading="busy"
              :disabled="disabled"
              @click="confirmRemove(row)"
            />
          </el-button-group>
          <el-button-group v-if="row.round === 'roomshare' && row.roomshare.state === 'pending'">
            <el-button
              type="success"
              icon="el-icon-check"
              size="mini"
              :loading="busy"
              :disabled="disabled"
              @click="acceptRoomshare(row)"
            />
            <el-button
              type="danger"
              icon="el-icon-close"
              size="mini"
              :loading="busy"
              :disabled="disabled"
              @click="rejectRoomshare(row)"
            />
          </el-button-group>
        </template>
      </el-table-column>
      <template slot="append" v-if="!readonly && (max === null || reservations.length < max)">
        <div class="el-table__row append-row">
          <el-button
            size="small"
            type="success"
            icon="el-icon-plus"
            :loading="busy"
            @click="add({ school: school })"
            :disabled="disabled"
          > 增加房间 </el-button>
        </div>
      </template>
    </el-table>

    <ReservationDialog
      ref="dialog"
      :round="round"
      :busy="busy"
    />

  </div>
</template>

<script>
import ReservationDialog from './ReservationDialog'
import roundText from '@/lib/round-text'
import { mapGetters } from 'vuex'
import { hasAccess } from '@/lib/access'
import 'vue-awesome/icons/minus-square-o'
import 'vue-awesome/icons/bomb'

export default {
  name: 'reservation-control',
  components: { ReservationDialog },
  props: {
    title: { type: String, default: '' },
    round: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    school: { type: String, default: '' },
    max: { type: Number, default: null },
    readonly: { type: Boolean, default: false },
  },
  computed: {
    ... mapGetters({
      access: 'user/access',
    }),
  },
  watch: {
    school() {
      this.fetch()
    }
  },
  data() {
    return {
      busy: false,
      reservations: []
    }
  },
  methods: {
    notifyError(e, title='操作失败') {
      this.$message({
        type: 'error',
        message: e.message
      })
    },
    allowsModification(reservation) {
      if (hasAccess(this.access, 'staff.accommodation')) {
        // allows modification from staff at all times
        return true
      } else {
        const roomshareAccepted = reservation.roomshare && reservation.roomshare.state === 'accepted'
        // strict check for school
        return this.round === reservation.round && !roomshareAccepted
      }
    },
    async fetch() {
      if (this.school) {
        try {
          this.reservations = await this.$agent.get('/api/schools/'+this.school+'/reservations/').body()
        } catch(e) {
          this.notifyError(e, '获取失败')
        }
      }
    },
    async add() {
      const reservation = await this.$refs.dialog.open({ school: this.school }, 'add')
      if (reservation) {
        this.addReservation({
          ... reservation,
          round: this.round
        })
      }
    },
    async confirmRemove(r) {
      let text = `删除 ${r.hotel.name} 从 ${r.checkIn} 到 ${r.checkOut} 的预订？`
      let result = await this.$confirm(text, '确认？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      if (result === 'confirm') {
        this.deleteReservation(r.id)
      }
    },
    async edit(row) {
      const reservation = await this.$refs.dialog.open({
        ... row,
        school: this.school
      }, 'edit')
      if (reservation) {
        this.editReservation({
          ... reservation,
          id: row.id
        })
      }
    },
    async addReservation(reservation) {
      this.busy = true
      try {
        let {
          ok,
          body,
          status
        } = await this.$agent.post('/api/schools/'+this.school+'/reservations/')
                             .send( reservation )
                             .ok( ({ok, status}) => ok || status === 410 )
        if (ok) {
          this.reservations.push(body)
          this.$message({
            type: 'success',
            message: '已新增预订',
          })
        }
        if (status === 410) {
          this.$message({
            type: 'warning',
            message: '酒店已被抢订，请重新预订！',
          })
        }
      } catch(e) {
        this.notifyError(e, '预订失败')
      } finally {
        this.busy = false
      }
    },
    async editReservation(reservation) {
      this.busy = true
      try {
        let {
          ok,
          body,
          status
        } = await this.$agent.patch('/api/schools/'+this.school+'/reservations/'+reservation.id)
                             .send( reservation )
                             .ok( ({ok, status}) => ok || status === 410 )
        if (ok) {
          this.reservations.splice(
            this.reservations.findIndex($ => $.id === reservation.id),
            1,
            body
          )
          this.$message({
            type: 'success',
            message: '已修改预订',
          })
        }
        if (status === 410) {
          this.$message({
            type: 'warning',
            message: '对方已确认预定信息，不能发起拼房'
          })
        }
      } catch(e) {
        this.notifyError(e, '修改预订失败')
      } finally {
        this.busy = false
      }
    },
    async deleteReservation(rid) {
      this.busy = true
      try {
        await this.$agent.delete('/api/schools/'+this.school+'/reservations/'+rid)
        this.reservations.splice(
          this.reservations.findIndex( $ => $.id === rid ),
          1
        )
        this.$message({
          type: 'success',
          message: '已删除预订'
        })
      } catch(e) {
        this.notifyError(e, '删除失败')
      } finally {
        this.busy = false
      }
    },
    async acceptRoomshare(reservation) {
      this.busy = true
      try {
        let {
          ok,
          body,
          status
        } = await this.$agent.post('/api/schools/'+this.school+'/roomshare/'+reservation.id)
                             .send({ accept: 1 })
                             .ok( ({ok, status}) => ok || status === 410 )
        if (ok) {
          this.reservations.splice(
            this.reservations.findIndex($ => $.id === reservation.id),
            1,
            body
          )
          this.$message({
            type: 'success',
            message: '已接受拼房'
          })
        }
        if (status === 410) {
          this.$message({
            type: 'warning',
            message: '对方已取消拼房请求'
          })
        }
      } catch(e) {
        this.notifyError(e, '拼房失败')
      } finally {
        this.busy = false
      }
    },
    async rejectRoomshare(reservation) {
      this.busy = true
      try {
        const rejectedReservation = await this.$agent
          .post('/api/schools/'+this.school+'/roomshare/'+reservation.id)
          .send({ reject: 1 })
          .body()
        this.reservations.splice(
          this.reservations.findIndex($ => $.id === reservation.id),
          1,
          rejectedReservation
        )
        this.$message({
          type: 'success',
          message: '已拒绝拼房'
        })
      } catch(e) {
        this.notifyError(e, '拼房失败')
      } finally {
        this.busy = false
      }
    }
  },
  async mounted() {
    this.fetch()
  },
  filters: {
    parseRound: roundText
  }
}
</script>

<style lang="stylus" scoped>
@import "../../../style/flex"
.reservation-updater
  flex-vert: flex-start center
  .reservations
    margin: 0 auto
    min-width: 50%
    max-width: 110ch
  .date
    font-family: monospace
  .hint
    color: #8492A6
    font-size: 80%
  .el-icon
    opacity: 0.5
  .append-row
    text-align: center
    padding: 12px 0
  .school-name
    margin-left: 1ch
  .roomshare-state
    flex-horz: flex-start center
    white-space: nowrap
</style>
<style lang="stylus">
.el-table
  .no-padding .cell
    text-align: center
    padding-left: 0
    padding-right: 0
  .el-button-group
    .el-button
      padding: 6px 6px
</style>
