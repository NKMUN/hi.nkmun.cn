import Vue from 'vue'
import Router from 'vue-router'
import store from 'store'

Vue.use(Router)

// Statically bundled
const Index    = require('pages/Index.vue')
const NotFound = require('pages/NotFound.vue')

// Lazy load:                                            Module                  chunk
const Apply    = r => require.ensure([], () => r(require('pages/Apply.vue')),    'apply')
const Register = r => require.ensure([], () => r(require('pages/Register.vue')), 'register')
const Admin    = r => require.ensure([], () => r(require('pages/Admin.vue')),    'admin')
const School   = r => require.ensure([], () => r(require('pages/School.vue')),   'school')
const Root     = r => require.ensure([], () => r(require('pages/Root.vue')),     'root')

export default new Router({
  routes: [
    { path: '/', component: Index },
    { path: '/apply/', component: Apply },
    { path: '/register/', component: Register },
    { path: '/admin/', component: Admin,
      beforeEnter: (to, from, next) => {

      },
      children: [

      ]
    },
    { path: '/school/', component: School,
      children: [

      ]
    },
    { path: '/root/', component: Root,
      children: [

      ]
    },
    { path: '*', component: NotFound }
  ]
})
