<template>
  <el-form
    :class="className"
    :label-width="labelWidth"
    :model="M"
    ref="form"
  >
    <el-form-item
      label="姓名"
      prop="name"
      :rules="[
        { required: true, message: '请输入姓名', trigger: 'blur'},
        { type: 'string', pattern: /^[^ ].*$/, message: '首尾包含多余空格', trigger: 'blur'},
        { type: 'string', pattern: /^.*[^ ]$/, message: '首尾包含多余空格', trigger: 'blur'}
      ]"
    >
      <el-input
        v-model="name"
        type="text"
        placeholder="姓名"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

    <el-form-item
      label="性别"
      prop="gender"
      :rules="[ { required: true, message: '请选择性别', trigger: 'blur'} ]"
    >
      <el-radio-group v-model="gender" @change="emit">
        <el-radio label="m">男</el-radio>
        <el-radio label="f">女</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item
      label="手机"
      prop="phone"
      :rules="[
        { required: true, message: '请输入手机号', trigger: 'blur'},
        { type: 'string', pattern: /^1[34578]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
      ]"
    >
      <el-input
        v-model="phone"
        type="text"
        placeholder="手机"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

    <el-form-item
      label="邮箱"
      prop="email"
      :rules="[
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email',  message: '邮箱格式不正确', trigger: 'blur' },
        { type: 'string', pattern: emailDomainRegexp, message: '请检查邮箱后缀。建议使用QQ、163、126、Outlook等常用邮箱。', trigger: 'blur' }
      ]"
    >
      <el-input
        v-model="email"
        type="text"
        placeholder="邮箱"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

  </el-form>
</template>

<script>
import { Form, FormItem, Input, Radio, RadioGroup } from 'element-ui'
export default {
  name: 'contact-form',
  components: {
    [Form.name]: Form,
    [Input.name]: Input,
    [FormItem.name]: FormItem,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup
  },
  props: {
    model: { type: Object },
    className: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    labelWidth: { type: String, default: '72px' }
  },
  data: () => ({
    emailDomainRegexp: /\.(cn|com|net|org|edu)$/i,
    name: null,
    gender: null,
    phone: null,
    email: null
  }),
  computed: {
    M() {    // model to be emitted for 'input' event
      return {
        name:   this.name,
        gender: this.gender,
        phone:  this.phone,
        email:  this.email
      }
    }
  },
  watch: {
    model(value) {
      this.name = value && value.name
      this.gender = value && value.gender
      this.phone = value && value.phone
      this.email = value && value.email
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
    reset() {
        this.$refs.form.resetFields()
        this.name = null
        this.gender = null
        this.phone = null
        this.email = null
        this.emit()
    }
  }
}
</script>
