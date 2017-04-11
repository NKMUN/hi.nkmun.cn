export default {
  namespaced: true,
  state: {
    apply: false,
    register: false,
    login: false,
    sessions: [],
    sessionMap: {},
    conferenceStartDate: null,
    conferenceEndDate: null
  },
  getters: {
    apply: state => state.apply,
    register: state => state.register,
    login: state => state.login,
    sessions: state => state.sessions,
    sessionMap: state => state.sessionMap,
    conferenceStartDate: state => state.conferenceStartDate,
    conferenceEndDate: state => state.conferenceEndDate,
  },
  mutations: {
    config( state, config ) {
      state.apply = (config && config.apply) || false
      state.register = (config && config.register) || false
      state.login = (config && config.login) || false
      state.sessions = ((config && config.sessions) || []).sort( (a,b) => a.id.localeCompare(b.id) )
      state.sessionMap = state.sessions.reduce(
        (ret, session) => ({ ...ret, [session.id]: session}),
        {}
      )
      state.conferenceStartDate = (config && config.conferenceStartDate) || null
      state.conferenceEndDate = (config && config.conferenceEndDate) || null
    },
    update( state, update ) {
      ;['apply', 'register', 'login', 'sessions', 'conferenceEndDate', 'conferenceStartDate'].forEach( k => {
        if (update[k] !== undefined)
          state[k] = update[k]
      })
    }
  }
}
