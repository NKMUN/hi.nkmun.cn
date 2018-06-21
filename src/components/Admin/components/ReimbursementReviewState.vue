<script>
import ElBadge from 'element-ui/lib/badge'
import "element-ui/lib/theme-chalk/badge.css"

export default {
  functional: true,
  render(h, ctx) {
    const { state } = ctx.props

    switch (state) {
      case 'submitted': return <el-tag size="small"> 待审核 </el-tag>
      case 'approved':  return <el-tag size="small" type="success"> <ElBadge is-dot> 已通过 </ElBadge> </el-tag>
      case 'rejected':  return <el-tag size="small" type="danger"> 未通过 </el-tag>
      case 'completed': return <el-tag size="small" type="success"> 已发放 </el-tag>
      default:          return <el-tag size="small" type="info"> 未提交 </el-tag>
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-tag
  margin-left: 1ch
  margin-right: 1ch
.el-badge /deep/ .el-badge__content.is-fixed.is-dot
  top: 3px
  right: 1px
</style>
