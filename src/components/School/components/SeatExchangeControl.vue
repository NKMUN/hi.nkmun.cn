<template>
  <div>
    <div class="header">
      <b>可交换名额</b>
      <RefreshButton @click="fetch" :loading="loading" throttle />
    </div>

    <div class="controls">
      <span>会场类型：</span>
      <el-radio-group v-model="sessionType">
        <el-radio v-for="type in sessionTypes" :key="type" :label="type">{{type}}</el-radio>
      </el-radio-group>
    </div>

    <el-table :data="schools">
      <el-table-column
        label="学校"
        prop="name"
        sortable
        fixed
      />
      <el-table-column
        v-for="s in activeSessions"
        :key="s.id"
        :label="s.name"
        align="center"
      >
          <el-button
            slot-scope="{row}"
            v-if="row.seat['1'][s.id] > 0"
            :type="s.dual ? 'warning' : 'success'"
            size="mini"
            @click="tryExchange(row.id, s.id, row.name)"
          > {{ s.dual ? '双代交换' : '交换' }} | <code>{{ row.seat['1'][s.id] }}</code> </el-button>
      </el-table-column>
    </el-table>

    <el-dialog
      title="选择己方名额"
      :visible="dialogVisible"
      :before-close="() => {dialogVisible = false}"
    >
      <div class="exchange-dialog-content">

        <el-form label-position="right" label-suffix="：">
          <el-form-item label="对方学校">
            <b>{{ exchangeTargetName }}</b>
          </el-form-item>
          <el-form-item label="对方会场">
            <b>{{ SESSION(exchange.targetSession).name }}</b>
            <el-tag v-if="SESSION(exchange.targetSession).dual" type="warning">双代</el-tag>
          </el-form-item>
          <el-form-item label="己方会场">
            <el-select v-model="exchange.selfSession">
              <el-option
                v-for="ss in selfSessions"
                :key="ss.id"
                :value="ss.id"
                :label="ss.name"
                :disabled="
                     ss.reserved
                  || ss.id === exchange.targetSession
                  || ss.exchangeable <= 0
                "
              >
                <div class="session-line">
                  <span class="name">{{ ss.name }}</span>
                  <el-tag v-if="ss.dual" type="warning" style="line-height: 22px !important;">双代</el-tag>
                  <span class="amount">{{
                    ss.reserved ? '不可交换' : (
                      ss.id === exchange.targetSession ? '同一会场' : (
                        ''+ss.exchangeable+' / '+ss.total
                      )
                    )
                  }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-button
          class="btn confirm"
          type="primary"
          :disabled="!exchange.selfSession"
          @click="confirmExchange"
        > 确认 </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SessionUtils from '@/lib/session-utils'
import SessionTypes from '@/lib/session-types'

const byId = (a,b) => String(a.id).localeCompare(String(b.id))

export default {
  name: 'seat-exchange-control',
  mixins: [
    SessionUtils
  ],
  computed: {
    ...mapGetters({
      id: 'user/school',
      seat: 'school/seat',
      exchanges: 'school/exchanges',
    }),
    selfSessions() {
      return this.sessions
             .map( session => {
               let numOfSeat = (this.seat['1'] && this.seat['1'][session.id]) || 0
               let inExchange = this.exchanges.filter(
                 $ => $.from
                   && $.from.school === this.id
                   && $.from.session === session.id
                   && !$.state
               ).length
               return {
                 ... session,
                 total: numOfSeat,
                 exchangeable: numOfSeat - inExchange
               }
             } )
             .filter( $ => $.total > 0 )
    },
    sessions() {
      return this.SESSIONS().filter( s => !s.reserved && s.exchangeable ).sort( byId )
    },
    activeSessions() {
      return this.sessions.filter( s => s.type === this.sessionType )
    },
    sessionTypes() {
      return SessionTypes.filter( type => this.sessions.some( s => s.type === type ) )
    }
  },
  data: () => ({
    loading: false,
    dialogVisible: false,
    schools: [],
    exchange: {},
    exchangeTargetName: null,    // view only, do not post to server
    sessionType: '中文',
  }),
  methods: {
    async fetch() {
      this.loading = true
      const schools = await this.$agent
        .get('/api/schools/')
        .query({ seat: 1, stage: '1.exchange' })
        .body()
      this.schools = schools.filter( $ => $.id !== this.id )
      this.loading = false
    },
    tryExchange(school, session, schoolName) {
      this.exchange = {
        target: school,
        targetSession: session,
        selfSession: null
      }
      this.exchangeTargetName = schoolName
      this.dialogVisible = true
    },
    confirmExchange() {
      this.$emit('exchange', { ... this.exchange })
      this.dialogVisible = false
    }
  },
  async mounted() {
    await this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
@import "../../../style/flex"
.header
  margin: 1em 15px
.session-line
  flex-horz: flex-start center
  .name
    flex-grow: 1
    overflow: hidden
    text-overflow: ellipsis
  .amount
    font-size: 13px
    margin-left: 3ch
.controls
  margin: 1em 15px
.exchange-dialog-content
  min-width: 300px
  white-space: nowrap
  flex-vert: flex-start stretch
  .btn.confirm
    align-self: center
</style>

<style lang="stylus">
.el-dialog.el-dialog--small
  width: auto
</style>
