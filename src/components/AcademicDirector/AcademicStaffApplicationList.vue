<template>
  <div class="academic-staff-application-list" ref="compo">
    <h4>
      学术团队申请
      <RefreshButton @click="fetch()" :loading="busy" throttle />
    </h4>
    <p v-if="pendingCount !== null && submittedCount !== null">
      已提交：<el-tag type="primary">{{submittedCount}}</el-tag>，申请中：<el-tag type="info">{{pendingCount}}</el-tag>
    </p>
    <p v-if="tests" class="legend">
      图例： <RateScore v-for="cat in categories" :key="cat.id" :text="cat.name" :value="50" :palette="cat.palette" />
    </p>
    <p v-if="tests" class="category-filter">
      筛选：
      <el-select v-model="category" size="small" value-key="id">
        <el-option label="全部" :value="null" />
        <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat" />
      </el-select>
    </p>
    <el-table :data="displayApplications || []" v-loading="busy" :default-sort="{ prop: 'score', order: 'descending' }">
      <el-table-column label="评分" width="84px" sortable prop="score">
        <div slot-scope="{row}">
          <RateScore
            v-for="{score, category} in row.winningCategories"
            :key="category.id"
            :value="score"
            :palette="category.palette"
          />
          <RateScore
            v-if="row.winningCategories.length === 0"
            :value="0"
            text="暂无"
          />
        </div>
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
      <el-table-column width="84px">
        <el-button
          slot-scope="{row}"
          type="primary"
          size="small"
          class="no-padding"
          icon="el-icon-view"
          @click="view(row.id)"
        > 查看 </el-button>
      </el-table-column>

      <el-table-column width="180px">
        <div slot-scope="{row}">
          <el-tag v-if="row.admission_status === 'admitted'" type="success"> 已录取 </el-tag>
          <el-tag v-if="row.admission_status === 'waitlist'" type="info"> 待定中 </el-tag>
          <el-tag v-if="row.admission_status === 'refused'" type="danger"> 已拒绝 </el-tag>

          <el-button-group v-if="row.admission_status !== 'admitted' && row.admission_status !== 'refused'">
            <el-tooltip
              v-if="row.admission_status !== 'waitlist'"
              content="备胎"
              placement="top"
              popper-class="asa-list-button-tooltip"
            >
              <el-button
                type="info"
                size="mini"
                class="no-padding"
                @click="waitlist(row.id)"
                :loading="row.busy"
              > <icon v-if="!row.busy" name="clock-o" /> </el-button>
            </el-tooltip>
            <el-tooltip
              content="好人卡"
              placement="top"
              popper-class="asa-list-button-tooltip"
            >
              <el-button
                type="danger"
                size="mini"
                class="no-padding"
                @click="refuse(row.id)"
                :loading="row.busy"
              > <icon v-if="!row.busy" name="bomb" /> </el-button>
            </el-tooltip>
            <el-tooltip
              content="❤️"
              placement="top"
              popper-class="asa-list-button-tooltip"
            >
              <el-button
                type="success"
                size="mini"
                class="no-padding"
                @click="admit(row.id)"
                :loading="row.busy"
              > <icon v-if="!row.busy" name="check" /> </el-button>
            </el-tooltip>
          </el-button-group>
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
import { computeCategoriesFromTests } from './lib/compute-categories'
import { rememberScroll, clearScroll, restoreScroll } from '@/lib/remember-scroll'
export default {
  components: {
    RateScore
  },
  computed: {
    categories() {
      return computeCategoriesFromTests(this.tests)
    },
    displayApplications() {
      if (this.category === null) {
        return this.applications.map(app => {
          const scores = app.aggregate_review || {}
          const highest = Math.max(...Object.values(scores))
          const winningCategories = Object.keys(scores).filter(cat => scores[cat] === highest)
          return {
            ...app,
            score: highest,
            winningCategories: winningCategories.map(catId => ({
              category: this.categories.find(category => category.id === catId),
              score: scores[catId],
            })),
          }
        })
      } else {
        return this.applications.filter(app =>
          app.roles.find(role => this.category.departments.includes(role.department_id))
        ).map(app => {
          const scores = app.aggregate_review || {}
          const catId = this.category.id
          return {
            ...app,
            score: scores[catId],
            winningCategories: [{
              category: {...this.category},
              score: scores[catId]
            }],
          }
        })
      }
    }
  },
  data() {
    return {
      busy: false,
      pendingCount: null,
      submittedCount: null,
      applications: [],
      tests: null,
      category: null
    }
  },
  methods: {
    fetchTests() {
      this.busy = true
      return this.$agent.get(`/api/config/academic-staff-application/`).then(
        res => this.tests = res.body.tests,
        err => this.$message({
          type: 'error',
          message: err.message
        })
      )
      .then(_ => this.busy = false)
    },
    fetch() {
      this.busy = true
      return this.$agent.get(`/api/academic-staff-applications/`).then(
        res => {
          this.applications = res.body.data.map(app => ({...app, busy: false}))
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
      rememberScroll(this.$refs.compo.parentElement)
      this.$router.push(id)
    },
    post(action, id) {
      const idx = this.applications.findIndex(app => app.id === id)
      this.applications[idx].busy = true
      return this.$agent.post(`/api/academic-staff-applications/${id}`).send({ [action]: true }).then(
        res => {
          this.applications = [
            ...this.applications.slice(0, idx),
            {
              ...this.applications[idx],
              admission_status: res.body.admission_status
            },
            ...this.applications.slice(idx + 1)
          ]
        },
        err => {
          this.$message({
            type: 'error',
            message: err.message
          })
          return this.fetch()
        }
      ).then(_ => this.applications[idx].busy = false)
    },
    admit(id) {
      return this.post('admit', id)
    },
    waitlist(id) {
      return this.post('waitlist', id)
    },
    refuse(id) {
      return this.post('refuse', id)
    },
    genderText
  },
  mounted() {
    this.fetchTests()
    .then(_ => this.fetch())
    .then(_ => restoreScroll(this.$refs.compo.parentElement) && clearScroll())
  }
}
</script>

<style lang="stylus" scoped>
.academic-staff-application-list
  max-width: 100ch
  margin: 0 auto
  .legend
    margin: .5em 0
    .rate
      vertical-align: bottom
      margin-right: 3ch
    &:last-child
      margin-right: 0
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
    .el-button
      width: 36px
      height: 36px
</style>

<style lang="stylus">
.asa-list-button-tooltip
  font-size: 75%
  padding: 5px
  transform: translate(0, 4px)
</style>
