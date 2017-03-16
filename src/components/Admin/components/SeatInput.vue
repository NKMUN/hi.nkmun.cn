<template>
  <table>
    <tbody>
      <tr v-for="session in sessions" class="session">
        <td class="name">
          <span v-if="session.dual" class="hint">（双代）</span>
          <span> {{ session.name }} </span>
        </td>
        <td class="input">
          <el-input-number
            v-model="M[session.id]"
            :min="0"
            :max="20"
            :disabled="disabled"
            @change="checkAndEmit(session.id, session.dual)"
            :step="session.dual ? 2 : 1"
            size="small"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>

export default {
  name: 'seat-input',
  props: {
    sessions: { type: Array, required: true },
    value: { type: Object },
    className: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    created: false,
    M: {},
  }),
  methods: {
    checkAndEmit(id, dual) {
      this.$nextTick( () => {
        if ( dual && (this.M[id] % 2 !== 0) )
          this.M[id] = this.M[id] - 1
        this.$emit('input', this.M)
        this.$emit('change', this.M)
      })
    },
    reset() {
      this.setValue(null, this.sessions)
      this.emit()
    },
    validate() {
      return new Promise( r => r(true) )
    },
    setValue(value, sessions) {
      this.M = sessions.reduce((o, {id}) => ({
        ...o,
        [id]: (value && value[id]) || 0
      }), {})
    }
  },
  watch: {
    value(value) {
      this.setValue(value, this.sessions)
    }
  },
  created() {
    this.setValue(this.value, this.sessions)
  }
}
</script>

<style lang="stylus" scoped>
.session
  .name
    padding-right: 2ch
    text-align: right
    .hint
      display: inline-block    // necessary for transform to work
      font-weight: normal
      color: #99A9BF
      transform: scale(0.8, 0.8)
      transform-origin: right center
</style>
