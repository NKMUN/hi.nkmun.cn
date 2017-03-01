export default {
  namespaced: true,
  state: {
    school: {}
  },
  getters: {
    stage: state => (state.school && state.school.stage) || null,
    seat: state => (state.school && state.school.seat) || {},
    messages: state => (state.school && state.school.messages) || []
  },
  mutations: {
    school( state, school ) {
      state.school = school || null
    },
    stage( state, stage ) {
      state.school.stage = stage
    },
    seat( state, seat ) {
      state.school.seat = seat || null
    },
    incSeat(state, {round, session, amount}) {
      let r = state.school.seat[round]
      if (r && r[session])
        r[session] += amount
    }
  }
}
