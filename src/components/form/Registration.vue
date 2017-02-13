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
      <p class="hint">用户名为<b>领队邮箱</b></p>
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
import { Button } from 'element-ui'
import ContactForm from './Contact'
import Password from './Password'

export default {
  name: 'registration-form',
  components: {
    [Button.name]: Button,
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
            username: this.leader.email,
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

<style lang="stylus" scoped>
.registration-form
  align-self: stretch
  .hint
    text-align: center
    font-size: 90%
    color: #8492A6
    b
      font-weight: normal
      text-decoration: underline
  .school
    .name
      font-size: 16px
      font-weight: bolder
      text-align: center
    .english-name
      margin-top: 1em
      font-size: 13px
      font-weight: normal
      text-align: center
      color: #8492A6
  .section
    min-width: 360px
    width: 80%
    margin: 0 auto
    padding: 2em 0
    &:not(:first-child)
      border-top: 1px solid #D3DCE6
    h4
      margin-top: 0
      text-align: center
    .form
      margin: 0 auto
      &.small
        max-width: 36ch
      &.large
        max-width: 80ch
</style>
