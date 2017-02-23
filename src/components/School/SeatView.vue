<template>
  <el-collapse :accordion="false" class="seat-view">
    <el-collapse-item v-for="g in groups" :name="SESSION(g.session).name">
      <template slot="title">
        <span class="name">{{ SESSION(g.session).name }}</span>
        <div class="title-right">
          <el-tag v-if="SESSION(g.session).dual" type="warning">双代</el-tag>
          <el-tag type="primary">总数：<code>{{ g.list.length }}</code></el-tag>
        </div>
      </template>
      <div v-for="s in g.list" class="item">
        <span>{{ SESSION(s.session).name }}</span>
        <div class="right operation">
          <slot name="operation" :seat="s" :group="g" :session="SESSION(g.session)" />
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import { Collapse, CollapseItem, Tag } from 'element-ui'
import groupSeatsBySession from 'lib/group-seats'
import { mapGetters } from 'vuex'
import SessionUtils from 'lib/session-utils'
const bySessionId = (a={}, b={}) => String(a.session).localeCompare(String(b.session))

export default {
  name: 'seat-view',
  components: {
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Tag.name]: Tag
  },
  mixins: [
    SessionUtils
  ],
  props: {
    seats: {
      type: Array,
      required: true
    }
  },
  computed: {
    groups() {
      return groupSeatsBySession(this.seats).sort(bySessionId)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
.item
  flex-horz: space-between center
  margin: 1px 0
.title-right
  margin-left: 2ch
</style>
<style lang="stylus">
@import "../../style/flex"
.seat-view
  .el-collapse-item__header
    padding-left: 15px
    padding-right: 15px
    white-space: nowrap
    flex-horz: flex-start center
    .name
      flex-grow: 1
      overflow: hidden
      text-overflow: ellipsis
</style>
