<template>
  <el-dialog
    :visible="visible"
    :before-close="handleClose"
    title="操作确认"
    custom-class="serious-confirm"
    @open="setFocus"
  >

    <div class="warning">
      <i class="icon el-icon-warning"/>
      <div class="message">{{ message }}</div>
    </div>

    <div>
      <pre class="random">{{ repeat }}</pre>
    </div>

    <el-input
      class="serious-confirm-input"
      v-model="input"
      @keydown.enter.native="handleEnter"
      :placeholder="repeat"
      :autofocus="true"
      ref="input"
    >
      <template slot="prepend">重复上面的字符串：</template>
      <el-button
        slot="append"
        icon="el-icon-check"
        :disabled="input !== repeat"
        @click="handleConfirm"
      ></el-button>
    </el-input>

  </el-dialog>
</template>

<script>
export default {
  name: 'serious-confirm',
  data: () => ({
    input: '',
    resolve: null
  }),
  props: {
    message: String,
    type: String,
    repeat: String
  },
  computed: {
    visible() {
      return Boolean(this.resolve)
    }
  },
  methods: {
    handleClose() {
      if (this.resolve) {
        this.resolve(false)
        this.resolve = null
      }
    },
    handleEnter(){
      if (this.resolve && this.repeat === this.input) {
        this.resolve(true)
        this.resolve = null
      }
    },
    handleConfirm() {
      if (this.resolve && this.repeat === this.input) {
        this.resolve(true)
        this.resolve = null
      }
    },
    setFocus() {
      this.$nextTick(() => {
        this.$refs.input.$el.querySelector('input').focus()
      })
    },
    open() {
      return new Promise(r => this.resolve = r)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../style/flex"
.hint
  font-size: 12px
  color: #475669
.warning
  flex-horz: flex-start center
  margin: 1em 0
  .icon
    font-size: 4em
    color: #FF4949
    background-color: transparent
    margin: 0 .25em
.random
  padding: .5em 0
  font-size: 16px
  font-family: monospace
  border: 1px solid #bfcbd9
  border-radius: 4px
  text-align: center
</style>

<style lang="stylus">
// do not use `scoped`, input belongs to el-input scope
.serious-confirm-input
  input
    font-family: monospace
    font-size: 16px
.el-dialog.serious-confirm
  max-width: 480px
  .message
    white-space: pre
</style>
