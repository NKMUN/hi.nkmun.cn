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
export default {
  name: 'password',
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
          const password = this.password
          if ( typeof password !== 'string' || password.length === 0 )
            return cb([ new Error('请输入密码') ])
          if (password.length < 6)
            return cb([ new Error('密码至少为6个字符') ])
          if (password.length >20)
            return cb([ new Error('密码最多为20个字符') ])
          cb([ ])
        }
      }],
      passwordConfirmValidator: [{
        trigger: 'blur',
        validator: (r, v, cb, s) => {
          const password = this.password
          const passwordConfirm = this.passwordConfirm
          if ( typeof passwordConfirm !== 'string' || passwordConfirm.length === 0 )
            return cb([ new Error('请重复上面输入的密码') ])
          if (this.password !== passwordConfirm)
            return cb([ new Error('两次输入的密码不一致') ])
          cb([ ])
        }
      }]
    }
  },
  computed: {
    M() {
      return {
        password: this.password,
        passwordConfirm: this.passwordConfirm
      }
    }
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
    clear() {
      this.passwordConfirm = null
      this.setValue(null)
    },
    validate() {
      return new Promise( resolve => {
        this.$refs.form.validate( resolve )
      })
    },
    setValue(value) {
      this.password = value || null
      if (this.$refs.form)
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
