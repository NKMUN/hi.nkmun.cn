<template>
  <el-dialog
    ref="dialog"
    @close="handleClose"
    title="重置密码"
    custom-class="password-reset"
  >

    <div class="warning">
      <i class="icon el-icon-warning"></i>
      <div class="message">重置 {{ user.id }} 的密码</div>
    </div>

    <Password
      v-model="password"
      ref="password"
      class="form small"
    />

    <div slot="footer">
      <el-button
        type="primary"
        @click="handleClose"
      > 取消 </el-button>
      <el-button
        type="warning"
        @click="confirmReset"
      > 确定 </el-button>
    </div>

  </el-dialog>
</template>

<script>
import Password from '../../form/Password'

export default {
  name: 'password-dialog',
  components: {
    Password
  },
  data: () => ({
    user: {},
    password: ''
  }),
  methods: {
    async open(user) {
      this.user = user
      this.password = ''
      this.$refs.dialog.open()
      this.$nextTick( () => {
        this.$refs.password.$el.querySelector('input').focus()
        this.$refs.password.clear()
      })
      let result = await new Promise( r => this.resolve = r )
      this.$refs.dialog.close()
      return result
    },
    async confirmReset() {
      if ( ! await this.$refs.password.validate() )
        return
      this.resolve({ user: this.user.id, password: this.password })
    },
    handleClose() {
      if (this.resolve) {
        this.resolve(null)
        this.resolve = null
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../../../style/flex"
.warning
  flex-horz: flex-start center
  margin: 1em 0
  .icon
    font-size: 4em
    color: #FF4949
    background-color: transparent
    margin: 0 .25em
.form.small
  max-width: 36ch
.layout.right
  text-align: right
</style>

<style lang="stylus">
.el-dialog.password-reset
  max-width: 480px
  min-width: 360px
</style>
