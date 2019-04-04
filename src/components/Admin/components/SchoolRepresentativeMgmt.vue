<template>
  <div class="school-representative-mgmt">
    <el-table
      :data="representatives || []"
      size="small"
      height="100%"
      @row-click="handleRowClick"
      :row-class-name="getRowClassName"
    >
      <el-table-column label="会场" prop="sessionName" min-width="96px" />
      <el-table-column v-if="showRepresentativeState" label="状态" prop="representative_state" class-name="no-padding" width="64px">
        <div slot-scope="{row}">
          <el-tag v-if="row.withdraw" size="small" type="info"> 退会 </el-tag>
          <el-tag v-if="row.approved" size="small" type="success"> 已通过 </el-tag>
          <el-tag v-if="row.pendingReview" size="small" type="warning"> 待审核 </el-tag>
          <el-tag v-if="row.pendingAction" size="small" type="danger"> 待复核 </el-tag>
        </div>
      </el-table-column>
    </el-table>

    <RepresentativeView
      ref="reviewer"
      class="representative-view"
      :id="id"
      :school="school"
      :leader-editable="leaderEditable"
      :show-withdraw="Boolean(showWithdraw)"
      @update="handleUpdate"
    />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Precondition from '@/components/Precondition'
import RepresentativeView from './RepresentativeView'
import pinyinCmp from '@/lib/pinyin-cmp'
import { hasAccess } from '@/lib/access'

export default {
  name: 'school-representative-mgmt',
  components: {
    Precondition,
    RepresentativeView
  },
  props: {
    school: { type: String, default: '' },    // school id
    id: { type: String, default: '' },        // representative id
  },
  computed: {
    ... mapGetters({
      access: 'user/access',
    }),
    leaderEditable() {
      if (this.representatives)
        return !this.representatives.find( $ => $.session.id === '_leader_nr' )
      return true
    },
    showRepresentativeState() {
      return hasAccess(this.$store.getters['user/access'], 'staff')
    },
    showWithdraw() {
      return hasAccess(this.$store.getters['user/access'], 'staff')
          || hasAccess(this.$store.getters['user/access'], 'leader')
    }
  },
  data: () => ({
    representatives: null
  }),
  methods: {
    notifyError(e, title='操作失败') {
      this.$notify({
        type: 'error',
        title,
        message: e.message,
        duration: 0
      })
    },
    mapRepresentative($) {
      return {
        ... $,
        sessionName: $.session.name,
        representativeName: $.contact && $.contact.name,
        approved: !$.withdraw && $.disclaimer_approval === true,
        pendingReview: !$.withdraw && $.disclaimer_approval !== true && $.disclaimer_approval !== false,
        pendingAction: !$.withdraw && $.disclaimer_approval === false,
      }
    },
    fetch() {
      if (!this.school) {
        return this.representatives = null
      } else {
        return this.$agent
          .get('/api/schools/'+this.school+'/representatives')
          .then(
            res => this.representatives = res.body.map(this.mapRepresentative),
            err => {
              this.notifyError(err)
              this.representatives = null
            }
          )
      }
    },
    bySessionName(a, b) {
      return pinyinCmp(a.session.name, b.session.name)
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
    handleUpdate(payload) {
      const idx = this.representatives.findIndex($ => $.id === payload.id)
      if (idx !== -1) {
        const newRepresentative = this.mapRepresentative({ ...this.representatives[idx], ...payload })
        this.representatives.splice(idx, 1, newRepresentative)
      }
      // propagate to higher level
      const representativeState = {
        id: this.school,
        attending_representatives: this.representatives.filter($ => $.withdraw !== true).length,
        disclaimer_approved_representatives: this.representatives.filter($ => $.withdraw !== true && $.disclaimer_approval === true).length,
        disclaimer_rejected_representatives: this.representatives.filter($ => $.withdraw !== true && $.disclaimer_approval === false).length,
      }
      this.$emit('update', representativeState)
    }
  },
  mounted() {
    this.fetch()
  },
  watch: {
    school() {
      this.fetch()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../../style/flex"
.school-representative-mgmt
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
.representative-view
  flex-grow: 1
  overflow-y: scroll
</style>
