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
const SystemConfig = r => require.ensure([], () => r(require('components/Root/Config.vue')),      'root')
const Application  = r => require.ensure([], () => r(require('components/Root/Application.vue')), 'root')
const Initialize   = r => require.ensure([], () => r(require('components/Root/Initialize.vue')),  'root')
const HotelMgmt    = r => require.ensure([], () => r(require('components/Root/HotelMgmt.vue')),   'root')
const Mail         = r => require.ensure([], () => r(require('components/Root/Mail.vue')),  'root')

// Admin mgmt pages
const ApplicationMgmt = r => require.ensure([], () => r(require('components/Admin/ApplicationMgmt.vue')), 'admin')
const SchoolMgmt      = r => require.ensure([], () => r(require('components/Admin/SchoolMgmt.vue')), 'admin')
const PaymentMgmt     = r => require.ensure([], () => r(require('components/Admin/PaymentMgmt.vue')), 'admin')
const SecondRoundMgmt = r => require.ensure([], () => r(require('components/Admin/SecondRoundMgmt.vue')), 'admin')
const SeatOverview    = r => require.ensure([], () => r(require('components/Admin/SeatOverview.vue')),  'admin')
const StageOverview    = r => require.ensure([], () => r(require('components/Admin/StageOverview.vue')),  'admin')
const RepresentativeMgmt = r => require.ensure([], () => r(require('components/Admin/RepresentativeMgmt.vue')), 'admin')

// School mgmt pages
const Relinquish  = r => require.ensure([], () => r(require('components/School/Relinquish.vue')), 'school')
const Exchange    = r => require.ensure([], () => r(require('components/School/Exchange.vue')),   'school')
const Reservation = r => require.ensure([], () => r(require('components/School/Reservation.vue')), 'school')
const Payment     = r => require.ensure([], () => r(require('components/School/Payment.vue')),  'school')
const Representative = r => require.ensure([], () => r(require('components/School/Representative.vue')),  'school-confirm')
const Confirm        = r => require.ensure([], () => r(require('components/School/Confirm.vue')),  'school-confirm')

export default new Router({
  routes: [
    { path: '/', component: Index },
    { path: '/apply/', component: Apply },
    { path: '/register/', component: Register },
    { path: '/logout', component: Logout },
    { path: '/admin/', component: Admin,
      beforeEnter: (to, from, next) => {
        if ( store.getters['user/access'].indexOf('admin') !== -1 )
            next()
        else
            next('/')
      },
      children: [
          { path: '/', component: RootOverview },
          { path: 'applications/', component: ApplicationMgmt },
          { path: 'applications/:id', component: ApplicationMgmt, props: true },
          { path: 'schools/', component: SchoolMgmt },
          { path: 'schools/:id', component: SchoolMgmt, props: true },
          { path: 'payments/', component: PaymentMgmt },
          { path: 'payments/:id', component: PaymentMgmt, props: true },
          { path: 'second-round/', component: SecondRoundMgmt },
          { path: 'second-round/:id', component: SecondRoundMgmt, props: true },
          { path: 'overview/seat', component: SeatOverview },
          { path: 'overview/stage', component: StageOverview },
          { path: 'representatives/', component: RepresentativeMgmt },
          { path: 'representatives/:school', component: RepresentativeMgmt, props: true },
          { path: 'representatives/:school/:id', component: RepresentativeMgmt, props: true },
      ]
    },
    { path: '/school/', component: School,
      beforeEnter: (to, from, next) => {
        if ( store.getters['user/access'].indexOf('school') !== -1 )
            next()
        else
            next('/')
      },
      children: [
        { path: 'relinquishment', component: Relinquish },
        { path: 'exchange', component: Exchange },
        { path: 'reservation', component: Reservation },
        { path: 'payment', component: Payment },
        { path: 'representatives', component: Representative },
        { path: 'representatives/:id', component: Representative, props: true },
        { path: 'confirm', component: Confirm },
      ]
    },
    { path: '/root/', component: Root,
      beforeEnter: (to, from, next) => {
        if ( store.getters['user/access'].indexOf('root') !== -1 )
            next()
        else
            next('/')
      },
      children: [
        { path: '/', component: RootOverview },
        { path: 'overview', component: RootOverview },
        { path: 'initialize', component: Initialize },
        { path: 'config', component: SystemConfig },
        { path: 'application', component: Application },
        { path: 'sessions', component: SessionMgmt },
        { path: 'mail', component: Mail },
        { path: 'hotels', component: HotelMgmt },
      ]
    },
    { path: '*', component: NotFound },
  ]
})
