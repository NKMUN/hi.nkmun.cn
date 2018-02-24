<script>
import DatePicker from 'element-ui/lib/date-picker'

const defaultYear = new Date().getFullYear() - 18

export default {
  functional: true,
  render(h, ctx) {
    const handleFocus = (picker) => {
      if (ctx.data.on.focus)
        ctx.data.on.focus()
      picker.$nextTick(_ => {
        picker.picker.currentView = 'year'
      })
    }

    return (
      <DatePicker
        value={ctx.data.props.value}
        onFocus={handleFocus}
        onInput={ctx.data.on.input}
        valueFormat="yyyy-MM-dd"
        defaultValue={`${defaultYear}-01-01`}
        placeholder="请选择出生日期"
      />
    )
  }
}
</script>