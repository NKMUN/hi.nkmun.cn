export default {
  namespaced: true,
  state: {
    school: {}
  },
  getters: {
    type: state => (state.school && state.school.type) || null,
    identifier: state => (state.school && state.school.identifier) || null,
    stage: state => (state.school && state.school.stage) || null,
    seat: state => (state.school && state.school.seat) || {},
    messages: state => (state.school && state.school.messages) || [],
    exchanges: state => (state.school && state.school.exchanges) || [],
    round: state => (state.school && state.school.stage && state.school.stage[0]) || '',
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
    },
    addExchange(state, exchange) {
      if (!state.school.exchanges)
        state.school.exchanges = []
      state.school.exchanges.push(exchange)
    },
  },

}
