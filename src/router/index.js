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
  if (hasAccess(givenAccesses, 'individual')) return '/individual/'
  if (hasAccess(givenAccesses, 'delegate')) return '/delegate/'
  if (hasAccess(givenAccesses, 'academic-director')) return '/academic-director/'
  if (hasAccess(givenAccesses, 'transient.academic-staff.apply')) return '/academic-staff/apply/'
  return '/not-found'
}

// Statically bundled
import Index from '@/pages/Index'
import NotFound from '@/pages/NotFound'
import ApplyIntro from '@/pages/ApplyIntro'

// Lazy load:
const ApplySchool = () => import('@/pages/ApplySchool')
const ApplyIndividual = () => import('@/pages/ApplyIndividual')
const ApplyForeigner = () => import('@/pages/ApplyForeigner')
const ApplyAcademicStaff = () => import('@/pages/ApplyAcademicStaff')
const Register = () => import('@/pages/Register')
const Staff    = () => import('@/pages/Staff')
const School   = () => import('@/pages/School')
const Committee = () => import('@/pages/Committee')
const Volunteer = () => import('@/pages/Volunteer')
const Dais      = () => import('@/pages/Dais')
const Individual = () => import('@/pages/Individual')
const AcademicDirector = () => import('@/pages/AcademicDirector')

// Root mgmt pages
const SessionMgmt  = () => import(/* webpackChunkName: "root" */ '@/components/Root/SessionMgmt')
const SystemConfig = () => import(/* webpackChunkName: "root" */ '@/components/Root/Config')
const Application  = () => import(/* webpackChunkName: "root" */ '@/components/Root/Application')
const Initialize   = () => import(/* webpackChunkName: "root" */ '@/components/Root/Initialize')
const HotelMgmt    = () => import(/* webpackChunkName: "root" */ '@/components/Root/HotelMgmt')
const Mail         = () => import(/* webpackChunkName: "root" */ '@/components/Root/Mail')

// Admin mgmt pages
const ApplicationMgmt = () => import(/* webpackChunkName: "staff" */ '@/components/Admin/ApplicationMgmt')
const SchoolMgmt      = () => import(/* webpackChunkName: "staff" */ '@/components/Admin/SchoolMgmt')
const PaymentMgmt     = () => import(/* webpackChunkName: "staff" */ '@/components/Admin/PaymentMgmt')
const SeatOverview    = () => import(/* webpackChunkName: "staff" */ '@/components/Admin/SeatOverview')
const StageOverview    = () => import(/* webpackChunkName: "staff" */ '@/components/Admin/StageOverview')
const RepresentativeMgmt = () => import(/* webpackChunkName: "staff" */ '@/components/Admin/RepresentativeMgmt')
const UserMgmt           = () => import(/* webpackChunkName: "staff" */ '@/components/Admin/UserMgmt')
const StaffOverview      = () => import(/* webpackChunkName: "staff" */ '@/components/Root/Overview')
const Links              = () => import(/* webpackChunkName: "staff" */ '@/components/Root/Links')
const Export             = () => import(/* webpackChunkName: "finance" */ '@/components/Admin/Export')
const ReimbursementMgmt  = () => import(/* webpackChunkName: "finance" */ '@/components/Admin/ReimbursementMgmt')

// School mgmt pages
const Relinquish  = () => import(/* webpackChunkName: "school-s1" */ '@/components/School/Relinquish')
const Exchange    = () => import(/* webpackChunkName: "school-s1" */ '@/components/School/Exchange')
const Reservation = () => import(/* webpackChunkName: "school" */ '@/components/School/Reservation')
const Payment     = () => import(/* webpackChunkName: "school" */ '@/components/School/Payment')
const Representative = () => import(/* webpackChunkName: "school-s3" */ '@/components/School/Representative')
const Confirm        = () => import(/* webpackChunkName: "school-s3" */ '@/components/School/Confirm')

// Dais mgmt pages
const SessionSeatMgmt = () => import(/* webpackChunkName: "dais" */ '@/components/Dais/SessionSeatMgmt')
const DaisUserInfo = () => import(/* webpackChunkName: "dais" */ '@/components/Dais/DaisUserInfo')
const DaisReimbursement = () => import(/* webpackChunkName: "dais" */ '@/components/Dais/Reimbursement')

// Individual mgmt page
const IndividualPayment = () => import(/* webpackChunkName: "individual" */ '@/components/School/Payment')
const IndividualInfo = () => import(/* webpackChunkName: "individual" */ '@/components/Individual/Info')

