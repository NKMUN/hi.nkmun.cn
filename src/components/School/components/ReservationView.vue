<template>
  <el-table class="reservations" v-loading="!reservations" :data="reservations || []">
    <el-table-column label="类型" width="88" align="center" sortable>
      <template scope="scope">
        <span>{{ scope.row.round | parseRound }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="hotel.name" label="酒店" min-width="180" sortable fit />
    <el-table-column prop="hotel.type" label="房型" width="108" sortable />
    <el-table-column label="入住时间" width="240">
      <template scope="scope">
        <span class="date">{{ scope.row.checkIn }}</span>
        <span class="delimiter"> - </span>
        <span class="date">{{ scope.row.checkOut }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'reservation-view',
  computed: {
    ... mapGetters({
      school: 'user/school',
      authorization: 'user/authorization'
    }),
  },
  data: () => ({
    reservations: null,
  }),
  methods: {
    async fetch() {
      try {
        let {
          body
        } = await this.$agent.get('/api/schools/'+this.school+'/reservations/')
                  .set( ... this.authorization )
        this.reservations = body
      } catch(e) {
        this.reservations = null
      }
    }
  },
  mounted() {
    this.fetch()
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
  .date
    font-family: monospace
</style>
<style lang="stylus">
.el-table
  .no-padding .cell
    text-align: center
    padding-left: 0
    padding-right: 0
</style>
