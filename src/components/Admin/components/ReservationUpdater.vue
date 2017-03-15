<template>
  <div>
    <h4 v-if="title">{{ title }}</h4>
    <el-table :data="value" class="reservations">
      <el-table-column label="类型" width="88" align="center" sortable>
        <template scope="scope">
          <span>{{ scope.row.round | parseRound }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hotel.name" label="酒店" min-width="180" sortable fit />
      <el-table-column prop="hotel.type" label="房型" width="108" sortable />
      <el-table-column label="入住时间" width="240">
        <template scope="scope">
          <span>{{ scope.row.checkIn }}</span>
          <span class="delimiter"> - </span>
          <span>{{ scope.row.checkOut }}</span>
        </template>
      </el-table-column>
      <el-table-column width="32" class-name="no-padding">
        <template scope="scope">
        <el-button
            type="danger"
            icon="close"
            size="mini"
            :loading="busy"
            @click="confirmRemove(scope.row)"
          />
      </el-table-column>
    </el-table>

    <el-button
      v-if="!busy"
      type="success"
      icon="plus"
      :loading="busy"
      @click="$refs.addReservation.open()"
    > 新增 </el-button>

    <AddReservationDialog
      ref="addReservation"
      :round="round"
      :busy="busy"
      @confirm="add"
    />

  </div>
</template>

<script>
import { Button, Table, TableColumn, Notification, MessageBox } from 'element-ui'
import AddReservationDialog from './AddReservationDialog'

export default {
  name: 'reservation-updater',
  components: {
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    AddReservationDialog,
  },
  props: {
    title: { type: String, default: '' },
    value: { type: Array, default: [] },
    round: { type: String, default: '' },
    busy: { type: Boolean, default: false },
  },
  methods: {
    add(reservation) {
      this.$emit('add', {
        ... reservation,
        round: this.round
      })
      this.$refs.addReservation.close()
    },
    async confirmRemove(r) {
      let text = `删除 ${r.hotel.name} 从 ${r.checkIn} 到 ${r.checkOut} 的预订？`
      let result = await MessageBox.confirm(text, '确认？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      if (result === 'confirm')
        this.$emit('delete', r.id)
    }
  },
  filters: {
    parseRound(r) {
      switch(r) {
        case '1': return '一轮'
        case '2': return '二轮'
        case '3': return '追加'
        default:  return '未知'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../../style/flex"
div
  flex-vert: flex-start center
  *
    flex-shrink: 0
    flex-grow: 0
  .reservations
    margin: 0 auto 1em auto
    min-width: 50%
    max-width: 720px
  .delimiter
    color: #99A9BF
</style>
<style lang="stylus">
.el-table
  .no-padding .cell
    text-align: center
    padding-left: 0
    padding-right: 0
</style>
