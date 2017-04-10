export default {
  namespaced: true,
  state: {
    apply: false,
    register: false,
    login: false,
    sessions: [],
    sessionMap: {}
  },
  getters: {
    apply: state => state.apply,
    register: state => state.register,
    login: state => state.login,
    sessions: state => state.sessions,
    sessionMap: state => state.sessionMap
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
    },
    update( state, update ) {
      ;['apply', 'register', 'login'].forEach( k => {
        if (update[k] !== undefined)
          state[k] = update[k]
      })
    }
  }
}
