<template>
  <div class="registration-form">

    <div class="section">
      <h4>个人信息</h4>
      <ContactForm
        :value="contact"
        disabled
        class="form small"
        @change="emit"
      />
    </div>

    <div class="section">
      <h4>登录凭证</h4>
      <p class="hint">请使用 <b>您的邮箱</b> 和 <b>密码</b> 登陆</p>
      <Password
        ref="password"
        v-model="password"
        :disabled="disabled"
        class="form small"
        @change="emit"
      />
    </div>
  </div>
</template>

<script>
import ContactForm from './Contact'
import Password from './Password'

export default {
  name: 'registration-form',
  components: {
    ContactForm,
    Password
  },
  props: {
    value: { type: Object },
    disabled: { type: Boolean, default: false },
    identifier: { type: String, default: '' },
    contact: {},
  },
  data: () => ({
    password: null
  }),
  methods: {
    emit() {
      this.$nextTick( () => {
        let M = {
          leader: this.contact,
          login: {
            user: this.contact.email,
            password: this.password
          }
        }
        this.$emit('input', M)
        this.$emit('change', M)
      })
    },
    reset() {
      this.setValue(null)
      this.emit()
    },
    validate() {
      return this.$refs.password.validate().then(
        success => true,
        err => false
      )
    },
    setValue(value) {
      this.password = (value && value.login && value.login.password) || null
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
