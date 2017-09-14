<template>
  <div class="seat-allocation-view">
    <div class="controls">
      <span>显示：</span>
      <el-checkbox v-model="round1">一轮</el-checkbox>
      <el-checkbox v-model="round2">二轮</el-checkbox>
      <el-checkbox v-model="sum">总数</el-checkbox>
    </div>

    <div class="controls" v-if="schools">
      <span>会场：</span>
      <el-radio-group v-model="sessionType">
        <el-radio v-for="type in sessionTypes" :key="type" :label="type">{{type}}</el-radio>
      </el-radio-group>
    </div>

    <table>
      <thead>
        <tr>
          <th></th>
          <th class="session" v-for="s in activeSessions">{{s.name}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="$ in schools">
          <td class="school">{{$.name}}</td>
          <td v-for="s in activeSessions">
            <div class="seat-amount no-wrap">
              <span v-if="round1" class="amount" :data-amount="$.r1[s.id] || 0">
                {{ $.r1[s.id] || '-' }}
              </span>
              <span v-if="round2" class="amount" :data-amount="$.r2[s.id] || 0">
                {{ $.r2[s.id] || '-' }}
              </span>
              <span v-if="sum" class="amount" :data-amount="(($.r1[s.id]||0) + ($.r2[s.id]||0)) || 0">
                {{ (($.r1[s.id]||0) + ($.r2[s.id]||0)) || '-' }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SessionUtils from '@/lib/session-utils'

const bySchoolName = (a, b) => {
  if ( a && b )
    return a.name.localeCompare(b.name)
  if ( a && !b )
    return -1
  if ( !a && b )
    return 1
  return 0
}
const byTypeThenName = (a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name)

function mergeSeat(L, R) {
  L.sort( bySchoolName )
  R.sort( bySchoolName )
  let l = 0, r = 0
  let result = []
  while ( l < L.length || r < R.length ) {
    let cmp = bySchoolName(L[l], R[r])
    if ( cmp <= 0 ) {
      result.push({
        name: L[l].name,
        r1:   L[l].seat['1'] || {},
        r2:   L[l].seat['2'] || {}
      })
      ++l
      if (cmp === 0)
        ++r
    } else {
      result.push({
        name: R[r].name,
        r1:   R[r].seat || {},
        r2:   {}
      })
      ++r
    }
  }
  return result
}

import sessionTypes from '@/lib/session-types'

export default {
  name: 'seat-allocation-view',
  mixins: [
    SessionUtils
  ],
  computed: {
    ... mapGetters({
      authorization: 'user/authorization'
    }),
    activeSessions() {
      return this.SESSIONS().filter( $ => $.type === this.sessionType )
    }
  },
  data: () => ({
    schools: null,
    round1: true,
    round2: false,
    sum: false,
    sessionType: '中文',
    sessionTypes,
  }),
  methods: {
    async fetch() {
      try {
        let [ schools, applications ] = await Promise.all([
          this.$agent.get('/api/schools/')
            .query({ seat: 1 })
            .set( ... this.authorization )
            .then( res => res.body ),
          this.$agent.get('/api/applications/')
            .query({ seat: 1 })
            .set( ... this.authorization )
            .then( res => res.body )
        ])
        this.schools = mergeSeat(schools, applications)
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
@import "../style/flex"
.seat-allocation-view
  padding-bottom: 3em
.controls
  margin: 1em 0
.seat-amount
  flex-horz: center center
  .amount
    font-family: monospace
    font-size: 14px
    width: 2ch
    margin: 0 .25ch
    display: inline-block
    text-align: right
    &[data-amount="0"]
      color: #99A9BF
table
  border-collapse: collapse
  border: 1px solid rgb(223, 229, 236)
  th, .session
    background-color: rgb(238, 241, 246)
  th, td
    border: 1px solid rgb(223, 229, 236)
    text-align: center
    padding: .5em 2ch
  .session
    min-width: 12ch
</style>
