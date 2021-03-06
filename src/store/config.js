export default {
  namespaced: true,
  state: {
    applyAcademicStaff: false,
    applySchool: false,
    applyIndividual: false,
    register: false,
    login: false,
    sessions: [],
    sessionMap: {},
    conferenceStartDate: null,
    conferenceEndDate: null,
    earlybirdDiscountEndTime: null,
  },
  getters: {
    applyAcademicStaff: state => state.applyAcademicStaff,
    applySchool: state => state.applySchool,
    applyIndividual: state => state.applyIndividual,
    register: state => state.register,
    login: state => state.login,
    reserveHotel: state => state.reserveHotel,
    sessions: state => state.sessions,
    sessionMap: state => state.sessionMap,
    conferenceStartDate: state => state.conferenceStartDate,
    conferenceEndDate: state => state.conferenceEndDate,
    mailer: state => state.mailer,
    earlybirdDiscountEndTime: state => state.earlybirdDiscountEndTime
  },
  mutations: {
    config( state, config ) {
      state.applyAcademicStaff = (config && config.applyAcademicStaff) || false
      state.applySchool = (config && config.applySchool) || false
      state.applyIndividual = (config && config.applyIndividual) || false
      state.register = (config && config.register) || false
      state.login = (config && config.login) || false
      state.reserveHotel = (config && config.reserveHotel) || false
      state.mailer = (config && config.mailer) || 'internal'
      state.sessions = (config && config.sessions) || []
      state.sessionMap = state.sessions.reduce(
        (ret, session) => ({ ...ret, [session.id]: session}),
        {}
      )
      state.conferenceStartDate = (config && config.conferenceStartDate) || null
      state.conferenceEndDate = (config && config.conferenceEndDate) || null
      state.earlybirdDiscountEndTime = (config && config.earlybirdDiscountEndTime) || null
    },
    update( state, update ) {
      ;[
        'applyAcademicStaff',
        'applySchool',
        'applyIndividual',
        'register',
        'login',
        'reserveHotel',
        'sessions',
        'conferenceStartDate',
        'conferenceEndDate',
        'earlybirdDiscountEndTime',
        'mailer'
      ].forEach( k => {
        if (update[k] !== undefined)
          state[k] = update[k]
      })
    }
  }
}
