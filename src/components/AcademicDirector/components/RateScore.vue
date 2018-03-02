<script>
import 'vue-awesome/icons/heartbeat'
export default {
  functional: true,
  render(h, ctx) {
    const { value } = ctx.props
    const score = value === undefined || value === null ? null : Math.floor(value)

    // heartbeat factor!
    const s = score || 0
    const scale = 0.5 + 0.5 * (s / 100)
    const color = `hsl(${48 - s * 0.48}, 100%, ${95 - s/3.5}%)`
    return (
      <span class={{
        rate: true,
        unavailable: value === undefined || value === null
      }}>
        <icon class="icon" name="heartbeat" width="48" height="48" style={{
          transform: `scale(${scale}, ${scale})`,
          color: score !== null ? color : null,
          width: '1.5em',
          height: '1.5em'
        }} />
        <span class="text">{ score === null ? '暂无' : score }</span>
      </span>
    )
  }
}
</script>

<style lang="stylus">
.rate
  display: inline-flex
  flex-direction: row
  align-items: center
  justify-content: flex-start
  .icon
    color: rgb(247, 186, 42)
  .text
    width: 3.5ch
    margin-left: .5ch
    vertical-align: text-bottom
  &.unavailable
    .icon
      color: rgb(239, 242, 247)
    .text
      color: #909399
</style>
