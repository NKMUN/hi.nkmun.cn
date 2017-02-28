function jwtBody(token) {
  try {
    return JSON.parse( atob( token.split('.')[1] ) )
  }catch(e){
    return null
  }
}

export default {
  namespaced: true,
  state: {
    token: null,
    payload: {}
  },
  getters: {
    role:   state => {
      const precedance = ['root', 'admin', 'school']
      const access = state.payload.access || []
      return precedance.find( $ => access.indexOf($) !== -1 )
    },
    school: state => state.payload.school,
    authorization: state => [ 'Authorization', 'Bearer '+state.token ]
  },
  mutations: {
    token( state, token ) {
      if (token) {
        state.token = token
        state.payload = jwtBody(token)
      }else {
        state.token = null
        state.payload = {}
      }
    }
  }
}
