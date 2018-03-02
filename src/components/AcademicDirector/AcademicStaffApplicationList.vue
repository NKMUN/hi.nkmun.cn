<template>
  <div class="academic-staff-application-list">
    <h4>
      学术团队申请
      <RefreshButton @click="fetch()" :loading="busy" throttle />
    </h4>
    <p v-if="pendingCount !== null && submittedCount !== null">
      已提交：<el-tag type="primary">{{submittedCount}}</el-tag>，申请中：<el-tag type="info">{{pendingCount}}</el-tag>
    </p>
    <el-table :data="applications || []" v-loading="busy" :default-sort="{ prop: 'score', order: 'descending' }">
      <el-table-column label="评分" width="84px" sortable prop="score">
        <RateScore :value="row.aggregate_review" slot-scope="{row}" />
      </el-table-column>
      <el-table-column label="姓名" prop="name" width="108px"/>
      <el-table-column label="性别" prop="gender" width="64px">
        <span slot-scope="{row}">{{ genderText(row.gender) }}</span>
      </el-table-column>
      <el-table-column label="职位" prop="roles" min-width="270px">
        <div slot-scope="{row}">
          <div v-for="role in row.roles" :key="role.department_id + '_' + role.position" class="role">
            <span class="department">{{ role.department_name }}</span> <span class="position">{{ role.position }}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column width="210px">
        <div slot-scope="{row}">
          <el-button
            type="primary"
            size="small"
            class="no-padding"
            icon="el-icon-view"
            @click="view(row.id)"
          > 查看 </el-button>
          <!--
          <el-button-group v-if="!row.processed">
            <el-tooltip content="Waitlist" placement="top" popper-class="asa-list-button-tooltip">
              <el-button
                type="info"
                size="mini"
                class="no-padding"
                @click="waitlist(row.id)"
              > <icon name="clock-o" /> </el-button>
            </el-tooltip>
            <el-tooltip content="好人卡" placement="top" popper-class="asa-list-button-tooltip">
              <el-button
                type="danger"
                size="mini"
                class="no-padding"
                @click="refuse(row.id)"
              > <icon name="bomb" /> </el-button>
            </el-tooltip>
            <el-tooltip content="邀请" placement="top" popper-class="asa-list-button-tooltip">
              <el-button
                type="success"
                size="mini"
                class="no-padding"
                @click="invite(row.id)"
              > <icon name="check" /> </el-button>
            </el-tooltip>
          </el-button-group>
          -->
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import 'vue-awesome/icons/bomb'
import 'vue-awesome/icons/check'
import 'vue-awesome/icons/clock-o'
import genderText from '@/lib/gender-text'
import RateScore from './components/RateScore'
export default {
  components: {
    RateScore
  },
  data() {
    return {
      busy: false,
      pendingCount: null,
      submittedCount: null,
      applications: [],
    }
  },
  methods: {
    fetch() {
      this.busy = true
      this.$agent.get(`/api/academic-staff-applications/`).then(
        res => {
          this.applications = res.body.data.map($ => ({
            ...$,
            score: $.refused ? 0 : $.aggregate_review || 0
          })).sort(
            (a, b) => a.score - b.score
          )
          this.pendingCount = res.body.pending
          this.submittedCount = res.body.submitted
        },
        err => this.$message({
          type: 'error',
          message: err.message
        })
      )
      .then(_ => this.busy = false)
    },
    view(id) {
      this.$router.push(id)
    },
    invite(id) {

    },
    waitlist(id) {

    },
    refuse(id) {

    },
    genderText
  },
  mounted() {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
.academic-staff-application-list
  max-width: 100ch
  margin: 0 auto
  h4
    text-align: center
  .el-tag
    height: unset
    line-height: 2
  .no-padding
    padding: 7px 7px
  .role
    white-space: pre-line
    .position
      color: #909399
      font-size: 90%
      margin-left: 1ch
  .el-button
    vertical-align: middle
  .el-button-group
    margin-left: 1ch
</style>

<style lang="stylus">
.asa-list-button-tooltip
  font-size: 75%
  padding: 5px
  transform: translate(0, 4px)
</style>
