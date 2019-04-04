<template>
  <div class="application-mgmt">
    <el-table
      :data="applications || []"
      size="small"
      height="100%"
      @row-click="handleRowClick"
      :row-class-name="getRowClassName"
    >
      <el-table-column
        label="状态"
        prop="processed"
        width="84px"
        :filters="[{ text: '已处理', value: true }, { text: '待处理', value: false }]"
        :filter-method="processStateFilterHandler"
      >
        <div slot-scope="{row}">
          <el-tag v-if="row.processed" type="success" size="mini">已处理</el-tag>
          <el-tag v-if="!row.processed" type="warning" size="mini">待处理</el-tag>
        </div>
      </el-table-column>

      <el-table-column
        label="区域"
        prop="administrative_area"
        width="84px"
        :filters="provinceFilters"
        :filter-method="provinceFilterHandler"
      />
      <el-table-column label="学校" prop="name" min-width="96px" />
    </el-table>

    <ApplicationReview
      class="application-view"
      ref="reviewer"
      :tests="tests"
      :sessions="sessions.filter(s => !s.reserved)"
      :id="id"
      @update="handleUpdate"
      @nuked="handleRemove"
    />
  </div>
</template>

<script>
import ApplicationReview from './components/ApplicationReview'
import pinyinCmp from '@/lib/pinyin-cmp'
import { mapGetters } from 'vuex'
import { provinceFilters, provinceFilterHandler } from '@/lib/province-filter'

export default {
  name: 'application-mgmt',
  components: {
    ApplicationReview
  },
  computed: {
    ...mapGetters({
      sessions: 'config/sessions'
    }),
    provinceFilters() {
      return provinceFilters
    },
    provinceFilterHandler() {
      return provinceFilterHandler
    },
    processStateFilterHandler() {
      return (val, row, col) => val === row[col.property]
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    tests: null,
    applications: null,
    byProcessStateThenSchoolName: (a, b) => {
      if (a.processed && !b.processed) return 1
      if (!a.processed && b.processed) return -1
      return pinyinCmp(a.name, b.name)
    }
  }),
  methods: {
    fetch() {
      return Promise.all([
        this.$agent.get('/api/config/application').body(),
        this.$agent.get('/api/applications/').body()
      ]).then(
        ([appConf, applications]) => {
          this.tests = appConf.tests
          this.applications = applications.sort(this.byProcessStateThenSchoolName)
        },
        err => this.$message({
          type: 'error',
          message: '列表获取失败：' + err.message
        })
      )
    },
    handleRemove(id) {
      const idx = this.applications.findIndex(app => app.id === id)
      if (idx >= 0) {
        this.applications = [
          ...this.applications.slice(0, idx),
          ...this.applications.slice(idx+1)
        ]
        this.$router.push('../')
      }
    },
    handleUpdate(id, update) {
      const idx = this.applications.findIndex(app => app.id === id)
      if (idx >= 0) {
        const newSchool = {
          ...this.applications[idx],
          ...update
        }
        this.applications = [
          ...this.applications.slice(0, idx),
          newSchool,
          ...this.applications.slice(idx+1)
        ]
      }
    },
    getRowClassName({row}) {
      if (row.id === this.id)
        return 'highlight'
    },
    handleRowClick(row) {
      const nextId = row.id ? row.id+'/' : ''
      this.$router.push(
          this.id
        ? (this.prefix || '../') + nextId
        : nextId
      )
    },
  },
  mounted() {
    this.fetch()
  },

  async beforeRouteUpdate(to, from, next) {
    if (this.$refs.reviwer)
      next( await this.$refs.reviewer.update() )
    else
      next()
  },
  async beforeRouteLeave(to, from, next) {
    if (this.$refs.reviwer)
      next( await this.$refs.reviewer.update() )
    else
      next()
  }
}
</script>


<style lang="stylus" scoped>
@import "../../style/flex"
.application-mgmt
  flex-horz: flex-start stretch
  align-self: stretch
  overflow: hidden
.el-table
  min-width: 400px
  max-width: 400px
  /deep/
    .el-table__column-filter-trigger
      line-height: 23px
    .el-table__row
      cursor: pointer
      &.highlight
        background-color: #ebeef5
        &:hover > td
          background-color: #f2f6fc
    .no-padding .cell
      text-align: center
      padding-left: 0
      padding-right: 0
.application-view
  flex-grow: 1
  overflow-y: scroll
</style>
