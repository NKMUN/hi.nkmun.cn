<template>
  <el-dialog
    ref="dialog"
    @close="handleClose"
    title="操作确认"
  >

    <div class="warning">
      <i class="icon el-icon-warning"></i>
      <div>{{ message }}</div>
    </div>

    <div>
      <pre class="random">{{ expect }}</pre>
    </div>

    <el-input
      class="serious-confirm-input"
      v-model="input"
      @keydown.enter.native="handleEnter"
      :placeholder="expect"
      :autofocus="true"
      ref="input"
    >
      <template slot="prepend">重复上面的字符串：</template>
      <el-button
        slot="append"
        icon="check"
        :disabled="input!==expect"
        @click="handleConfirm"
      ></el-button>
    </el-input>

  </el-dialog>
</template>

<script>
import { Dialog, Alert, Button, Input } from 'element-ui'

const CHARACTERS = 'abcdefghijklmnopqrstuvwxyz'

function randomString(length=6, characters=CHARACTERS) {
  let str = ''
  for (let i=0; i!==length; ++i)
    str += characters[Math.floor(Math.random()*characters.length)]
  return str
}

export default {
  name: 'serious-confirm',
  components: {
    [Dialog.name]: Dialog,
    [Alert.name]: Alert,
    [Button.name]: Button,
    [Input.name]: Input,
  },
  data: () => ({
    message: '',
    type: 'warning',
    input: '',
    expect: '',
  }),
  methods: {
    async confirm(message='请再次确认本操作', repeat=randomString(), type='warning') {
      this.input = ''
      this.message = message
      this.expect = repeat
      this.$refs.dialog.open()
      this.$nextTick( () => this.$refs.input.$el.querySelector('input').focus() )
      let result = await ( new Promise( r => this.resolve = r ) )
      this.$refs.dialog.close()
      return result
    },
    handleClose() {
      if (this.resolve) {
        this.resolve(false)
        this.resolve = null
      }
    },
    handleEnter(){
      if (this.resolve && this.expect === this.input) {
        this.resolve(true)
        this.resolve = null
      }
    },
    handleConfirm() {
      if (this.resolve && this.expect === this.input) {
        this.resolve(true)
        this.resolve = null
      }
    }
  },
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
</style>
