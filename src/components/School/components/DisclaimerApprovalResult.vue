<template>
  <div>
    <h4>权责声明：
      <el-tag v-if="state === 'loading'" type="info"> 载入中 </el-tag>
      <el-tag v-if="state === 'pending'" type="info"> 审核中 </el-tag>
      <el-tag v-if="state === 'approved'" type="success"> 全部通过 </el-tag>
      <el-tag v-if="state === 'rejected'" type="danger"> 未通过 </el-tag>
    </h4>

    <template v-if="state === 'rejected'">
      <p class="warn">以下代表的权责声明未通过，请联系分管公关处理</p>
      <table>
        <thead>
          <tr><th>会场</th><th>姓名</th><th>备注</th></tr>
        </thead>
        <tbody>
          <tr v-for="r in rejectedRepresentatives" :key="r.id">
            <td>{{ r.session.name }}</td>
            <td>{{ r.name }}</td>
            <td>{{ r.disclaimer_approval_note }}</td>
          </tr>
        </tbody>
      </table>
    </template>

  </div>
</template>

<script>
export default {
  props: {
    school: {
      type: String
    }
  },
  computed: {
    rejectedRepresentatives() {
      if (!this.representatives) return []
      return this.attendingRepresentatives.filter($ => $.disclaimer_approval === false)
    },
    approvedRepresentatives() {
      if (!this.representatives) return []
      return this.attendingRepresentatives.filter($ => $.disclaimer_approval === true)
    },
    attendingRepresentatives() {
      if (!this.representatives) return []
      return this.representatives.filter($ => $.withdraw !== true)
    },
    state() {
      if (!this.representatives) return 'loading'
      if (this.rejectedRepresentatives.length + this.approvedRepresentatives.length !== this.attendingRepresentatives.length) return 'pending'
      if (this.rejectedRepresentatives.length) return 'rejected'
      if (this.approvedRepresentatives.length === this.attendingRepresentatives.length) return 'approved'
    }
  },
  methods: {
    notifyError(e) {
      this.$message({
        type: 'error',
        message: e.message
      })
    },
    async fetch() {
      if (!this.school) {
        this.representatives = null
        return
      }
      try {
        this.representatives = await this.$agent.get(`/api/schools/${this.school}/representatives`).body()
      } catch(e) {
        this.notifyError('未能获取权责声明审核状态：' + e.message)
      }
    }
  },
  data() {
    return {
      representatives: null
    }
  },
  mounted() {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
@import "../../../style/table"
table
  margin-top: 1em
  min-width: 50ch
  max-width: 70ch
</style>
