<script>
export default {
  functional: true,
  render(h, ctx) {
    const { state, canReview = false, busy = false } = ctx.props

    if (!canReview) return null

    const handleReject = () => {
      ctx.listeners.reject && ctx.listeners.reject()
      ctx.props.onReject && ctx.props.onReject()
    }
    const handleApprove = () => {
      ctx.listeners.approve && ctx.listeners.approve()
      ctx.props.onApprove && ctx.props.onApprove()
    }
    const handleComplete = () => {
      ctx.listeners.complete && ctx.listeners.complete()
      ctx.props.onComplete && ctx.props.onComplete()
    }

    return (
      <el-button-group>
        {
          state === 'submitted'
          ? <el-button
              type="danger"
              icon="el-icon-close"
              size="small"
              onClick={ handleReject }
              loading={ busy }
            > 不通过 </el-button>
          : null
        }
        {
          state === 'submitted'
          ? <el-button
              type="success"
              icon="el-icon-check"
              size="small"
              onClick={ handleApprove }
              loading={ busy }
            > 通过 </el-button>
          : null
        }
        {
          state === 'approved'
          ? <el-button
              type="primary"
              icon="el-icon-goods"
              size="small"
              onClick={ handleComplete }
              loading={ busy }
            > 发放 </el-button>
          : null
        }
      </el-button-group>
    )
  }
}
</script>

<style lang="stylus" scoped>
.el-tag
  margin-left: 1ch
  margin-right: 1ch
</style>
