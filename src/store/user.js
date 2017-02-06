function jwtBody(token) {
  return JSON.parse( atob( token.split('.')[1] ) )
}

export default {
  namespaced: true,
  state: {
    token: null,
    payload: {}
  },
  getters: {
    role:   state => state.payload.role,
    school: state => state.payload.school,
    auth:   state => [ 'Bearer', state.token ]
  },
  mutations: {
    token( state, token ) {
      state.token = token
      state.payload = jwtBody(token)
    }
  }
}
