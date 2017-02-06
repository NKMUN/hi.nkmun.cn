<template>
  <div class="layout-center">
    <slot></slot>
  </div>
</template>

<style lang="stylus" scoped>
.layout-center
  width: 100%
  display: flex
  flex-direction: row
  justify-content: center
  align-items: center
</style>

<script>
export default {
  name: 'layout-center'
}
</script>
