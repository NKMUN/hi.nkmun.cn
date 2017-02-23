<template>
  <el-collapse :accordion="false" class="seat-view">
    <el-collapse-item v-for="g in groups" :name="g.id">
      <template slot="title">
        <span class="name">{{ g.name }}</span>
        <div class="right">
          <slot name="title-append" :group="g" />
        </div>
      </template>
      <div v-for="s in g.list">
        <span>{{ s.session.name }}</span>
        <div class="right">
          <slot name="operation" :seat="s" :group="g" />
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import { Collapse, CollapseItem } from 'element-ui'
const byId = (a={}, b={}) => String(a.id).localeCompare(String(b.id))
const groupBySession = (arr) =>
  arr.reduce( (ret, val) => {
    // NOTE: ignore O(n) lookup complexity for small inputs
    let el = ret.find( g => g.id === val.session.id )
    if ( !el ) {
      ret.push({ id: val.session.id, name: val.session.name, dual: val.session.dual, list: [] })
      el = ret[ ret.length - 1 ]
    }
    el.list.push( val )
    return ret
  }, [])
export default {
  name: 'seat-view',
  components: {
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
  },
  props: {
    seats: {
      type: Array,
      required: true
    }
  },
  computed: {
    groups() {
      return groupBySession(this.seats).sort(byId)
    }
  }
}
</script>

<style lang="stylus" scoped>
.right
  float: right
  margin-right: 4px
  vertical-align: middle
</style>
