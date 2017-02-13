<template>
  <el-form
    :class="className"
    :label-width="labelWidth"
    :model="M"
    ref="form"
  >
    <el-form-item
      label="邀请码"
      prop="invitation"
      :rules="[
        { required: true, message: '请输入邀请码', trigger: 'blur'},
        { type: 'string', pattern: /^[a-zA-Z0-9]+$/, message: '邀请码格式不正确', trigger: 'blur' },
      ]"
    >
      <el-input
        v-model="invitation"
        type="text"
        placeholder="请输入邀请码"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

  </el-form>
</template>

<script>
import { Form, FormItem, Input } from 'element-ui'
export default {
  name: 'invitation-code',
  components: {
    [Form.name]: Form,
    [Input.name]: Input,
    [FormItem.name]: FormItem,
  },
  props: {
    value: { type: String },
    className: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    labelWidth: { type: String, default: '72px' }
  },
  data: () => ({
    invitation: null
  }),
  computed: {
    M() { return { invitation: this.invitation } }
  },
  methods: {
    emit() {
      this.$nextTick( () => {
        this.$emit('input', this.M.invitation)
        this.$emit('change', this.M.invitation)
      })
    },
    reset() {
      this.setValue(null)
      this.emit()
    },
    validate() {
      return new Promise( resolve => {
        this.$refs.form.validate( resolve )
      })
    },
    setValue(value) {
      this.invitation = value || null
      if (this.$mounted)
        this.$refs.form.resetFields()
    }
  },
  watch: {
    value(value) {
      this.setValue(value)
    }
  },
  created() {
    this.setValue(this.value)
  }
}
</script>
