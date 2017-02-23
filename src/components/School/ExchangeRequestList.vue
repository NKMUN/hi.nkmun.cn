<template>
  <el-card class="exchange-mgmt-requests" v-loading="loading">
    <div class="header" slot="header">
      <b>待处理</b>
      <el-button
        type="info"
        size="small"
        icon="information"
        :loading="loading"
        @click="fetchRequests"
      > 刷新 </el-button>
    </div>
    <div v-if="this.requests.length === 0">暂无交换申请</div>
    <ul v-if="this.requests.length > 0">
      <li v-for="(req, idx) in this.requests">
        <div class="detail">
          <div>
            <el-tag type="gray">{{ req.from.school }}</el-tag>
            <el-tag type="success">{{ SESSION(req.from.session).name }}</el-tag>
          </div>
          <div style="margin-top: .5em">
            交换：
            <el-tag type="warning">{{ SESSION(req.to.session).name }}</el-tag>
          </div>
        </div>
        <div class="controls">
          <el-button
            type="success"
            icon="check"
            size="mini"
            :disabled="loading"
            :loading="busy"
            @click="acceptExchange(req, idx)"
          > 接受 </el-button>
          <el-button
            type="danger"
            icon="close"
            size="mini"
            :disabled="loading"
            :loading="busy"
            @click="refuseExchange(req, idx)"
          > 拒绝 </el-button>
        </div>
      </li>
    </ul>
  </el-card>
</template>

<script>
import { Button, Card, Notification, Tag } from 'element-ui'
import { mapGetters } from 'vuex'
import SessionUtils from 'lib/session-utils'

export default {
  name: 'exchange-request-list',
  components: {
    [Button.name]: Button,
    [Card.name]: Card,
    [Tag.name]: Tag
  },
  mixins: [
    SessionUtils
  ],
  computed: {
    ... mapGetters({
      school: 'user/school',
      authorization: 'user/authorization'
    })
  },
  data: () => ({
    loading: false,
    busy: false,
    requests: []
  }),
  methods: {
    async fetchRequests() {
      this.loadingRequests = true
      try {
        let {
          body
        } = await this.$agent.get('/api/schools/'+this.school+'/exchanges/')
                  .set( ... this.authorization )
        this.requests = body
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
          body
        } = await this.$agent.post('/api/schools/'+this.school+'/exchanges/'+req.id)
                  .ok( ({ok, status}) => ok || status === 410 )
                  .send({ accept: true })
        if (ok) {
          this.$store.commit('school/seats', body)
          Notification({
            type: 'success',
            title: '已接受名额交换',
            duration: 5000
          })
        }
        if (status === 410) {
          Notification({
            type: 'warning',
            title: 'Oops! 该名额已被交换',
            duration: 5000
          })
        }
      } catch(e) {
        Notification({
          type: 'error',
          title: '未能处理请求',
          message: e.message,
          duration: 0
        })
      } finally {
        this.fetchRequests()
        this.busy = false
      }
    },
    async refuseExchange(req, idx) {
      try {
        this.busy = true
        let {
          ok
        } = await this.$agent.post('/api/schools/'+this.school+'/exchanges/'+req.id)
                  .send({ refuse: true })
        this.requests.splice(idx, 1)
        Notification({
          type: 'success',
          title: '已拒绝名额交换',
          duration: 5000
        })
      } catch(e) {
        this.fetchRequests()
        Notification({
          type: 'error',
          title: '未能处理请求',
          message: e.message,
          duration: 0
        })
      } finally {
        this.busy = false
      }
    }
  },
  mounted() {
    this.fetchRequests()
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
ul
  list-style: none
  padding: 0
  margin: 0
  li
    margin: 0
    flex-horz: space-between center
    .controls
      flex-vert: center stretch
      .el-button
        margin: .25em 0
</style>

<style lang="stylus">
@import "../../style/flex"
// do not scoped, these are injected to el-card
.exchange-mgmt-requests
  .el-card__header, .el-card__body
    padding: 10px 15px
  .el-card__body
    font-size: 14px
  .header
    flex-horz: space-between center
</style>
