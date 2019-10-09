<template>
  <el-select
    v-model="selected"
    placeholder="Pick one preference"
    @change="emit"
    :disabled="disabled"
    style="display: block"
  >
    <el-option
      v-for="s in sessions"
      :key="s.id"
      :value="s.id"
      :label="s.name"
    />
  </el-select>
</template>

<script>

export default {
  name: 'seat-select',
  props: {
    sessions: { type: Array, required: true },
    value: { },
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    created: false,
    selected: null
  }),
  methods: {
    reset() {
      this.setValue(null, this.sessions)
      this.emit()
    },
    setValue(value) {
      this.selected = value
    },
    emit() {
      const ret = this.selected
      this.$emit('input', ret)
      this.$emit('change', ret)
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
