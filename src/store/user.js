const decode = require('jwt-decode')

export default {
  namespaced: true,
  state: {
    token: null,
    payload: {}
  },
  getters: {
    access: state => state.payload.access || [],
    school: state => state.payload.school,
    authorization: state => [ 'Authorization', 'Bearer '+state.token ]
  },
  mutations: {
    token( state, token ) {
      if (token) {
        state.token = token
        state.payload = decode(token)
      }else {
        state.token = null
        state.payload = {}
      }
    }
  }
}
