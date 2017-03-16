<template>
  <el-menu
    mode="vertical"
    theme="dark"
    :router="false"
    class="list"
    ref="list"
    @select="handleListSelect"
    :default-active="actived"
  >
    <el-menu-item-group v-for="g in groups" :title="g.name">
      <el-menu-item
        class="list-item"
        v-for="entry in g.list"
        :index="entry.id"
      >{{ entry.name }}</el-menu-item>
    </el-menu-item-group>
  </el-menu>
</template>

<script>
export default {
  name: 'grouped-nav-list',
  props: {
    groups: { type: Array, default: [] },
    actived: { type: String, default: '' }
  },
  data: () => ({
    previousId: null
  }),
  methods: {
    setActiveId(id) {
      this.$refs.list.activedIndex = id
      this.previousId = id
    },
    handleListSelect(id) {
      this.setActiveId(this.previousId)
      this.$emit('select', id)
    }
  },
  watch: {
    actived(val) {
      this.setActiveId(val)
    }
  }
}
</script>

<style lang="stylus">
.list
  min-width: 20ch
  max-width: 35ch
  overflow-y: scroll
.list-item
  overflow: hidden
  text-overflow: ellipsis
</style>
