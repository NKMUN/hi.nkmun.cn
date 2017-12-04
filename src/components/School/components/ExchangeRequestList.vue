<template>
  <el-card class="exchange-mgmt-requests">
    <div class="header" slot="header">
      <b>待处理</b>
      <RefreshButton @click="fetchRequests()" :loading="loadingRequests" throttle />
    </div>
    <div v-if="this.requests.length === 0">暂无交换申请</div>
    <ul v-if="this.requests.length > 0">
      <li v-for="(req, idx) in this.requests">
        <div class="detail">
          <div>
            <el-tag type="gray">{{ req.from.name }}</el-tag>
            <el-tag type="success">{{ SESSION(req.from.session).name }}</el-tag>
          </div>
          <div style="margin-top: .5em">
            交换：
            <el-tag type="primary">{{ SESSION(req.to.session).name }}</el-tag>
            <el-tag type="warning" v-if="SESSION(req.to.session).dual">双代</el-tag>
          </div>
        </div>
        <div class="controls">
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            :disabled="busy || loadingRequests"
            :loading="busy"
            @click="acceptExchange(req, idx)"
          > 接受 </el-button>
          <el-button
            type="danger"
            icon="el-icon-close"
            size="mini"
            :disabled="busy || loadingRequests"
            :loading="busy"
            @click="refuseExchange(req, idx)"
          > 拒绝 </el-button>
        </div>
      </li>
    </ul>
  </el-card>
</template>

<script>
import SessionUtils from '@/lib/session-utils'
import { mapGetters } from 'vuex'

export default {
  name: 'exchange-request-list',
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
          .query({ to: this.id, state: 0 })
          .body()
      } catch(e) {
        this.requests = []
      } finally {
        this.loadingRequests = false
      }
    },
    async acceptExchange(req, idx) {
      try {
        this.busy = true
        let {
          ok,
          status,
          body: updatedSeat
        } = await this.$agent.post('/api/exchanges/'+req.id)
                  .ok( ({ok, status}) => ok || status === 410 )
                  .send({ accept: true })
        if (ok) {
          this.$store.commit('school/seat', updatedSeat)
          this.$notify({
            type: 'success',
            title: '已接受名额交换',
            duration: 5000
          })
        }
        if (status === 410) {
          this.$notify({
            type: 'warning',
            title: 'Oops! 该名额已被交换',
            duration: 5000
          })
        }
      } catch(e) {
        this.$notify({
          type: 'error',
          title: '未能处理请求',
          message: e.message,
          duration: 0
        })
      } finally {
        await this.fetchRequests()
        this.busy = false
      }
    },
    async refuseExchange(req, idx) {
      try {
        this.busy = true
        const updatedSeat = await this.$agent
          .post('/api/exchanges/'+req.id)
          .send({ refuse: true })
          .body()
        this.$store.commit('school/seat', updatedSeat)
        this.requests.splice(idx, 1)
        this.$notify({
          type: 'success',
          title: '已拒绝名额交换',
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
