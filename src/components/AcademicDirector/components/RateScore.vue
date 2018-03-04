<script>
import 'vue-awesome/icons/heartbeat'
export default {
  functional: true,
  render(h, ctx) {
    const { value = null, hue = 0, emptyText = '暂无', text = null} = ctx.props
    const score = value === undefined || value === null ? null : Math.floor(value)

    // heartbeat factor!
    const s = score || 0
    const scale = 0.5 + 0.5 * (s / 100)
    const color = `hsl(${hue}, ${Math.max(100, 67 + s/3)}%, ${90 - s/3.5}%)`
    const displayText = text !== null
                        ? text
                        : score === null
                          ? emptyText
                          : score
    return (
      <span class={{
        rate: true,
        unavailable: value === undefined || value === null
      }}>
        <icon class="icon" name="heartbeat" width="48" height="48" style={{
          transform: `scale(${scale}, ${scale})`,
          color: color,
          width: '1.5em',
          height: '1.5em'
        }} />
        <span class="text">{ displayText }</span>
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
    min-width: 4.5ch
    margin-left: .5ch
    vertical-align: text-bottom
  &.unavailable
    .text
      color: #909399
</style>
