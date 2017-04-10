<template>
  <div>
    <div class="header">
      <b>可交换名额</b>
      <el-button
        type="info"
        size="small"
        icon="information"
        :loading="loading"
        @click="fetch"
      > 刷新 </el-button>
    </div>
    <el-table :data="schools">
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
          <el-button
            v-if="scope.row.seat['1'][s.id] > 0"
            :type="s.dual ? 'warning' : 'success'"
            size="mini"
            @click="tryExchange(scope.row.id, s.id, scope.row.name)"
          > {{ s.dual ? '双代交换' : '交换' }} | <code>{{ scope.row.seat['1'][s.id] }}</code> </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog ref="dialog" title="选择己方名额">
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
import SessionUtils from 'lib/session-utils'

const byId = (a,b) => String(a.id).localeCompare(String(b.id))

export default {
  name: 'seat-exchange-control',
  mixins: [
    SessionUtils
  ],
  computed: {
    ...mapGetters({
      id: 'user/school',
      authorization: 'user/authorization',
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
      return this.SESSIONS().filter( s => !s.reserved ).sort( byId )
    }
  },
  data: () => ({
    loading: false,
    schools: [],
    exchange: {},
    exchangeTargetName: null    // view only, do not post to server
  }),
  methods: {
    async fetch() {
      this.loading = true
      let {
        body
      } = await this.$agent.get('/api/schools/')
                .query({ seat: 1, stage: '1.exchange' })
                .set( ... this.authorization )
      this.schools = body.filter( $ => $.id !== this.id )
      this.loading = false
    },
    tryExchange(school, session, schoolName) {
      this.exchange = {
        target: school,
        targetSession: session,
        selfSession: null
      }
      this.exchangeTargetName = schoolName
      this.$refs.dialog.open()
    },
    confirmExchange() {
      this.$emit('exchange', { ... this.exchange })
      this.$refs.dialog.close()
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
  padding: 10px 15px
.session-line
  flex-horz: flex-start center
  .name
    flex-grow: 1
    overflow: hidden
    text-overflow: ellipsis
  .amount
    font-size: 13px
    margin-left: 3ch
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
