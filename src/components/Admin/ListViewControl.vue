<template>
  <div class="wrap">

    <slot class="default" />

    <GroupedNavList
      class="list"
      v-if="list"
      :groups="groups"
      @select="handleSelect"
      :actived="id"
    />

    <slot
      class="reviewer"
      v-if="list"
      name="reviewer"
      :id="id"
    />

  </div>
</template>


<script>
import GroupedNavList from '../GroupedNavList.vue'

export default {
  name: 'list-view-control',
  components: {
    GroupedNavList
  },
  props: {
    id: {
      type: String, default: ''
    },
    orderBy: {
      type: Function,
      default: () => () => 0
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    groups() {
      return [ { name: '', list: (this.list||[]).sort(this.orderBy) } ]
    }
  },
  methods: {
    handleSelect(id) {
      this.$router.push(id)
    },
    handleNext(id) {
      let list = this.groups[0].list
      let nextIdx = list.findIndex( $ => $.id === id ) + 1
      if (nextIdx < list.length) {
        this.$router.push(list[nextIdx].id)
      } else {
        Notification({
          type: 'info',
          title: '没有更多的待处理项目',
          duration: 5000
        })
        this.$router.push('./')
      }
    },
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
.wrap
  flex-horz: flex-start stretch
  overflow: hidden
  .default
    flex-grow: 1
  .reviewer
    overflow-x: initial
    overflow-y: scroll
    flex-grow: 1
</style>
