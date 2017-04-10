<template>
  <div class="seat-allocation-view">
    <div class="controls">
      <span>显示：</span>
      <el-checkbox v-model="round1">一轮</el-checkbox>
      <el-checkbox v-model="round2">二轮</el-checkbox>
      <el-checkbox v-model="sum">总数</el-checkbox>
    </div>
    <el-table :data="schools || []" v-loading="!schools">
      <el-table-column
        label="学校"
        prop="name"
        sortable
        fixed
      />
      <el-table-column
        v-for="s in sessions"
        :label="s.name"
        align="center"
      >
        <template scope="scope">
          <div class="seat-amount">

            <span v-if="round1" class="amount" :data-amount="scope.row.r1[s.id] || 0">
              {{ scope.row.r1[s.id] || '-' }}
            </span>

            <span v-if="round2" class="amount" :data-amount="scope.row.r2[s.id] || 0">
              {{ scope.row.r2[s.id] || '-' }}
            </span>

            <span v-if="sum" class="amount" :data-amount="(scope.row.r1[s.id]+scope.row.r2[s.id]) || 0">
              {{ (scope.row.r1[s.id] + scope.row.r2[s.id]) || '-' }}
            </span>

          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SessionUtils from 'lib/session-utils'

const byId = (a, b) => a.id.localeCompare(b.id)
export default {
  name: 'seat-allocation-view',
  mixins: [
    SessionUtils
  ],
  computed: {
    ... mapGetters({
      authorization: 'user/authorization'
    }),
    sessions() {
      return this.SESSIONS().filter( s => !s.reserved ).sort( byId )
    },
  },
  data: () => ({
    schools: null,
    round1: true,
    round2: false,
    sum: false,
  }),
  methods: {
    async fetch() {
      try {
        let {
          body
        } = await this.$agent.get('/api/schools/')
                  .query({ seat: 1 })
                  .set( ... this.authorization )
        this.schools = body.map( school => ({
          name: school.name,
          r1: school.seat['1'],
          r2: school.seat['2'],
        }) )
      } catch(e) {
        console.error(e)
        this.schools = null
      }
    }
  },
  mounted() {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
.controls
  margin: 1em 0
.seat-amount
  flex-horz: flex-start center
  .amount
    font-family: monospace
    font-size: 14px
    width: 2ch
    margin: 0 .25ch
    display: inline-block
    text-align: right
    &[data-amount="0"]
      color: #99A9BF
</style>
