<template>

  <div class="representative-mgmt">
    <el-table
      :data="schools || []"
      size="small"
      height="100%"
      @row-click="handleRowClick"
      :row-class-name="getRowClassName"
    >
      <el-table-column label="学校" prop="name" min-width="96px" />
      <el-table-column label="状态" prop="representative_state" class-name="no-padding" width="64px">
        <div slot-scope="{row}">
          <el-tag v-if="row.awaitingSubmission" size="small" type="info"> 待提交 </el-tag>
          <el-tag v-if="row.fullyReviewed" size="small" type="success"> 已通过 </el-tag>
          <el-tag v-if="row.pendingReview" size="small" type="warning"> 待审核 </el-tag>
          <el-tag v-if="row.pendingAction" size="small" type="danger"> 待复核 </el-tag>
        </div>
      </el-table-column>
    </el-table>

    <SchoolRepresentativeMgmt
      ref="reviewer"
      :school="school"
      :id="id"
      class="school-representative-mgmt"
      @update="handleUpdate"
    />
  </div>

</template>

<script>
import Precondition from '@/components/Precondition'
import SchoolRepresentativeMgmt from './components/SchoolRepresentativeMgmt'
import pinyinCmp from '@/lib/pinyin-cmp'

export default {
  name: 'representative-mgmt',
  components: {
    Precondition,
    SchoolRepresentativeMgmt
  },
  props: {
    school: { type: String, default: '' },
    id: { type: String, default: '' },
  },
  data: () => ({
    schools: null,
    bySchoolName: (a, b) => pinyinCmp(a.name, b.name),
    prefix: "/staff/representatives/"
  }),
  methods: {
    mapSchool($) {
      const {
        id, name, stage, attending_representatives, disclaimer_approved_representatives, disclaimer_rejected_representatives
      } = $
      return {
        ... $,
        id: id,
        name: name,
        awaitingSubmission: stage !== '9.complete',
        fullyReviewed: stage === '9.complete' && attending_representatives - disclaimer_approved_representatives === 0,
        pendingReview: stage === '9.complete' && disclaimer_approved_representatives + disclaimer_rejected_representatives !== attending_representatives,
        pendingAction: stage === '9.complete' && disclaimer_rejected_representatives > 0
      }
    },
    fetch() {
      return this.$agent.get('/api/schools/')
        .query({ representative_status: 1 })
        .then(
          resp => this.schools = resp.body.map(this.mapSchool),
          err => this.$message({
            type: 'error',
            message: '列表获取失败：' + err.message
          })
        )
    },
    getRowClassName({row}) {
      if (row.id === this.school)
        return 'highlight'
    },
    handleRowClick(row) {
      const nextId = row.id ? row.id+'/' : ''
      this.$router.push(
          this.school
        ? (this.prefix || '../') + nextId
        : nextId
      )
    },
    handleUpdate(payload) {
      const idx = this.schools.findIndex($ => $.id === payload.id)
      if (idx !== -1) {
        const newSchool = this.mapSchool({ ...this.schools[idx], ...payload })
        this.schools.splice(idx, 1, newSchool)
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
.representative-mgmt
  flex-horz: flex-start stretch
  align-self: stretch
  overflow: hidden
.el-table
  min-width: 300px
  max-width: 300px
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
.school-representative-mgmt
  flex-grow: 1
</style>
