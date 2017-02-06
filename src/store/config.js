export default {
  namespaced: true,
  state: {
    apply: false,
    register: false,
    login: false
  },
  getters: {
    apply: state => state.apply,
    register: state => state.register,
    login: state => state.login
  },
  mutations: {
    config( state, config ) {
      state.apply = (config && config.apply) || false
      state.register = (config && config.register) || false
      state.login = (config && config.login) || false
    }
  }
}
