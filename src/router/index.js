import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import { hasAccess } from '../lib/access'

Vue.use(Router)

export function getRoleRoute(givenAccesses = []) {
  if (hasAccess(givenAccesses, 'staff')) return '/staff/'
  if (hasAccess(givenAccesses, 'finance')) return '/staff/'
  if (hasAccess(givenAccesses, 'admin')) return '/staff/'
  if (hasAccess(givenAccesses, 'leader')) return '/school/'
  if (hasAccess(givenAccesses, 'dais')) return '/dais/'
  if (hasAccess(givenAccesses, 'delegate')) return '/delegate/'
  return '/not-found'
}

// Statically bundled
import Index from '@/pages/Index.vue'
import NotFound from '@/pages/NotFound.vue'
import Logout from '@/components/Logout.vue'

// Lazy load:
const Apply    = () => import('@/pages/Apply.vue')
const Register = () => import('@/pages/Register.vue')
const Staff    = () => import('@/pages/Staff.vue')
const School   = () => import('@/pages/School.vue')
const Root     = () => import('@/pages/Root.vue')
const Committee = () => import('@/pages/Committee.vue')
const Volunteer = () => import('@/pages/Volunteer.vue')

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
const StaffOverview = () => import('@/components/Root/Overview.vue')

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
    { path: '/volunteer/', component: Volunteer },
    { path: '/staff/', component: Staff,
      beforeEnter: (to, from, next) => {
        const givenAccesses = store.getters['user/access']
        if (hasAccess(givenAccesses, 'staff') || hasAccess(givenAccesses, 'admin')) {
          next()
        } else {
          next('/')
        }
      },
      children: [
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
        { path: 'exports/', component: Export },
        { path: 'admin/users/', component: UserMgmt },
        { path: 'admin/initialize/', component: Initialize },
        { path: 'admin/config/', component: SystemConfig },
        { path: 'admin/application/', component: Application },
        { path: 'admin/sessions/', component: SessionMgmt },
        { path: 'admin/mail/', component: Mail },
        { path: 'admin/hotels/', component: HotelMgmt },
        { path: '*', component: StaffOverview }
      ]
    },
    { path: '/school/', component: School,
      beforeEnter: (to, from, next) => {
        if (hasAccess(store.getters['user/access'], 'leader')) {
          next()
        } else {
          next('/')
        }
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
    { path: '*', component: NotFound },
  ]
})
