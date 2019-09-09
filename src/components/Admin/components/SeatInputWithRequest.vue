<template>
  <table>
    <thead>
      <th style="text-align: right">会场</th>
      <th style="text-align: center">申请</th>
      <th style="text-align: center">分配</th>
      <th></th>
    </thead>
    <tbody>
      <tr v-for="session in sessions" :key="session.id" class="session">
        <td class="name">
          <span> {{ session.name }} </span>
        </td>
        <td class="request-seat">
          <span v-if="request[session.id]" class="number">{{ request[session.id] }}</span>
          <span v-else class="hint">-</span>
        </td>
        <td class="input">
          <el-input-number
            v-model="M[session.id]"
            :min="0"
            :max="max && max[session.id] !== undefined ? max[session.id] : 100"
            :disabled="disabled || (max && max[session.id] === 0)"
            @change="checkAndEmit(session.id, session.dual)"
            :step="(checkDual && session.dual) ? 2 : 1"
            size="small"
            controls-position="right"
          />
        </td>
        <td class="badge">
          <span v-if="session.dual" class="hint">（双代）</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>

export default {
  name: 'seat-input-with-review',
  props: {
    sessions: { type: Array, required: true },
    request: { type: Object },
    value: { type: Object },
    className: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    checkDual: { type: Boolean, default: true },
    max: { type: Object, default: () => ({}) },
  },
  data: () => ({
    created: false,
    M: {},
  }),
  methods: {
    checkAndEmit(id, dual) {
      this.$nextTick( () => {
        if ( this.checkDual && dual && (this.M[id] % 2 !== 0) )
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
      }), value || {})
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
th
  padding-left: 2ch
  padding-right: 2ch
  word-break: keep-all
tr
  padding-bottom: .25ex
.session
  .name
    padding-right: 2ch
    padding-bottom: .5em
    padding-top: .5em
    text-align: right
    max-width: 30ch
  .request-seat
    text-align: center
  .hint
    display: inline-block    // necessary for transform to work
    font-weight: normal
    color: #99A9BF
    transform: scale(0.8, 0.8)
    transform-origin: right center
  .number
    font-weight: bolder
  .badge
    word-break: keep-all
.el-input-number
  width: 84px
.el-input-number.is-controls-right >>> .el-input__inner
  padding-left: 16px
  padding-right: 32px
</style>
