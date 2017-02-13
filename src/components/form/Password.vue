<template>
  <el-form
    :class="className"
    :label-width="labelWidth"
    :model="M"
    ref="form"
  >
    <el-form-item
      label="密码"
      prop="password"
      :rules="passwordValidator"
    >
      <el-input
        v-model="password"
        type="password"
        placeholder="请输入密码"
        :disabled="disabled"
        @change="emit"
        :minlength="6"
        :maxlength="20"
      />
    </el-form-item>

    <el-form-item
      label="密码确认"
      prop="passwordConfirm"
      :rules="passwordConfirmValidator"
    >
      <el-input
        v-model="passwordConfirm"
        type="password"
        placeholder="请重复刚才输入的密码"
        :disabled="disabled"
        :minlength="6"
        :maxlength="20"
      />
    </el-form-item>

  </el-form>
</template>

<script>
import { Form, FormItem, Input, Radio, RadioGroup } from 'element-ui'
export default {
  name: 'password',
  components: {
    [Form.name]: Form,
    [Input.name]: Input,
    [FormItem.name]: FormItem,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup
  },
  props: {
    value: { type: String },
    className: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    labelWidth: { type: String, default: '72px' }
  },
  data() {
    return {
      password: null,
      passwordConfirm: null,
      passwordValidator: [{
        trigger: 'blur',
        validator: (r, v, cb)  => {
          if ( typeof v !== 'string' || v.length === 0 )
            return cb([ new Error('请输入密码') ])
          if (v.length < 6)
            return cb([ new Error('密码至少为6个字符') ])
          if (v.length >20)
            return cb([ new Error('密码最多为20个字符') ])
          cb([ ])
        }
      }],
      passwordConfirmValidator: [{
        trigger: 'blur',
        validator: (r, v, cb, s) => {
          if ( typeof v !== 'string' || v.length === 0 )
            return cb([ new Error('请重复上面输入的密码') ])
          if (this.password !== v)
            return cb([ new Error('两次输入的密码不一致') ])
          cb([ ])
        },
        options: {
          opts: 1
        }
      }]
    }
  },
  computed: {
    M() { return { password: this.password, passwordConfirm: this.passwordConfirm } }
  },
  methods: {
    emit(value) {
      this.$nextTick( () => {
        this.$emit('input', value)
        this.$emit('change', value)
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
      this.password = value || null
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
