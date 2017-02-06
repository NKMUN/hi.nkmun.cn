import Vue from 'vue'
import Router from 'vue-router'
import store from 'store'

Vue.use(Router)

// Chunked LazyLoad factory
// use template string for `path` to avoid warning
const LazyLoad = (path, chunk) => resolve => require.ensure([], () => resolve(require(`../${path}`)) )
const LazyLoadChunk = (chunk) => (path) => LazyLoad(path, chunk)

const LazyAdmin = LazyLoadChunk('admin')
const LazySchool = LazyLoadChunk('school')
const LazyRoot = LazyLoadChunk('root')

// use require() to be consistent
const Index    = require('pages/Index.vue')
const NotFound = require('pages/NotFound.vue')
const Apply    = LazyLoad('pages/Apply.vue')
const Register = LazyLoad('pages/Register.vue')

const Admin    = LazyAdmin('pages/Admin.vue')
const School   = LazySchool('pages/School.vue')
const Root     = LazyRoot('pages/Root.vue')

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
