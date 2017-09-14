import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

// Statically bundled
import Index from '@/pages/Index.vue'
import NotFound from '@/pages/NotFound.vue'
import Logout from '@/components/Logout.vue'

// Lazy load:
const Apply    = () => import('@/pages/Apply.vue')
const Register = () => import('@/pages/Register.vue')
const Admin    = () => import('@/pages/Admin.vue')
const School   = () => import('@/pages/School.vue')
const Root     = () => import('@/pages/Root.vue')
const Committee = () => import('@/pages/Committee.vue')

// Root mgmt pages
const SessionMgmt  = () => import('@/components/Root/SessionMgmt.vue')
const RootOverview = () => import('@/components/Root/Overview.vue')
const SystemConfig = () => import('@/components/Root/Config.vue')
const Application  = () => import('@/components/Root/Application.vue')
const Initialize   = () => import('@/components/Root/Initialize.vue')
const HotelMgmt    = () => import('@/components/Root/HotelMgmt.vue')
const Mail         = () => import('@/components/Root/Mail.vue')

// Admin mgmt pages
const ApplicationMgmt = () => import('@/components/Admin/ApplicationMgmt.vue')
const SchoolMgmt      = () => import('@/components/Admin/SchoolMgmt.vue')
const PaymentMgmt     = () => import('@/components/Admin/PaymentMgmt.vue')
const SecondRoundMgmt = () => import('@/components/Admin/SecondRoundMgmt.vue')
const SeatOverview    = () => import('@/components/Admin/SeatOverview.vue')
const StageOverview    = () => import('@/components/Admin/StageOverview.vue')
const RepresentativeMgmt = () => import('@/components/Admin/RepresentativeMgmt.vue')
const UserMgmt = () => import('@/components/Admin/UserMgmt.vue')
const Export = () => import('@/components/Admin/Export.vue')

// School mgmt pages
const Relinquish  = () => import('@/components/School/Relinquish.vue')
const Exchange    = () => import('@/components/School/Exchange.vue')
const Reservation = () => import('@/components/School/Reservation.vue')
const Payment     = () => import('@/components/School/Payment.vue')
const Representative = () => import('@/components/School/Representative.vue')
const Confirm        = () => import('@/components/School/Confirm.vue')

export default new Router({
  routes: [
    { path: '/', component: Index },
    { path: '/apply/', component: Apply },
    { path: '/register/', component: Register },
    { path: '/logout', component: Logout },
    { path: '/committee/', component: Committee },
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
          { path: 'users/', component: UserMgmt },
          { path: 'exports/', component: Export },
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
