import Vue from 'vue'
import Router from 'vue-router'
import store from 'store'

Vue.use(Router)

// Statically bundled
const Index    = require('pages/Index.vue')
const NotFound = require('pages/NotFound.vue')
const Logout   = require('components/Logout.vue')

// Lazy load:                                            Module                  chunk
const Apply    = r => require.ensure([], () => r(require('pages/Apply.vue')),    'apply')
const Register = r => require.ensure([], () => r(require('pages/Register.vue')), 'register')
const Admin    = r => require.ensure([], () => r(require('pages/Admin.vue')),    'admin')
const School   = r => require.ensure([], () => r(require('pages/School.vue')),   'school')
const Root     = r => require.ensure([], () => r(require('pages/Root.vue')),     'root')


// Root mgmt pages
const SessionMgmt  = r => require.ensure([], () => r(require('components/Root/SessionMgmt.vue')), 'root')
const RootOverview = r => require.ensure([], () => r(require('components/Root/Overview.vue')),    'root')
const Initialize   = r => require.ensure([], () => r(require('components/Root/Initialize.vue')),  'root')
const HotelMgmt    = r => require.ensure([], () => r(require('components/Root/HotelMgmt.vue')),   'root')

// Admin mgmt pages
const ApplicationMgmt = r => require.ensure([], () => r(require('components/Admin/ApplicationMgmt.vue')), 'admin')

export default new Router({
  routes: [
    { path: '/', component: Index },
    { path: '/apply/', component: Apply },
    { path: '/register/', component: Register },
    { path: '/logout', component: Logout },
    { path: '/admin/', component: Admin,
      beforeEnter: (to, from, next) => {
        // TODO: guard entry
        next()
      },
      children: [
          { path: '/', component: RootOverview },
          { path: 'applications/', component: ApplicationMgmt },
          { path: 'applications/:id', component: ApplicationMgmt, props: true }
      ]
    },
    { path: '/school/', component: School,
      children: [

      ]
    },
    { path: '/root/', component: Root,
      beforeEnter: (to, from, next) => {
        // TODO: guard entry
        next()
      },
      children: [
        { path: '/', component: RootOverview },
        { path: 'overview', component: RootOverview },
        { path: 'initialize', component: Initialize },
        { path: 'sessions', component: SessionMgmt },
        { path: 'hotels', component: HotelMgmt }
      ]
    },
    { path: '*', component: NotFound }
  ]
})
