<script>
import provinces from '@/lib/province-city'
import ElCascader from 'element-ui/lib/cascader'
import 'element-ui/lib/theme-chalk/cascader.css'

export default {
  functional: true,
  render(h, ctx) {
    return h(
      ElCascader,
      {
        ...ctx.data,
        props: {
          ...ctx.data.props,
          filterable: true,
          options: provinces.map(p => ({
            value: p.name,
            label: p.name,
            children: p.districts.map(d => ({
              value: d.name,
              label: d.name
            }))
          }))
        }
      },
      ctx.children
    )
  }
}
</script>
