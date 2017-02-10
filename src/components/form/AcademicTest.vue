<template>
  <el-form
    :class="className"
    :model="M"
    ref="form"
  >
    <el-form-item
      v-for="test in tests"
      :label="test.question"
      :prop="test.id"
      :rules="[ { required: true, message: '请输入回答', trigger: 'blur'} ]"
    >
      <el-input
        v-model="M[test.id]"
        type="textarea"
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
import { Form, FormItem, Input } from 'element-ui'
export default {
  name: 'academic-test-form',
  components: {
    [Form.name]: Form,
    [Input.name]: Input,
    [FormItem.name]: FormItem,
  },
  props: {
    model: { type: Object },
    className: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    labelWidth: { type: String, default: '72px' },
    tests: { type: Array, default: [] }
  },
  data: () => ({
    questions: [],
    M: {}
  }),
  watch: {
    model(value) {
      if (value instanceof Object)
        for (let key in this.M)
          this.M[key] = value[key] || null
    },
    tests(value) {
      // create form model
      this.M = value.reduce((o, {id}) => ({ ...o, [id]: '' }), {})
      this.resetModel()
    }
  },
  methods: {
    emit() {
      this.$emit('input', this.M)
      this.$emit('change', this.M)
    },
    validate() {
      return new Promise( resolve => {
        this.$refs.form.validate( resolve )
      })
    },
    resetModel() {
      for (let key in this.M)
        this.M[key] = null
    },
    reset() {
      this.$refs.form.resetFields()
      this.resetModel()
      this.emit()
    }
  }
}
</script>
