<script>
export default {
  functional: true,
  render() {
    return (
      <el-alert class="dual-session-warning" closable={false} show-icon={true} type="warning" title="双代" />
    )
  }
}
</script>

<style lang="stylus">
.dual-session-warning
  display: inline-block
  width: auto
  vertical-align: middle
  padding: 5px 10px
  background-color: transparent
  transform: scale(0.9)
  .el-alert__content
    padding: 0 0 0 .5ch
</style>

