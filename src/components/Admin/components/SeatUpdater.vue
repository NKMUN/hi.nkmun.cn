<template>
  <div class="seat-updater">
    <h4 v-if="title">{{ title }}</h4>
    <!-- admin can bypass dual session requirement -->
    <SeatInput
      class="seat-input"
      :value="value"
      :sessions="sessions"
      :disabled="disabled"
      :checkDual="false"
      :max="max"
      @input="emit"
      @change="emit"
    />
    <el-button
      v-if="!disabled"
      size="small"
      type="success"
      icon="el-icon-check"
      :loading="busy"
      @click="$emit('confirm', value)"
    > 更新 </el-button>
  </div>
</template>

<script>
import SeatInput from './SeatInput'
export default {
  name: 'seat-updater',
  components: {
    SeatInput
  },
  props: {
    title: { type: String, default: '' },
    sessions: { type: Array, required: true },
    value: { type: Object },
    disabled: { type: Boolean, default: false },
    busy: { type: Boolean, default: false },
    max: { type: Object, default: () => ({}) },
  },
  methods: {
    emit(val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  }
}
</script>

<style lang="stylus">
@import "../../../style/flex"
.seat-updater
  flex-vert: flex-start center
  &:not(:first-child)
    margin-left: 8ch
  *
    flex-shrink: 0
    flex-grow: 0
  .el-button
    margin: .5em 0
</style>
