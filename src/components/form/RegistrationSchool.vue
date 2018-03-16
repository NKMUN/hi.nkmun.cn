<template>
  <div class="registration-form">

    <div class="section school">
      <div class="name">{{ school.name }}</div>
      <div class="english-name">{{ school.englishName }}</div>
    </div>

    <div class="section">
      <h4>领队</h4>
      <ContactForm
        ref="leader"
        v-model="leader"
        :disabled="disabled"
        class="form small"
        @change="emit"
      />
    </div>

    <div class="section">
      <h4>登录凭证</h4>
      <p class="hint">请使用 <b>领队邮箱</b> 和 <b>密码</b> 登陆</p>
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
    school: { type: Object, default: () => ({}) }
  },
  data: () => ({
    leader: {},
    password: null,
    forms: ['leader', 'password']
  }),
  methods: {
    emit() {
      this.$nextTick( () => {
        let M = {
          leader: this.leader,
          login: {
            user: this.leader.email,
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
    async validate() {
      let results = await Promise.all( this.forms.map( ref => this.$refs[ref].validate() ) )
      return results.reduce( (a, v) => a && v )
    },
    setValue(value) {
      this.leader = (value && value.leader) || {}
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
