<template>
  <div class="application-config" v-loading="!application">

    <h4>报名表设置</h4>

    <el-form class="form" label-position="top" v-if="application">

      <el-form-item label="报名项目">
        <el-checkbox v-model="application.press">媒体团队</el-checkbox>
      </el-form-item>

      <el-form-item label="顶部说明">
        <el-input
          type="textarea"
          v-model="application.disclaimer"
          :autosize="{ minRows: 3, maxRow: 10 }"
          placeholder="必须为合法的HTML片段"
        />
      </el-form-item>

      <el-form-item v-for="(t, idx) in application.tests" :label="'学测'+(idx+1)">
        <el-input
          type="textarea"
          v-model="application.tests[idx].question"
          :autosize="{ minRows: 2, maxRow: 10 }"
          placeholder="学测题目"
        />
        <el-button
          icon="plus"
          type="success"
          :disabled="busy"
          size="mini"
          @click="application.tests.splice(idx+1, 0, { question: '' })"
        > 新增 </el-button>
        <el-button
          icon="delete"
          type="danger"
          :disabled="busy"
          size="mini"
          @click="application.tests.splice(idx, 1)"
        > 删除 </el-button>
      </el-form-item>

      <el-form-item>
        <el-button
          icon="plus"
          type="info"
          size="small"
          :disabled="busy"
          @click="application.tests.push({ question: '' })"
        > 新增学测 </el-button>
      </el-form-item>

    </el-form>

    <el-button
      icon="check"
      type="primary"
      :loading="busy"
      @click="update"
    > 更新 </el-button>
  </div>
</template>

<script>
import { Form, Input, Button, FormItem, Checkbox, Notification } from 'element-ui'
import { mapGetters } from 'vuex'

const DEFAULT_APPLICATION_CONFIG = () => ({
  press: false,
  disclaimer: '<p>特别说明 HTML</p>',
  tests: []
})

export default {
  name: 'application-config',
  components: {
    [Form.name]:     Form,
    [FormItem.name]: FormItem,
    [Input.name]:    Input,
    [Checkbox.name]: Checkbox,
    [Button.name]:   Button,
  },
  computed: {
    ... mapGetters({
      authorization: 'user/authorization',
    })
  },
  data: () => ({
    application: null,
    busy: false
  }),
  methods: {
    async fetch() {
      try{
        let {
          body
        } = await this.$agent.get('/api/config/application')
        this.application = {
          ... DEFAULT_APPLICATION_CONFIG(),
          ... body
        }
      } catch(e) {
        Notification({
          type: 'error',
          title: '未能获取报名设置',
          mesasge: e.message,
          duration: 0
        })
      }
    },
    async update() {
      this.busy = true
      try {
        let payload = {
          press: this.application.press,
          disclaimer: this.application.disclaimer,
          tests: this.application.tests.map( ($, idx) => ({
            id: 'q'+(idx+1),
            question: $.question
          }))
        }
        let {
          ok
        } = await this.$agent.put('/api/config/application')
                  .set( ... this.authorization )
                  .send( payload )
        Notification({
          type: 'success',
          title: '已更新报名设置',
          duration: 5000
        })
      } catch(e) {
        Notification({
          type: 'error',
          title: '更新失败',
          mesasge: e.message,
          duration: 0
        })
      } finally {
        this.busy = false
      }
    }
  },
  async mounted() {
    await this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
.application-config
  flex-vert: flex-start center
  *
    flex-shrink: 0
  .form
    max-width: 50ch
    width: 100%
</style>
