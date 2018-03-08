<template>
  <el-card class="exchange-mgmt-requests">
    <div class="header" slot="header">
      <b>发出的请求</b>
      <RefreshButton @click="fetchRequests()" :loading="loadingRequests" throttle />
    </div>
    <div v-if="this.requests.length === 0">暂无发出的交换申请</div>
    <ul v-if="this.requests.length > 0">
      <li v-for="(req, idx) in this.requests" :key="req.id">
        <div class="detail">
          <div>
            与：
            <el-tag type="gray">{{ req.to.name }}</el-tag>
            <el-tag type="success">{{ SESSION(req.to.session).name }}</el-tag>
            <DualSessionWarning v-if="SESSION(req.to.session).dual" />
          </div>
          <div style="margin-top: .5em">
            交换：
            <el-tag type="primary">{{ SESSION(req.from.session).name }}</el-tag>
            <DualSessionWarning v-if="SESSION(req.from.session).dual" />
          </div>
        </div>
        <div class="controls">
          <el-button
            type="danger"
            icon="el-icon-close"
            size="mini"
            :disabled="busy || loadingRequests"
            :loading="busy"
            @click="cancelExchange(req, idx)"
          > 撤回 </el-button>
        </div>
      </li>
    </ul>
  </el-card>
</template>

<script>
import SessionUtils from '@/lib/session-utils'
import { mapGetters } from 'vuex'
import DualSessionWarning from './DualSessionWarning'

export default {
  name: 'exchange-request-list',
  components: {
    DualSessionWarning
  },
  mixins: [
    SessionUtils
  ],
  computed: {
    ... mapGetters({
      id: 'user/school',
    })
  },
  data: () => ({
    loadingRequests: false,
    busy: false,
    requests: []
  }),
  methods: {
    async fetchRequests() {
      this.loadingRequests = true
      try {
        this.requests = await this.$agent
          .get('/api/exchanges/')
          .query({ from: this.id, state: 0 })
          .body()
      } catch(e) {
        this.requests = []
      } finally {
        this.loadingRequests = false
      }
    },
    async cancelExchange(req, idx) {
      try {
        this.busy = true
        const updatedSeat = await this.$agent
          .post('/api/exchanges/'+req.id)
          .send({ cancel: true })
          .body()
        this.$store.commit('school/seat', updatedSeat)
        this.requests.splice(idx, 1)
        this.$notify({
          type: 'success',
          title: '已撤回名额交换',
          duration: 5000
        })
      } catch(e) {
        this.$notify({
          type: 'error',
          title: '未能处理请求',
          message: e.message,
          duration: 0
        })
      } finally {
        this.busy = false
        await this.fetchRequests()
      }
    }
  },
  mounted() {
    this.fetchRequests()
  }
}
</script>

<style lang="stylus" scoped>
@import "../../../style/flex"
ul
  list-style: none
  padding: 0
  margin: 0
  li
    padding: .5em 0
    &:not(:last-child)
      border-bottom: 1px solid #dfe6ec
    flex-horz: space-between center
    .controls
      flex-vert: center stretch
      .el-button
        margin: .25em 0
.el-alert
  display: inline-block
</style>

<style lang="stylus">
@import "../../../style/flex"
// do not scoped, these are injected to el-card
.exchange-mgmt-requests
  .el-card__header, .el-card__body
    padding: 10px 15px
  .el-card__body
    font-size: 14px
  .header
    flex-horz: space-between center
</style>
