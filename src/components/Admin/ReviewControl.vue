<template>
  <div class="review-control">

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
    },
    prefix: {
      type: String,
      default: null
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
      id = id ? id+'/' : ''
      this.$router.push(
          this.id
        ? (this.prefix || '../') + id
        : id
      )
    },
    handleNext(id) {
      let listPending = this.groups[0].list
      let nextIdx = listPending.findIndex( $ => $.id === id ) + 1
      if (nextIdx < listPending.length) {
        this.handleSelect(list[nextIdx].id)
      } else {
        this.$notify({
          type: 'info',
          title: '没有更多的待处理项目',
          duration: 5000
        })
        this.$router.push('')
      }
    },
    handleProcessed(id) {
      let idx = this.list.findIndex( $ => $.id === id )
      this.list.splice(idx, 1, { ...this.list[idx], processed: true })
    },
    handleRemove(id) {
      let idx = this.list.findIndex( $ => $.id === id )
      this.list.splice(idx, 1)
    },
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
.review-control
  flex-horz: flex-start stretch
  align-self: stretch
  overflow: hidden
  .default
    flex-grow: 1
  .reviewer
    overflow-x: initial
    overflow-y: scroll
    flex-grow: 1
</style>
