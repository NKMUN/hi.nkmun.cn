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

    <SeatView :seats="seats">
      <template slot="title-append" scope="scope">
        <el-tag v-if="scope.group.dual" type="warning">双代</el-tag>
        <el-tag type="primary">总数：<code>{{ scope.group.list.length }}</code></el-tag>
      </template>
      <template slot="operation" scope="scope">
        <el-button
          v-if="!scope.seat.session.reserved"
          size="mini"
          type="danger"
          icon="warning"
          :disabled="busy"
          @click="relinquishSeat(scope.seat.id, scope.group)"
        > 放弃 </el-button>
      </template>
    </SeatView>

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
import SeatView from './SeatView'
import { mapGetters } from 'vuex'
import store from 'store/index'

export default {
  name: 'school-relinquish',
  components: {
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Tag.name]: Tag,
    [Button.name]: Button,
    LeaderAttendance,
    SeriousConfirm,
    SeatView
  },
  computed: {
    ...mapGetters({
      school: 'user/school',
      authorization: 'user/authorization',
      seats: 'school/seats',
    })
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
  .leader-attendance
    margin-top: 3em
</style>
