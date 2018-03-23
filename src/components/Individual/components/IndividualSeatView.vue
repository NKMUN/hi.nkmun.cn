<template>
  <div>
    <span>已获得席位：</span>
    <span v-for="{session} in seatArray" :key="session.id">
      <el-tag type="primary" class="session-name">{{ session.name }}</el-tag>
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SessionUtils from '@/lib/session-utils'
const bySessionId = (a={}, b={}) => String(a.session).localeCompare(String(b.session))

export default {
  name: 'seat-view',
  mixins: [
    SessionUtils
  ],
  computed: {
    ... mapGetters({
      seat: 'school/seat',
      exchanges: 'school/exchanges',
      id: 'user/school'
    }),
    seatArray() {
      let ret = []
      this.SESSIONS().forEach(s => {
        const r1 = (this.seat['1'] && this.seat['1'][s.id]) || 0
        const r2 = (this.seat['2'] && this.seat['2'][s.id]) || 0
        const total = r1 + r2

        if (total) {
          ret.push({
            session: s,
            total
          })
        }
      })
      return ret.sort(bySessionId)
    }
  }
}
</script>

<style lang="stylus" scoped>
div
  text-align: center
</style>
