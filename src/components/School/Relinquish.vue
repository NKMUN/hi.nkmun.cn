<template>
  <div class="relinquish-mgmt">
    <h3>名额确认</h3>

    <div class="note">
      <ul>
        <li>请确认一轮分配名额</li>
        <li>放弃不需要的名额后，进入名额交换</li>
        <li>请谨慎放弃双代会场的名额</li>
      </ul>
    </div>

    <el-collapse :accordion="false" class="seat-view">
      <el-collapse-item v-for="g in seatGroups" :name="g.id">
        <template slot="title">
          <span class="name">{{ g.name }}</span>
          <el-tag class="right" type="primary">总数：{{ g.list.length }}</el-tag>
          <el-tag v-if="g.dual" class="right" type="warning">双代</el-tag>
        </template>
        <div v-for="s in g.list">
          <span>{{ s.session.name }}</span>
          <el-button
            v-if="!s.session.reserved"
            class="btn relinquish"
            size="mini"
            type="danger"
            icon="warning"
            :disabled="busy"
            @click="relinquishSeat(s.id, g)"
          > 放弃 </el-button>
        </div>
      </el-collapse-item>
    </el-collapse>

    <div class="leader-attendance">
      <LeaderAttendance v-model="leaderAttend" />
    </div>

    <el-button
      size="large"
      type="primary"
      :disabled="leaderAttend!==true && leaderAttend!==false"
      :loading="(leaderAttend===true || leaderAttend===false) && busy"
      @click="confirm"
    > 确认名额 </el-button>

    <SeriousConfirm ref="serious" />

  </div>
</template>

<script>
import { Alert, Button, Collapse, CollapseItem, Tag, Notification } from 'element-ui'
import SeriousConfirm from 'components/SeriousConfirm'
import LeaderAttendance from '../form/LeaderAttendance'
import { mapGetters } from 'vuex'
import store from 'store/index'

const byId = (a={}, b={}) => String(a.id).localeCompare(String(b.id))
const groupBySession = (arr) =>
  arr.reduce( (ret, val) => {
    // NOTE: ignore O(n) lookup complexity for small inputs
    let el = ret.find( g => g.id === val.session.id )
    if ( !el ) {
      ret.push({ id: val.session.id, name: val.session.name, dual: val.session.dual, list: [] })
      el = ret[ ret.length - 1 ]
    }
    el.list.push( val )
    return ret
  }, [])

export default {
  name: 'school-relinquish',
  components: {
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Tag.name]: Tag,
    [Button.name]: Button,
    LeaderAttendance,
    SeriousConfirm
  },
  computed: {
    ...mapGetters({
      school: 'user/school',
      authorization: 'user/authorization',
      seats: 'school/seats',
    }),
    seatGroups() {
      return groupBySession(this.seats).sort(byId)
    }
  },
  data: () => ({
    busy: false,
    leaderAttend: null
  }),
  methods: {
    async relinquishSeat(id, group) {
      let remaining = group.list.length - 1
      let name = group.name
      let message = '操作完成后，'+name+'的剩余名额为：'+remaining
      if ( await this.$refs.serious.confirm(message, name) ) {
        this.busy = true
        try {
          let {
            ok
          } = await this.$agent.delete('/api/schools/'+this.school+'/seats/'+id)
                    .set( ... this.authorization )
          this.$store.commit('school/removeSeat', id)
          Notification({
            type: 'warning',
            title: '已放弃名额',
            duration: 5000
          })
        } catch(e) {
          Notification({
            type: 'error',
            title: '未能放弃名额',
            message: e.message,
            duration: 0
          })
        } finally {
          this.busy = false
        }
      }
    },
    async confirm() {
      this.busy = true
      try {
        let {
          ok
        } = await this.$agent.post('/api/schools/'+this.school+'/seats/')
                  .query({ confirm: true })
                  .send({ leaderAttend: this.leaderAttend })
                  .set( ... this.authorization )
        this.$store.commit('school/stage', '1.exchange')
        this.$router.replace('/school/exchange/')
        Notification({
          type: 'success',
          title: '名额已确认',
          duration: 5000
        })
      } catch(e) {
        Notification({
          type: 'error',
          title: '名额确认失败',
          message: e.message,
          duration: 0
        })
      } finally {
        this.busy = false
      }
    }
  },
  beforeRouteEnter(from, to, next) {
    // guard against wrong stage
    if (store.getters['school/stage'] === '1.relinquishment')
      next()
    else
      next('/school/')
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
.relinquish-mgmt
  flex-vert: flex-start center
  .note
    white-space: nowrap
    color: #475669
    font-size: 14px
  .seat-view
    width: 100%
    max-width: 30ch
    .right
      float: right
      // match collapse-item's title height
      margin: 10px 4px 10px 0
      height: 23px
    .btn.relinquish
      float: right
  .leader-attendance
    margin-top: 3em
</style>
