<script>
import ImageLoader from '@/components/Admin/components/ImageLoader'
export default {
  props: {
    value: {},
    tests: {}
  },
  render(h) {
    const { value, tests } = this
    if (!value || !tests)
      return (<div></div>)

    return (
      <pre style="white-space: pre-wrap">{ JSON.stringify(value, null, '  ') }</pre>
    )
  }
}
</script>

<style lang="stylus" scoped>
.academic-staff-application-form-view
  //
</style>
