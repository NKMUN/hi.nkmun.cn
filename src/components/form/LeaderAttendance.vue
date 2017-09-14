<template>
  <el-form :class="className" label-position="top">
    <el-form-item label="领队由代表、指导教师或主席兼任：">
      <!--
        use el-radio to avoid a possible edge case in el-select
        this problem can not be reliably reproduced!
      -->
      <el-radio-group :value="eleValue" @change="emit" @input="emit" :disabled="disabled">
        <el-radio label="yes">是</el-radio>
        <el-radio label="no">否</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
import Precondition from '@/components/Precondition'

export default {
  name: 'leader-attendance',
  props: {
    value: { type: Boolean },
    disabled: { type: Boolean, default: false },
    className: { type: String, default: '' },
  },
  computed: {
    eleValue() {
      if (this.value === true) return 'yes'
      if (this.value === false) return 'no'
      return null
    }
  },
  methods: {
    emit(val) {
      let emitted = null
      if (val === 'yes') emitted = true
      if (val === 'no') emitted = false
      this.$nextTick( () => {
        this.$emit('input', emitted)
        this.$emit('change', emitted)
      })
    },
  },
}
</script>
