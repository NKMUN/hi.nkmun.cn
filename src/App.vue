<template>
  <div id="app">

    <div class="wrap loading" v-if="loading || error">
      <Banner />
      <LayoutMiddle v-loading.body="loading" element-loading-text="正在载入，请稍等……">
        <el-alert
          class="maintainance-alert"
          v-if="error"
          title="维护中，请稍后再试。"
          type="warning"
          :description="error ? String(error) : ''"
          :closable="false"
          show-icon>
        </el-alert>
      </LayoutMiddle>
    </div>

    <router-view class="wrap" v-if="!loading && !error" />

    <Copyright />
  </div>
</template>

<script>
import { Loading, Alert } from 'element-ui'
import Banner from 'components/Banner'
import Copyright from 'components/Copyright'
import LayoutMiddle from 'components/LayoutMiddle'

export default {
  name: 'app',
  components: {
    [Loading.name]: Loading,
    [Alert.name]: Alert,
    Banner,
    Copyright,
    LayoutMiddle
  },
  data: () => ({
    loading: true,
    error: null
  }),
  async created() {
    // fetch global config
    this.loading = true
    try{
      let { body } = await this.$agent.get('/api/config')
      this.$store.commit('config/config', body)
    } catch(e) {
      this.error = e.message
    } finally {
      this.loading = false
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
      .maintainance-alert
        width: auto
</style>
