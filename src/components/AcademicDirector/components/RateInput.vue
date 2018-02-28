<template>
  <div class="rate-input">
    <div class="score">
      <span class="field-name">评价：</span>
      <RateScore :value="value && value.score" />
      <el-slider
        :value="value && value.score"
        @input="val => emitField('score', val)"
        :min="0"
        :max="100"
        :disabled="disabled"
      />
    </div>
    <el-input
      type="textarea"
      :value="value && value.remark"
      @input="val => emitField('remark', val)"
      :autosize="{ minRows: 3 }"
      placeholder="请输入评价"
      :disabled="disabled"
    />
  </div>
</template>

<script>
import { Slider } from 'element-ui'
import RateScore from './RateScore'
export default {
  components: {
    [Slider.name]: Slider,
    RateScore
  },
  props: {
    value: {},
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    emitField(field, val) {
      if (!this.value && val === 0) return    // hack el-slider's initial input emission
      const newValue = {
        ... (this.value || {}),
        [field]: val
      }
      this.$emit('input', newValue)
      this.$emit('change', newValue)
    }
  }
}
</script>

<style lang="stylus">
.rate-input
  .score
    display: flex
    flex-direction: row
    align-items: center
    justify-content: flex-start
    .field-name
      flex-shrink: 0
      flex-grow: 0
    .rate
      flex-basis: 7ch
      flex-shrink: 0
      flex-grow: 0
    .el-slider
      flex-shrink: 1
      flex-grow: 1
      flex-basis: 300px
      max-width: 400px
      min-width: 100px
  .el-textarea
    max-width: 80ch
    min-width: 200px
</style>
