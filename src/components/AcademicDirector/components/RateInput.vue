<template>
  <div class="rate-input">
    <div class="score">
      <div class="field-name">图例：</div>
      <div class="legend">
        <RateScore v-for="cat in categories" :key="cat.id" :value="50" :text="cat.name" :palette="cat.palette" />
      </div>
      <div class="field-name">评价：</div>
      <div class="slider" v-for="cat in categories" :key="cat.id">
        <RateScore :value="value && value.score && value.score[cat.id]" :palette="cat.palette" />
        <el-slider
          :value="value && value.score && value.score[cat.id]"
          @input="val => emitScore(cat.id, val)"
          :min="0"
          :max="100"
          :disabled="disabled"
        />
      </div>
    </div>
    <el-input
      type="textarea"
      :value="value && value.remark"
      @input="val => emitField('remark', val)"
      autocomplete="off"
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
    categories: {},
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    emitField(field, val) {
      const newValue = {
        ... (this.value || {}),
        [field]: val
      }
      this.$emit('input', newValue)
      this.$emit('change', newValue)
    },
    emitScore(categoryId, val) {
      if (!this.value && val === 0) return    // hack el-slider's initial input emission
      const score = this.value && this.value.score || {}
      const newScore = {
        ...score,
        [categoryId]: val
      }
      this.emitField('score', newScore)
    }
  }
}
</script>

<style lang="stylus">
.rate-input
  .legend
    padding-bottom: 1em
    margin-bottom: 1em
    border-bottom: 1px solid #cdcfe6
    .rate
      margin-right: 3ch
    &:last-child
      margin-right: 0
  .score
    display: flex
    flex-direction: column
    align-items: stretch
    justify-content: flex-start
    .field-name
      flex-shrink: 0
      flex-grow: 0
    .rate
      flex-basis: 7ch
      flex-shrink: 0
      flex-grow: 0
    .slider
      display: flex
      flex-direction: row
      align-items: center
      justify-content: flex-start
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
