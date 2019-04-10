<template>
  <el-form
    :class="className"
    :model="M"
    label-position="top"
    ref="form"
  >
    <el-form-item
      v-for="(test, index) in tests"
      :key="index"
      :label="test.question"
      :prop="test.id"
      :rules="[ { required: true, message: '请输入回答', trigger: 'blur'} ]"
    >
      <el-input
        v-model="M[test.id]"
        type="textarea"
        autocomplete="off"
        resize="vertical"
        :autosize="{ minRows: 8, maxRows: 24 }"
        :maxlength="10000"
        placeholder="请输入回答，不要超过10000个字符"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  name: 'academic-test-form',
  props: {
    value: { type: Object },
    className: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    labelWidth: { type: String, default: '72px' },
    tests: { type: Array, default: () => [] }
  },
  data: () => ({
    M: {}
  }),
  methods: {
    emit() {
      this.$nextTick( () => {
        this.$emit('input', this.M)
        this.$emit('change', this.M)
      })
    },
    validate() {
      return new Promise( resolve => {
        this.$refs.form.validate( resolve )
      })
    },
    reset() {
      this.$refs.form.resetFields()
      for (let key in this.M)
        this.M[key] = null
      this.emit()
    },
    setValue(value) {
      this.M = this.tests.reduce((o, {id}) => ({
        ...o,
        [id]: (value && value[id]) || null
      }), {})
      if (this.$refs.form && !value)
        this.$refs.form.resetFields()
    }
  },
  watch: {
    value(value) {
      this.setValue(value, this.tests)
    }
  },
  created() {
    this.setValue(this.value, this.tests)
  },
}
</script>

<style lang="stylus" scoped>
.el-form-item__label
  white-space: pre-line
</style>
