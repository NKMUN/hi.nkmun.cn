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
  if (hasAccess(givenAccesses, 'transient.academic-staff.apply')) return '/academic-staff/apply/'
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
const Committee = () => import('@/pages/Committee.vue')
const Volunteer = () => import('@/pages/Volunteer.vue')
const DaisReg   = () => import('@/pages/DaisRegistration.vue')
const Dais      = () => import('@/pages/Dais.vue')
const AcademicStaffApply = () => import('@/pages/AcademicStaffApplication')
const AcademicStaffApplyDetail = () => import('@/pages/AcademicStaffApplyDetail')
const AcademicStaffApplyIntro = () => import('@/components/AcademicStaffApply/Intro')
const AcademicStaffApplyBasic = () => import('@/components/AcademicStaffApply/Basic')
const AcademicStaffApplyRoles = () => import('@/components/AcademicStaffApply/Roles')

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
const DaisMgmt = () => import('@/components/Admin/DaisMgmt.vue')
const Export = () => import('@/components/Admin/Export.vue')
const StaffOverview = () => import('@/components/Root/Overview.vue')
const Links = () => import('@/components/Root/Links.vue')

// School mgmt pages
const Relinquish  = () => import('@/components/School/Relinquish.vue')
const Exchange    = () => import('@/components/School/Exchange.vue')
const Reservation = () => import('@/components/School/Reservation.vue')
const Payment     = () => import('@/components/School/Payment.vue')
const Representative = () => import('@/components/School/Representative.vue')
const Confirm        = () => import('@/components/School/Confirm.vue')

// Dais mgmt pages
const SessionSeatMgmt = () => import('@/components/Dais/SessionSeatMgmt')
const DaisUserInfo = () => import('@/components/Dais/DaisUserInfo')

// Academic Director
const AcademicStaffApplicationConfig = () => import('@/components/AcademicDirector/AcademicStaffApplicationConfig')

// NOTE: keep router path in sync with Root/Links

export default new Router({
  routes: [
    { path: '/', component: Index },
    { path: '/apply/', component: Apply },
    { path: '/register/', component: Register },
    { path: '/committee/', component: Committee },
    { path: '/volunteer/', component: Volunteer },
    { path: '/dais-registration/', component: DaisReg },
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
        { path: 'admin/daises/', component: DaisMgmt },
        { path: 'admin/initialize/', component: Initialize },
        { path: 'admin/config/', component: SystemConfig },
        { path: 'admin/application/', component: Application },
        { path: 'admin/sessions/', component: SessionMgmt },
        { path: 'admin/mail/', component: Mail },
        { path: 'admin/hotels/', component: HotelMgmt },
        { path: 'admin/links', component: Links },
        { path: 'academic-director/application/', component: AcademicStaffApplicationConfig },
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
    { path: '/dais/', component: Dais,
      beforeEnter: (to, from, next) => {
        if (hasAccess(store.getters['user/access'], 'dais')) {
          next()
        } else {
          next('/')
        }
      },
      children: [
        { path: 'session-seats', component: SessionSeatMgmt },
        { path: 'user-info', component: DaisUserInfo },
      ]
    },
    { path: '/apply/academic/', component: AcademicStaffApply },
    { path: '/academic-staff/apply/', component: AcademicStaffApplyDetail,
      children: [
        { path: 'basic', component: AcademicStaffApplyBasic },
        { path: 'roles', component: AcademicStaffApplyRoles },
        { path: '*', component: AcademicStaffApplyIntro },
      ]
    },
    { path: '*', component: NotFound },
  ]
})
