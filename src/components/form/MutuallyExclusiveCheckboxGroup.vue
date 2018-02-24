<template>
  <div class="mutually-exclusive-checkbox-group">
    <el-checkbox
      v-for="option in options"
      :key="option.label"
      :value="isPicked(option.value)"
      @input="val => handleInput(option.value, val)"
    >{{ option.label }}</el-checkbox>
  </div>
</template>

<script>
import Checkbox from 'element-ui/lib/checkbox'

export default {
  components: {
    [Checkbox.name]: Checkbox
  },
  props: {
    value: {},
    options: {
      type: Array,
      default: () => []
    },
    optionCmp: {
      type: Function,
      default: () => (a, b) => a === b
    }
  },
  methods: {
    handleInput(option, checked) {
      const otherValues = !this.value ? [] : this.value.filter(val => !this.options.find(opt => this.optionCmp(val, opt.value)))
      const ourValues = checked ? [option] : []
      this.$emit('input', [...otherValues, ...ourValues])
      this.$emit('change', [...otherValues, ...ourValues])
    },
    isPicked(option) {
      return this.value && this.value.find(val => this.optionCmp(val, option)) !== undefined
    }
  }
}
</script>