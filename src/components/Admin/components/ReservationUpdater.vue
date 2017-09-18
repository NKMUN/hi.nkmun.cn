<template>
  <div class="reservation-updater">
    <h4 v-if="title">{{ title }}</h4>
    <el-table :data="value" class="reservations">
      <el-table-column label="类型" width="88" align="center" sortable>
        <template scope="scope">
          <span>{{ scope.row.round | parseRound }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hotel.name" label="酒店" min-width="180" sortable fit />
      <el-table-column prop="hotel.type" label="房型" width="108" sortable />
      <el-table-column label="入住时间" width="180">
        <template scope="scope">
          <div>入住：<span class="date">{{ scope.row.checkIn }}</span></div>
          <div>退房：<span class="date">{{ scope.row.checkOut }}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="拼房" align="center">
        <el-table-column label="状态" align="center" width="54" class-name="no-padding">
          <template scope="scope">
            <i v-if="!scope.row.roomshare" class="el-icon el-icon-circle-cross"></i>
            <div
              v-if="scope.row.roomshare"
              class="roomshare-state"
              @click.native="showRoomshareDetail(scope.row)"
            >
              <div>
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
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="学校" align="center" width="180" class-name="no-padding">
          <template scope="scope">
            <div v-if="scope.row.roomshare">{{ scope.row.roomshare.school.name }}</div>
          </template>
        </el-table-column>
        
      </el-table-column>
      <el-table-column width="64" class-name="no-padding">
        <template scope="scope">
          <el-button-group v-if="scope.row.round !== 'roomshare'">
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
        </template>
      </el-table-column>
    </el-table>

    <el-button
      v-if="!busy"
      type="success"
      icon="plus"
      :loading="busy"
      @click="add({ school: school })"
      :disabled="disabled"
    > 新增 </el-button>

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

export default {
  name: 'reservation-updater',
  components: {
    ReservationDialog,
  },
  props: {
    title: { type: String, default: '' },
    value: { type: Array, default: [] },
    round: { type: String, default: '' },
    busy: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    school: { type: String, default: '' }
  },
  methods: {
    async add() {
      const reservation = await this.$refs.dialog.open({ school: this.school })
      if (reservation) {
        this.$emit('add', {
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
      if (result === 'confirm')
        this.$emit('delete', r.id)
    },
    async edit(row) {
      const reservation = await this.$refs.dialog.open({
        ... row,
        school: this.school
      })
      if (reservation) {
        this.$emit('edit', {
          ... reservation,
          id: row.id,
        })
      }
    },
    async showRoomshareDetail(row) {
      this.$refs.rdetailDialog.open(row)
    }
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
    margin: 0 auto 1em auto
    min-width: 50%
    max-width: 110ch
  .date
    font-family: monospace
  .el-icon
    opacity: 0.5
  .roomshare-state
    cursor: pointer
</style>
<style lang="stylus">
.el-table
  .no-padding .cell
    text-align: center
    padding-left: 0
    padding-right: 0
</style>
