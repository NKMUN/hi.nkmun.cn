<template>
  <div class="system-config" v-loading.body="!config">
    <h3>全局设置</h3>
    <template v-if="config">
      <el-form label-position="right" class="form">
        <el-form-item>
          <el-checkbox v-model="config.apply" :disabled="busy">申请</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="config.register" :disabled="busy">注册</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="config.login" :disabled="busy">登录</el-checkbox>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        icon="circle-check"
        :loading="busy"
        @click="update"
      > 确定 </el-button>
    </template>
  </div>
</template>

<script>
import {
  Form,
  FormItem,
  Notification,
  Checkbox,
  Button
} from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  name: 'global-config',
  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Checkbox.name]: Checkbox,
    [Button.name]: Button
  },
  computed: {
    ... mapGetters({
      authorization: 'user/authorization'
    })
  },
  data: () => ({
    config: null,
    busy: false
  }),
  methods: {
    async fetch() {
      try {
        let {
          body
        } = await this.$agent.get('/api/config')
        this.config = {
          register: body.register,
          apply: body.apply,
          login: body.login
        }
      } catch(e) {
        Notification({
          type: 'error',
          title: '获取全局设置失败',
          message: e.message,
          duration: 0
        })
      }
    },
    async update() {
      this.busy = true
      try {
        let {
          body
        } = await this.$agent.put('/api/config')
                  .set( ... this.authorization )
                  .send( this.config )
        this.config = body
        this.$store.commit('config/update', body)
        Notification({
          type: 'success',
          title: '已更新',
          duration: 5000
        })
      } catch(e) {
        Notification({
          type: 'error',
          title: '更新全局设置失败',
          message: e.message,
          duration: 0
        })
      } finally {
        this.busy = false
      }
    }
  },
  mounted() {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
.system-config
  flex-vert: flex-start center
  *
    flex-shrink: 0
  .form
    white-space: nowrap
</style>
