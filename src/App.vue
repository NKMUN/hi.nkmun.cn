<template>
  <div id="app">

    <Precondition
      :loader="configLoader"
      @loaded="configParser"
    />

    <router-view class="wrap" v-if="loaded" />

  </div>
</template>

<script>
import Banner from '@/components/Banner'
import Precondition from '@/components/Precondition'

export default {
  name: 'app',
  components: {
    Banner,
    Precondition
  },
  data: () => ({
    loaded: false
  }),
  methods: {
    configLoader() {
      return this.$agent.get('/api/config').body()
    },
    configParser(config) {
      this.$store.commit('config/config', config)
      this.loaded = true
    }
  }
}
</script>

<style lang="stylus">
@import "style/flex"
html, body
  padding: 0
  margin: 0
  max-width: 100vw
  min-height: 100vh
body
  #app
    width: 100%
    min-height: 100vh
    flex-vert: flex-start stretch
    & > .wrap
      flex-grow: 1
</style>

<style lang="stylus">
.el-notification
  z-index: 99999 !important    // make sure it has greater z-index than loading mask
.fa-icon
  width: 2ch
.el-alert
  // botch element's Alert import style issue, see: https://github.com/ElemeFE/element/issues/7195
  .el-alert__icon
    display: table-cell
    vertical-align: middle
.el-header, .el-footer, .el-main
  padding-left: 0
  padding-right: 0
// el-menu arrow color
.el-submenu__title .el-submenu__icon-arrow
  color: #ffffff
</style>
