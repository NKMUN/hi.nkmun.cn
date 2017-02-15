<template>
  <div class="wrap">
    <slot class="default" />
    <slot name="list" class="list" />
    <slot name="reviewer" />
  </div>
</template>

<script>
export default {
  name: 'review-layout'
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
