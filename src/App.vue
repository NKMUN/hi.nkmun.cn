<template>
  <div id="app">

    <Precondition
      :loader="configLoader"
      @loaded="configParser"
    />

    <router-view class="wrap" v-if="loaded" />

    <Copyright />
  </div>
</template>

<script>
import { Alert } from 'element-ui'
import Banner from 'components/Banner'
import Copyright from 'components/Copyright'
import Precondition from 'components/Precondition'

export default {
  name: 'app',
  components: {
    [Alert.name]: Alert,
    Banner,
    Copyright,
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
    .wrap
      flex-grow: 1
      flex-vert: flex-start stretch
</style>
