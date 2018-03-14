<template>
  <div>
    <span>会场：</span>
    <el-select
      v-model="selected"
      placeholder="请选择会场"
      @change="emit"
      :disabled="disabled"
    >
      <el-option
        v-for="s in sessions"
        :key="s.id"
        v-if="!s.dual"
        :value="s.id"
        :label="s.name"
        :disabled="!s.allowsIndividual"
      />
    </el-select>
  </div>
</template>

<script>

export default {
  name: 'seat-select',
  props: {
    sessions: { type: Array, required: true },
    value: { type: Object },
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
    setValue(value, sessions) {
      for (let s of sessions)
        if (value && value[s.id])
          return this.selected = s.id
      return this.selected = null
    },
    emit() {
      const ret = {}
      for (let s of this.sessions)
        ret[s.id] = this.selected === s.id ? 1 : 0
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
