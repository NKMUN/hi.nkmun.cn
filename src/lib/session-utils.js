import store from '../store'

const S = () => store.getters['config/sessions']
const M = () => store.getters['config/sessionMap']

export default {
  methods: {
    SESSION(id) {
      return { ... (M()[id] || {}) }
    },
    SESSIONS() {
      return [ ... S() ]
    }
  }
}
