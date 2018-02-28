<script>
export default {
  functional: true,
  render(h, ctx) {
    const { name, value } = ctx.props
    return (
      <div class="simple-field">
        <span class="name">{ name }</span>
        <span class="value">{ ctx.children ? ctx.children : value }</span>
      </div>
    )
  }
}
</script>


