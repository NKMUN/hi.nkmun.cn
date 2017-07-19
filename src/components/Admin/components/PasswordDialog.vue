<template>
  <el-dialog
    :visible="visible"
    :before-close="handleClose"
    title="重置密码"
    custom-class="password-reset"
  >

    <div class="warning">
      <i class="icon el-icon-warning"/>
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
  computed: {
    visible() {
      return Boolean(this.resolve)
    }
  },
  data: () => ({
    user: {},
    password: '',
    resolve: null
  }),
  methods: {
    async open(user) {
      this.user = user
      this.password = ''
      this.$nextTick( () => {
        this.$refs.password.$el.querySelector('input').focus()
        this.$refs.password.clear()
      })
      return new Promise( r => this.resolve = r )
    },
    async confirmReset() {
      if ( ! await this.$refs.password.validate() )
        return
      this.resolve({ user: this.user.id, password: this.password })
      this.resolve = null
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
