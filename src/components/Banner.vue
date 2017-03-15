<template>
  <div class="banner">
    <router-link to="/" class="logo"> <img width="120" height="72" alt="Hi! NKMUN." src="/static/hilogo.png" /> </router-link>
    <a href="https://nkmun.cn/" class="logo"> <img width="122" height="72" alt="NKMUN" src="/static/nklogo.png" /> </a>
  </div>
</template>

<script>
export default {
  name: 'banner'
}
</script>

<style lang="stylus" scoped>
@import "../style/flex"
.banner
  flex-horz: center center
  padding: 4px 0
  background-color: #52ABF3
  .logo
    &:first-child
      margin-right: 30px
</style>
