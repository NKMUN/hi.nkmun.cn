<template>
  <div class="layout-middle">
    <slot></slot>
  </div>
</template>

<style lang="stylus" scoped>
.layout-middle
  flex-grow: 1
  align-self: stretch
  display: flex
  flex-direction: row
  justify-content: center
  align-items: center
</style>

<script>
export default {
  name: 'layout-middle'
}
</script>
