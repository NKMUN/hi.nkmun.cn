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
        prop="_school"
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
            v-if="scope.row[s.id] > 0"
            type="success"
            size="mini"
            @click="tryExchange(scope.row._school, s.id)"
          > 交换 | <code>{{ scope.row[s.id] }}</code> </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog ref="dialog" title="选择己方名额">
      <div class="exchange-dialog-content">

        <el-form label-position="right" label-suffix="：">
          <el-form-item label="对方学校">
            <b>{{ exchange.target }}</b>
          </el-form-item>
          <el-form-item label="对方会场">
            <b>{{ SESSION(exchange.targetSession).name }}</b>
          </el-form-item>
          <el-form-item label="己方会场">
            <el-select v-model="exchange.selfSession">
              <el-option
                v-for="g in groups"
                :value="g.session"
                :label="SESSION(g.session).name"
                :disabled="
                     SESSION(g.session).reserved
                  || g.session === exchange.targetSession
                  || g.available <= 0
                "
              >
                <div class="session-line">
                  <span class="name">{{ SESSION(g.session).name }}</span>
                  <span class="amount">{{
                    SESSION(g.session).reserved ? '不可交换' : (
                      g.session === exchange.targetSession ? '同一会场' : (
                        ''+g.available+' / '+g.total
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
import { Button, Table, TableColumn, Tag, Dialog, Select, Option, Form, FormItem } from 'element-ui'
import { mapGetters } from 'vuex'
import SessionUtils from 'lib/session-utils'
import groupSeatsBySession from 'lib/group-seats'

const byId = (a,b) => String(a.id).localeCompare(String(b.id))

export default {
  name: 'seat-exchange-overview',
  components: {
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Tag.name]: Tag,
    [Dialog.name]: Dialog,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Select.name]: Select,
    [Option.name]: Option
  },
  mixins: [
    SessionUtils
  ],
  computed: {
    ...mapGetters({
      school: 'user/school',
      seats: 'school/seats'
    }),
    sessions() {
      return this.SESSIONS().filter( s => !s.reserved ).sort( byId )
    },
    groups() {
      return groupSeatsBySession(this.seats).map( g => ({
        session: g.session,
        total:   g.list.length,
        available: g.list.filter( s => !s.exchange ).length
      }) )
    }
  },
  data: () => ({
    loading: false,
    schools: [],
    exchange: {},
  }),
  methods: {
    async fetch() {
      let {
        body
      } = await this.$agent.get('/api/seats')
                .query({ by: 'school' })
      this.schools = body.map( $ => ({
        _school: $.school,
        ... $.seats.reduce( (ret, s) => ({
          ... ret,
          [s.session]: s.total
        }), {})
      }) )
      .filter( $ => $.school !== this.school )
    },
    tryExchange(school, session) {
      this.exchange = {
        target: school,
        targetSession: session,
        selfSession: null
      }
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
@import "../../style/flex"
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
