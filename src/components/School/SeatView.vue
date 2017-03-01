<template>
  <table>
    <thead border="1">
      <tr>
        <th>会场</th>
        <th v-if="showRound1">一轮</th>
        <th v-if="showExchange">交换中</th>
        <th v-if="showRound2">二轮</th>
        <th v-if="showTotal">总计</th>
        <th v-if="$scopedSlots.operation">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in seatArray">
        <td class="session-name">
          <span>{{ row.session.name }}</span>
          <el-tag v-if="row.session.dual" type="warning" class="tag">双代</el-tag>
        </td>
        <td v-if="showRound1" class="amount">{{ row.round1 }}</td>
        <td v-if="showExchange" class="amount">{{ row.inExchange }}</td>
        <td v-if="showRound2" class="amount">{{ row.round2 }}</td>
        <td v-if="showTotal" class="amount total">{{ row.round2 + row.round1 }}</td>
        <td v-if="$scopedSlots.operation">
          <slot name="operation" :session="row.session" :row="row" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { Table, TableColumn, Tag } from 'element-ui'
import { mapGetters } from 'vuex'
import SessionUtils from 'lib/session-utils'
const bySessionId = (a={}, b={}) => String(a.session).localeCompare(String(b.session))

export default {
  name: 'seat-view',
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Tag.name]: Tag
  },
  mixins: [
    SessionUtils
  ],
  props: {
    seat: {
      type: Object,
      required: true
    },
    exchanges: {
      type: Array,
      default: () => []
    },
    showExchange: {
      type: Boolean,
      default: false
    },
    showRound1: {
      type: Boolean,
      default: true,
    },
    showRound2: {
      type: Boolean,
      default: false,
    },
    showTotal: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    seatArray() {
      let ret = []
      this.SESSIONS().forEach( s => {
        let r1 = (this.seat['1'] && this.seat['1'][s.id]) || 0
        let r2 = (this.seat['2'] && this.seat['2'][s.id]) || 0
        let inExchange = this.exchanges.filter( $ => ($.from && $.from.session) === s )
        let shouldAppend = r1 + r2 > 0
        if (shouldAppend) {
          ret.push({
            session: s,
            round1: r1 || '',
            round2: r2 || '',
            total: r1 + r2,
            inExchange: inExchange
          })
        }
      })
      return ret.sort(bySessionId)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
.session-name
  flex-horz: space-between center
  white-space: nowrap
  .tag
    margin-left: 1ch
table
  border: 1px solid #dfe6ec
  border-collapse: collapse
  td, th
    padding: .5em 2ch
  thead
    border-bottom: 1px solid #dfe6ec
    background-color: #eef1f6
    tr
      td, th
        text-align: left
  tbody
    tr
      &:not(:last-child)
        border-bottom: 1px solid #dfe6ec
  .amount
    text-align: right
    padding-right: 2.5ch
    font-family: monospace
    font-size: 16px
    &.total
      font-weight: bolder
</style>
<style lang="stylus">
@import "../../style/flex"

</style>
