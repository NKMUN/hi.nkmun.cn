<template>
  <div class="reimbursement-mgmt">
    <el-table
      :data="daises || []"
      size="small"
      height="100%"
      @row-click="handleRowClick"
      :row-class-name="getRowClassName"
    >
      <el-table-column label="姓名" prop="name" min-width="96px" />
      <el-table-column label="来程" prop="inbound_state" width="72px" class-name="no-padding">
        <ReimbursementReviewState slot-scope="{row}" :state="row.inbound_state" />
      </el-table-column>
      <el-table-column label="回程" prop="outbound_state" width="72px" class-name="no-padding">
        <ReimbursementReviewState slot-scope="{row}" :state="row.outbound_state" />
      </el-table-column>
      <el-table-column label="" width="32px" class-name="no-padding icon">
        <icon slot-scope="{row}" v-if="row.id === id" name="angle-double-right" />
      </el-table-column>
    </el-table>

    <ReimbursementReview
      class="reviewer"
      :id="id"
      @update-list="handleUpdate"
    />
  </div>
</template>

<script>
import ReimbursementReview from './components/ReimbursementReview'
import ReimbursementReviewState from './components/ReimbursementReviewState'
import pinyinCmp from '@/lib/pinyin-cmp'
import 'vue-awesome/icons/check'
import 'vue-awesome/icons/angle-double-right'

export default {
  name: 'reimbursement-mgmt',
  components: {
    ReimbursementReview,
    ReimbursementReviewState,
  },
  props: {
    id: { type: String, default: '' },
  },
  data: () => ({
    daises: null,
    byName: (a, b) => pinyinCmp(a.name, b.name),
  }),
  methods: {
    fetch() {
      return this.$agent.get('/api/dais-reimbursements/').then(
        resp => this.daises = resp.body,
        err => this.$message({
          type: 'error',
          message: '列表获取失败：' + err.message
        })
      )
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
    handleUpdate(obj) {
      const idx = this.daises.findIndex($ => $.id === obj.id)
      if (idx !== -1) {
        this.daises.splice(
          idx,
          1,
          {
            ...this.daises[idx],
            ...obj
          }
        )
      }
    }
  },
  mounted() {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
.reimbursement-mgmt
  flex-horz: flex-start stretch
  align-self: stretch
  overflow: hidden
  .el-table
    max-width: 360px
    min-width: 320px
    margin-right: 4ch
    /deep/
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
      .no-left-padding .cell
        text-align: center
        padding-left: 0
      .icon .cell
        flex-horz: center center
        color: #409eff
  .reviewer
    overflow-x: initial
    overflow-y: scroll
    flex-grow: 1
</style>
