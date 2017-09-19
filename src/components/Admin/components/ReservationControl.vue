<template>
  <div class="reservation-updater" v-loading="!reservations">
    <h4 v-if="title">{{ title }}</h4>
    <el-table :data="reservations || []" class="reservations">
      <el-table-column label="类型" width="88" align="center" sortable>
        <template scope="scope">
          <span>{{ scope.row.round | parseRound }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hotel.name" label="酒店" min-width="180" sortable fit />
      <el-table-column prop="hotel.type" label="房型" width="108" sortable />
      <el-table-column label="时间" width="180">
        <template scope="scope">
          <div><span class="hint">入住：</span><span class="date">{{ scope.row.checkIn }}</span></div>
          <div><span class="hint">退房：</span><span class="date">{{ scope.row.checkOut }}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="拼房状态" align="left" width="240">
        <template scope="scope">
          <div class="roomshare-state">
            <el-tag v-if="!scope.row.roomshare" type="gray">未拼房</el-tag>
            <template v-if="scope.row.roomshare">
              <el-tag v-if="scope.row.roomshare.state === 'pending'" type="primary">{{
                scope.row.round === 'roomshare'
                ? '待处理'
                : '已发出' }}</el-tag>
              <el-tag v-if="scope.row.roomshare.state === 'accepted'" type="success">{{
                scope.row.round === 'roomshare'
                ? '已接受'
                : '已确认' }}</el-tag>
              <el-tag v-if="scope.row.roomshare.state === 'rejected'" type="danger">{{
                scope.row.round === 'roomshare'
                ? '已拒绝'
                : '被拒绝' }}</el-tag>
              <span class="school-name">{{ scope.row.roomshare.school.name }}</span>
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="64" class-name="no-padding" v-if="!readonly">
        <template scope="scope">
          <el-button-group v-if="scope.row.round !== 'roomshare' && allowsModification(scope.row)">
            <el-button
              type="info"
              icon="edit"
              size="mini"
              :loading="busy"
              :disabled="disabled"
              @click="edit(scope.row)"
            />
            <el-button
              type="danger"
              icon="close"
              size="mini"
              :loading="busy"
              :disabled="disabled"
              @click="confirmRemove(scope.row)"
            />
          </el-button-group>
          <el-button-group v-if="scope.row.round === 'roomshare' && scope.row.roomshare.state === 'pending'">
            <el-button
              type="success"
              icon="check"
              size="mini"
              :loading="busy"
              :disabled="disabled"
              @click="acceptRoomshare(scope.row)"
            />
            <el-button
              type="danger"
              icon="close"
              size="mini"
              :loading="busy"
              :disabled="disabled"
              @click="rejectRoomshare(scope.row)"
            />
          </el-button-group>
        </template>
      </el-table-column>
      <template slot="append" v-if="!readonly">
        <tr class="el-table__row">
          <td colspan="6" class="append-row">  <!-- NOTE: match with table columns -->
            <el-button
              type="success"
              size="small"
              :loading="busy"
              @click="add({ school: school })"
              :disabled="disabled"
            > 增加<strong>一间</strong> … </el-button>
          </td>
        </tr>
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
import Icon from 'vue-awesome'
import { hasAccess } from '@/lib/access'
import 'vue-awesome/icons/minus-square-o'

export default {
  name: 'reservation-control',
  components: {
    ReservationDialog,
    Icon
  },
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
      authorization: 'user/authorization',
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
      this.$notify({
        type: 'error',
        title,
        message: e.message,
        duration: 0
      })
    },
    allowsModification(reservation) {
      if (hasAccess(this.access, 'staff.accommodation')) {
        // allows modification from staff at all times
        return true
      } else {
        // strict check for school
        return this.round === reservation.round
      }
    },
    async fetch() {
      if (this.school) {
        try {
          const {
            body
          } = await this.$agent.get('/api/schools/'+this.school+'/reservations/')
                              .set( ... this.authorization )
          this.reservations = body
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
          body
        } = await this.$agent.post('/api/schools/'+this.school+'/reservations/')
                             .set( ... this.authorization )
                             .send( reservation )
                             .ok( ({ok, status}) => ok || status === 410 )
        if (ok) {
          this.reservations.push(body)
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
    async editReservation(reservation) {
      this.busy = true
      try {
        let {
          ok,
          body
        } = await this.$agent.patch('/api/schools/'+this.school+'/reservations/'+reservation.id)
                             .set( ... this.authorization )
                             .send( reservation )
                             .ok( ({ok, status}) => ok || status === 410 )
        if (ok) {
          this.reservations.splice(
            this.reservations.findIndex($ => $.id === reservation.id),
            1,
            body
          )
          this.$notify({
            type: 'success',
            title: '已修改预订',
            duration: 5000
          })
        }
        if (status === 410) {
          this.$notify({
            type: 'warning',
            title: '对方已确认预定信息，不能发起拼房',
            duration: 5000
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
        let {
          ok
        } = await this.$agent.delete('/api/schools/'+this.school+'/reservations/'+rid)
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
    async acceptRoomshare(reservation) {
      this.busy = true
      try {
        let {
          ok,
          body
        } = await this.$agent.post('/api/schools/'+this.school+'/roomshare/'+reservation.id)
                             .set( ... this.authorization )
                             .send({ accept: 1 })
                             .ok( ({ok, status}) => ok || status === 410 )
        if (ok) {
          this.reservations.splice(
            this.reservations.findIndex($ => $.id === reservation.id),
            1,
            body
          )
          this.$notify({
            type: 'success',
            title: '已接受拼房',
            duration: 5000
          })
        }
        if (status === 410) {
          this.$notify({
            type: 'warning',
            title: '对方已取消拼房请求',
            duration: 5000
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
        let {
          ok,
          body
        } = await this.$agent.post('/api/schools/'+this.school+'/roomshare/'+reservation.id)
                             .set( ... this.authorization )
                             .send({ reject: 1 })
        if (ok) {
          this.reservations.splice(
            this.reservations.findIndex($ => $.id === reservation.id),
            1,
            body
          )
          this.$notify({
            type: 'success',
            title: '已拒绝拼房',
            duration: 5000
          })
        }
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
  & > *
    flex-shrink: 0
    flex-grow: 0
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
</style>
