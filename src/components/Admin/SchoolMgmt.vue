<template>
  <div class="school-mgmt">
    <el-table
      :data="schools || []"
      size="small"
      height="100%"
      @row-click="handleRowClick"
      :row-class-name="getRowClassName"
    >
      <el-table-column
        label="区域"
        prop="administrative_area"
        width="84px"
        :filters="provinceFilters"
        :filter-method="provinceFilterHandler"
      />
      <el-table-column label="学校" prop="name" min-width="96px" />
    </el-table>

    <SchoolView
      class="school-view"
      :sessions="sessions.filter(s => !s.reserved)"
      :id="id"
      @nuked="handleRemove"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import SchoolView from './components/SchoolView'
import pinyinCmp from '@/lib/pinyin-cmp'
import { mapGetters } from 'vuex'
import { provinceFilters, provinceFilterHandler } from '@/lib/province-filter'

export default {
  name: 'school-mgmt',
  components: {
    SchoolView
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
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    },
  },
  data: () => ({
    schools: null,
    bySchoolName: (a, b) => pinyinCmp(a.name, b.name),
  }),
  methods: {
    fetch() {
      return this.$agent.get('/api/schools/')
        .body()
        .then(
          schoolList => {
            this.schools = schoolList.sort(this.bySchoolName)
          },
          err => this.$message({
            type: 'error',
            message: '列表获取失败：' + err.message
          })
        )
    },
    handleRemove(id) {
      const idx = this.schools.findIndex(school => school.id === id)
      if (idx >= 0) {
        this.schools = [
          ...this.schools.slice(0, idx),
          ...this.schools.slice(idx+1)
        ]
      }
      this.$router.push('../')
    },
    handleUpdate(id, update) {
      const idx = this.schools.findIndex(school => school.id === id)
      if (idx >= 0) {
        const newSchool = {
          ...this.schools[idx],
          ...update
        }
        this.schools = [
          ...this.schools.slice(0, idx),
          newSchool,
          ...this.schools.slice(idx+1)
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
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
.school-mgmt
  flex-horz: flex-start stretch
  align-self: stretch
  overflow: hidden
.el-table
  min-width: 300px
  max-width: 300px
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
.school-view
  flex-grow: 1
  overflow-y: scroll
</style>
