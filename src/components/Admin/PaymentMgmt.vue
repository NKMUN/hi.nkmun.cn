<template>

  <div class="payment-mgmt">
    <el-table
      :data="schools || []"
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

    <PaymentReview
      class="payment-view"
      :id="id"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import PaymentReview from './components/PaymentReview'
import pinyinCmp from '@/lib/pinyin-cmp'
import { provinceFilters, provinceFilterHandler } from '@/lib/province-filter'

export default {
  name: 'payment-mgmt',
  components: {
    PaymentReview
  },
  computed: {
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
    },
  },
  data: () => ({
    schools: null,
    byProcessStateThenSchoolName: (a, b) => {
      if (a.processed && !b.processed) return 1
      if (!a.processed && b.processed) return -1
      return pinyinCmp(a.name, b.name)
    }
  }),
  methods: {
    mapSchool(school) {
      return ({ ...school, processed: !school.stage.endsWith('.paid')})
    },
    fetch() {
      return this.$agent.get('/api/schools/')
        .body()
        .then(
          schoolList => {
            this.schools = schoolList
              .filter( school => school.stage.endsWith('.paid') || Number(school.stage[0]) > 1 || school.stage === '1.complete' )
              .map( this.mapSchool )
              .sort( this.byProcessStateThenSchoolName )
          },
          err => this.$message({
            type: 'error',
            message: '列表获取失败：' + err.message
          })
        )
    },
    handleUpdate(id, update) {
      const idx = this.schools.findIndex(school => school.id === id)
      if (idx >= 0) {
        const newSchool = this.mapSchool({
          ...this.schools[idx],
          ...update
        })
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
.payment-mgmt
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
.payment-view
  flex-grow: 1
  overflow-y: scroll
</style>
