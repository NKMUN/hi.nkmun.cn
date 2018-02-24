<template>
  <div class="unified-registration">

    <el-form :model="formData" ref="form" label-position="right" label-width="12ch">
      <el-form-item
        label="邮箱"
        prop="email"
        :rules="[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: emailValidator, trigger: 'blur' },
          { validator: userExistValidator, trigger: 'blur' }
        ]"
      >
        <el-input v-model="email" type="text" :disabled="busy" placeholder="请输入邮箱" />
      </el-form-item>

      <el-form-item
        label="密码"
        prop="password"
        :rules="{ required: true, validator: passwordValidator, trigger: 'blur' }"
      >
        <el-input v-model="password" type="password" :disabled="busy" placeholder="请输入密码" />
      </el-form-item>

      <el-form-item
        label="密码确认"
        prop="passwordConfirm"
        :rules="{ required: true, validator: passwordConfirmValidator, trigger: 'blur' }"
      >
        <el-input v-model="passwordConfirm" type="password" :disabled="busy" placeholder="请输入密码" />
      </el-form-item>
    </el-form>

    <el-button
      type="primary"
      :loading="busy"
      icon="el-icon-upload2"
      @click="handleRegister"
    > 注册 </el-button>

  </div>
</template>

<script>
import emailValidator from '@/lib/email-validator'

export default {
  name: 'unified-registration',
  props: {
    access: { type: Array, default: () => [] },
  },
  computed: {
    formData() {
      return {
        email: this.email,
        password: this.password,
        passwordConfirm: this.passwordConfirm
      }
    },
    emailValidator() {
      return emailValidator
    },
    userExistValidator() {
      return (rules, value, cbk) => {
        if (!value) return cbk([ ])
        this.$agent.head(`/api/users/${value}`).then(
          res => res.headers['x-user-exists'] ? cbk([ new Error('用户已存在') ]) : cbk([ ]),
          err => cbk([ ])
        )
      }
    },
    passwordValidator() {
      return (rules, value, cbk) => {
        if ( typeof value !== 'string' || value.length === 0 )
          return cbk([ new Error('请输入密码') ])
        if (value.length < 6)
          return cbk([ new Error('密码至少为6个字符') ])
        if (value.length >20)
          return cbk([ new Error('密码最多为20个字符') ])
        cbk([ ])
      }
    },
    passwordConfirmValidator() {
      return (rules, value, cbk) => {
        const password = this.password
        if ( typeof value !== 'string' || value.length === 0 )
          return cbk([ new Error('请重复上面输入的密码') ])
        if (this.password !== value)
          return cbk([ new Error('两次输入的密码不一致') ])
        cbk([ ])
      }
    }
  },
  data() {
    return {
      email: null,
      password: null,
      passwordConfirm: null,
      busy: false
    }
  },
  methods: {
    async handleRegister() {
      if (await this.$refs.form.validate().then(_ => true, _ => false)) {
        this.busy = true
        try {
          const {
            status,
            body
          } = await this.$agent
            .post('/api/users/')
            .ok(({status}) => status === 410 || status === 200)
            .send({
              email: this.email,
              password: this.password,
              access: this.access
            })
          if (status === 200) {
            this.$emit('success', {
              user: body.user,
              uid: body.uid,
              token: body.token,
              active: body.active
            })
            if (!this.$listeners.success) {
              this.$message({
                type: 'success',
                message: '注册成功'
              })
            }
          }
          if (status === 410) {
            return this.$msgbox({
              type: 'warning',
              title: '注册失败',
              message: '用户名已被注册'
            })
          }
        } catch(e) {
          this.$message({
            message: e.message,
            type: 'error'
          })
        } finally {
          this.busy = false
        }
      }
    }
  }
}
</script>

<style lang="stylus">
.unified-registration
  max-width: 40ch
  margin: 1em auto
  .el-button
    display: block
    margin: 0 auto
</style>
