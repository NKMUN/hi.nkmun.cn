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
import { Notification } from 'element-ui'

export default {
  name: 'review-control',
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
      return [
        { name: '待处理',
          list: (this.list||[]).filter( $ => !$.processed ).sort(this.orderBy) },
        { name: '已处理',
          list: (this.list||[]).filter( $ =>  $.processed ).sort(this.orderBy) }
      ]
    }
  },
  methods: {
    handleSelect(id) {
      this.$router.push(id)
    },
    handleNext(id) {
      let listPending = this.groups[0].list
      let nextIdx = listPending.findIndex( $ => $.id === id ) + 1
      if (nextIdx < listPending.length) {
        this.$router.push(listPending[nextIdx].id)
      } else {
        Notification({
          type: 'info',
          title: '没有更多的待处理项目',
          duration: 5000
        })
        this.$router.push('./')
      }
    },
    handleProcessed(id) {
      let idx = this.list.findIndex( $ => $.id === id )
      this.list.splice(idx, 1, { ...this.list[idx], processed: true })
    }
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
  .list
    min-width: 20ch
    overflow-x: initial
    overflow-y: scroll
  .reviewer
    overflow-x: initial
    overflow-y: scroll
    flex-grow: 1
</style>
