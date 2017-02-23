export default {
  namespaced: true,
  state: {
    stage: null,
    seats: [],
    messages: [],
  },
  getters: {
    stage: state => state.stage,
    seats: state => state.seats,
    messages: state => state.messages
  },
  mutations: {
    school( state, school ) {
      if (school) {
        state.stage = school.stage || null
      } else {
        state.stage = null
      }
    },
    seats(state, seats) {
      state.seats = seats || []
    },
    messages( state, messages ) {
      state.messages = messages || []
    },
    stage( state, stage ) {
      state.stage = stage
    },
    removeSeat(state, seatId) {
      state.seats.splice( state.seats.findIndex( s => s.id === seatId ), 1 )
    },
    addSeat(state, seat) {
      state.seats.push( seat )
    },
    exchangeSeat(state, {id, target}) {
      let idx = state.seats.findIndex( s => s.id == id )
      state.seats.splice(
        idx,
        1,
        { ...state.seats[idx], exchange: target }
      )
    }
  }
}
