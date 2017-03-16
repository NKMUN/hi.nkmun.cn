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
import Banner from 'components/Banner'
import Precondition from 'components/Precondition'

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
      return this.$agent.get('/api/config').then( res => res.body )
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
      flex-vert: flex-start stretch
</style>

<style lang="stylus">
.el-notification
  z-index: 99999 !important    // make sure it has greater z-index than loading mask
</style>