// Academic Director
const AcademicDirectorDashboard = () => import(/* webpackChunkName: "ad" */ '@/components/AcademicDirector/Dashboard')
const AcademicStaffApplicationConfig = () => import(/* webpackChunkName: "ad" */ '@/components/AcademicDirector/AcademicStaffApplicationConfig')
const AcademicStaffApplicationList = () => import(/* webpackChunkName: "ad" */ '@/components/AcademicDirector/AcademicStaffApplicationList')
const AcademicStaffApplicationView = () => import(/* webpackChunkName: "ad" */ '@/components/AcademicDirector/AcademicStaffApplicationView')
const DaisMgmt = () => import(/* webpackChunkName: "ad" */ '@/components/AcademicDirector/DaisMgmt')

// Academic Staff Apply Detail
const AcademicStaffApplyDetail = () => import(/* webpackChunkName: "asa" */ '@/pages/AcademicStaffApplyDetail')
const AcademicStaffApplyIntro = () => import(/* webpackChunkName: "asa" */ '@/components/AcademicStaffApply/Intro')
const AcademicStaffApplyBasic = () => import(/* webpackChunkName: "asa" */ '@/components/AcademicStaffApply/Basic')
const AcademicStaffApplyRoles = () => import(/* webpackChunkName: "asa" */ '@/components/AcademicStaffApply/Roles')
const AcademicStaffApplyExperiences = () => import(/* webpackChunkName: "asa" */ '@/components/AcademicStaffApply/Experiences')
const AcademicStaffApplyAcademics = () => import(/* webpackChunkName: "asa" */ '@/components/AcademicStaffApply/Academics')
const AcademicStaffApplyExtras = () => import(/* webpackChunkName: "asa" */ '@/components/AcademicStaffApply/Extras')
const AcademicStaffApplyConfirm = () => import(/* webpackChunkName: "asa" */ '@/components/AcademicStaffApply/Confirm')

// NOTE: keep router path in sync with Root/Links

export default new Router({
  routes: [
    { path: '/', component: Index },
    { path: '/apply', component: ApplyIntro },
    { path: '/apply/school/', component: ApplySchool },
    { path: '/apply/individual/', component: ApplyIndividual },
    { path: '/apply/foreigner/', component: ApplyForeigner, meta: { title: 'Hi! NKMUN' } },
    { path: '/apply/academic/', component: ApplyAcademicStaff },
    { path: '/register/', component: Register },
    { path: '/committee/', component: Committee },
    { path: '/volunteer/', component: Volunteer },
    { path: '/staff/', component: Staff,
      beforeEnter: (to, from, next) => {
        const givenAccesses = store.getters['user/access']
        if (hasAccess(givenAccesses, 'staff') || hasAccess(givenAccesses, 'admin') || hasAccess(givenAccesses, 'finance')) {
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
        { path: 'reimbursements/', component: ReimbursementMgmt },
        { path: 'reimbursements/:id', component: ReimbursementMgmt, props: true },
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
        { path: 'admin/links', component: Links },
        { path: 'academic-director/config/', component: AcademicStaffApplicationConfig },
        { path: 'academic-director/applications/', component: AcademicStaffApplicationList },
        { path: 'academic-director/applications/:id', component: AcademicStaffApplicationView, props: true },
        { path: 'academic-director/daises/', component: DaisMgmt },
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
        { path: 'reimbursement', component: DaisReimbursement },
      ]
    },
    { path: '/individual/', component: Individual,
      children: [
        { path: 'payment/', component: IndividualPayment },
        { path: 'info/', component: IndividualInfo }
      ]
    },
    { path: '/academic-staff/apply/', component: AcademicStaffApplyDetail,
      children: [
        { path: 'basic', component: AcademicStaffApplyBasic },
        { path: 'roles', component: AcademicStaffApplyRoles },
        { path: 'experiences', component: AcademicStaffApplyExperiences },
        { path: 'academics', component: AcademicStaffApplyAcademics },
        { path: 'extras', component: AcademicStaffApplyExtras },
        { path: 'confirm', component: AcademicStaffApplyConfirm },
        { path: '*', component: AcademicStaffApplyIntro },
      ]
    },
    { path: '/academic-director/', component: AcademicDirector,
      children: [
        { path: 'config', component: AcademicStaffApplicationConfig },
        { path: 'applications/', component: AcademicStaffApplicationList },
        { path: 'applications/:id', component: AcademicStaffApplicationView, props: true },
        { path: 'daises/', component: DaisMgmt },
        { path: '*', component: AcademicDirectorDashboard },
      ]
    },
    { path: '*', component: NotFound },
  ]
})
