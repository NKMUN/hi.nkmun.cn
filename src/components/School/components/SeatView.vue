<template>
  <table>
    <thead border="1">
      <tr>
        <th>会场</th>
        <th v-if="showRound1">一轮</th>
        <th v-if="showExchange">交换中</th>
        <th v-if="showExchange">可交换</th>
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
        <td v-if="showExchange" class="amount">{{ row.exchangeable }}</td>
        <td v-if="showRound2" class="amount">{{ row.round2 }}</td>
        <td v-if="showTotal" class="amount total">{{ row.total }}</td>
        <td v-if="$scopedSlots.operation">
          <slot name="operation" :session="row.session" :row="row" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapGetters } from 'vuex'
import SessionUtils from 'lib/session-utils'
const bySessionId = (a={}, b={}) => String(a.session).localeCompare(String(b.session))

export default {
  name: 'seat-view',
  mixins: [
    SessionUtils
  ],
  props: {
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
    ... mapGetters({
      seat: 'school/seat',
      exchanges: 'school/exchanges',
      id: 'user/school'
    }),
    seatArray() {
      let ret = []
      this.SESSIONS().forEach( s => {
        let r1 = (this.seat['1'] && this.seat['1'][s.id]) || 0
        let r2 = (this.seat['2'] && this.seat['2'][s.id]) || 0
        let inExchange = this.exchanges.filter(
          $ => $.from
            && $.from.session === s.id
            && $.from.school === this.id
            && !$.state
        ).length

        // number that is showed in table
        let numVisible = 0
        if (this.showRound1)   numVisible += r1
        if (this.showRound2)   numVisible += r2
        if (this.showTotal)    numVisible += (r1+r2)
        if (this.showExchange) numVisible += inExchange

        if (numVisible > 0) {
          ret.push({
            session: s,
            round1: r1 || '',
            round2: r2 || '',
            total: r1 + r2 || '',
            inExchange: s.reserved ? '' : (inExchange || ''),
            exchangeable: s.reserved ? '' : ((r1 - inExchange) || '')
          })
        }
      })
      return ret.sort(bySessionId)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../../style/flex"
@import "../../../style/table"
.session-name
  flex-horz: space-between center
  white-space: nowrap
  .tag
    margin-left: 1ch
table
  .amount
    text-align: right
    padding-right: 2.5ch
    font-family: monospace
    font-size: 16px
    &.total
      font-weight: bolder
</style>
