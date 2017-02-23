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
            @click="tryExchange(scope.row.school, s.id)"
          > 交换 | <code>{{ scope.row[s.id] }}</code> </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog ref="dialog" title="选择己方名额">
      <div class="exchange-dialog-content">
        <!-- <SeatView :seats="seats" class="seats">
          <template slot="title-append" scope="scope">
            <el-tag v-if="scope.session.dual" type="warning">双代</el-tag>
            <el-tag type="primary">总数：<code>{{ scope.group.list.length }}</code></el-tag>
          </template>
          <template slot="operation" scope="scope">
            <el-tag type="gray" v-if="scope.seat.exchange">交换中</el-tag>
            <el-button
              v-if="!scope.seat.exchange && !scope.session.reserved"
              type="primary"
              size="mini"
              :disabled="scope.session.id === exchange.targetSession"
              @click="exchange.selfSession = scope.session.id"
            >{{ scope.session.id === exchange.targetSession ? '同一会场' : '选择' }}</el-button>
          </template>
        </SeatView> -->
        <p v-if="exchange.selfSession">
          用{{ SESSION(exchange.selfSession).name }}交换{{ exchange.target }}的{{ SESSION(exchange.targetSession).name }}
        </p>
        <el-button
          type="primary"
          :disabled="!exchange.selfSession"
          @click="confirmExchange"
        > 确认 </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { Button, Table, TableColumn, Tag, Dialog } from 'element-ui'
import { mapGetters } from 'vuex'
import SessionUtils from 'lib/session-utils'

const byId = (a,b) => String(a.id).localeCompare(String(b.id))

export default {
  name: 'seat-exchange-overview',
  components: {
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Tag.name]: Tag,
    [Dialog.name]: Dialog
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
      this.emit('exchange', { ... this.exchange })
      this.$refs.dialog.close()
    }
  },
  async mounted() {
    await this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
.header
  padding: 10px 15px
</style>
