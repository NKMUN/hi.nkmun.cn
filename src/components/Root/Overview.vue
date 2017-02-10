<template>
  <div class="overview">
    <p>您正处于上帝模式，<b>请谨慎操作</b>。</p>
  </div>
</template>

<script>
export default {
  name: 'root-overview',
  components: {
    SeriousConfirm: require('../SeriousConfirm')
  },
  data: () => ({
  }),
  mounted() {
  }
}
</script>

<style lang="stylus" scoped>
.overview
  text-align: center
</style>
