<script>
export default {
  functional: true,
  render(h, ctx) {
    const { name, value } = ctx.props
    return (
      <div class="simple-field">
        <span class="name">{ name }</span>
        <span class="value">{ value !== undefined ? value : ctx.children }</span>
      </div>
    )
  }
}
</script>


