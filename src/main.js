// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import superagent from 'superagent'

import { Loading } from 'element-ui'
import { getToken } from 'persistence/token'

Vue.use( Loading )
Vue.prototype.$agent = superagent

let token = getToken()
if (token) {
    store.commit('user/token', token)
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
