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
        autocomplete="off"
        placeholder="姓名"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

    <el-form-item
      label="性别"
      prop="gender"
      :rules="[ { required: true, message: '请选择性别', trigger: 'change'} ]"
    >
      <el-radio-group v-model="gender" @change="emit" :disabled="disabled">
        <el-radio label="m">男</el-radio>
        <el-radio label="f">女</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item
      label="手机"
      prop="phone"
      :rules="[
        { required: true, message: '请输入手机号', trigger: 'blur'},
        { type: 'string', pattern: /^(1[3456789]\d{9}|\+\d{11,})$/, message: '手机号格式不正确', trigger: 'blur' }
      ]"
    >
      <el-input
        v-model="phone"
        type="text"
        autocomplete="off"
        placeholder="手机号"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

    <el-form-item
      label="邮箱"
      prop="email"
      :rules="[
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: emailValidator, trigger: 'blur' }
      ]"
    >
      <el-input
        v-model="email"
        type="text"
        autocomplete="off"
        placeholder="邮箱"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

    <el-form-item v-if="showQq"
      label="QQ"
      prop="qq"
      :rules="[
        { required: true, message: '请输入QQ号', trigger: 'blur' },
        { type: 'string', pattern: qqRegex, message: 'QQ号格式不正确', trigger: 'blur' },
      ]"
    >
      <el-input
        v-model="qq"
        type="text"
        autocomplete="off"
        placeholder="QQ号"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

  </el-form>
</template>

<script>
import emailValidator from '@/lib/email-validator'

const qqRegex = /^[0-9]{6,15}$/
export default {
  name: 'contact-form',
  props: {
    value: { type: Object },
    className: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    labelWidth: { type: String, default: '72px' },
    showQq: { type: Boolean, default: false },
  },
  data: () => ({
    qqRegex,
    name: null,
    gender: null,
    phone: null,
    email: null,
    qq: null,
  }),
  computed: {
    M() {    // model to be emitted for 'input' event
      return {
        name:   this.name,
        gender: this.gender,
        phone:  this.phone,
        email:  this.email,
        ... (this.showQq ? { qq: this.qq } : {})
      }
    },
    emailValidator() {
      return emailValidator
    }
  },
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
      this.setValue(null)
      this.emit()
    },
    setValue(value) {
      this.name = (value && value.name) || null
      this.gender = (value && value.gender) || null
      this.phone = (value && value.phone) || null
      this.email = (value && value.email) || null
      this.qq = (value && value.qq) || null
      if (this.$refs.form && !value)
        this.$refs.form.resetFields()
    },
    clearValidate() {
      this.$refs.form.clearValidate()
    },
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
