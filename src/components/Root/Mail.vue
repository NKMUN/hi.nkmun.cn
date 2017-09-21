<template>
  <div class="mail-config">

    <Precondition
      :loader="configLoader"
      @loaded="configParser"
    />

    <template v-if="M">

      <h4>邀请邮件设置</h4>

      <el-form :model="M" ref="form" class="form" label-position="right" label-width="108px">

        <el-form-item label="SMTP服务器" prop="host">
          <el-input v-model="M.host" placeholder="smtp.provider.com" :disabled="busy" />
        </el-form-item>

        <el-form-item label="SMTP端口" prop="port">
          <el-input type="number" :min="0" :max="65535" v-model="M.port" :disabled="busy" />
        </el-form-item>

        <el-form-item label="发信账号" prop="account">
          <el-input v-model="M.account" placeholder="noreply@example.com" :disabled="busy" />
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="M.nickname" placeholder="昵称" :disabled="busy" />
        </el-form-item>

        <el-form-item label="账号密码" prop="account">
          <el-input v-model="M.password" placeholder="请输入发信账号密码" :disabled="busy" />
        </el-form-item>

      </el-form>

      <div class="note">
        <ul>
          <li>邮件模版需要为有效HTML文档</li>
          <li>用<code>{school}</code>表示学校</li>
          <li>用<code>{code}</code>表示邀请码</li>
          <li>用<code>{reason}</code>表示缴费审核不通过的理由</li>
        </ul>
      </div>

      <el-form :model="M" ref="form" class="form large" label-position="top">
        <el-form-item label="邀请信模版" prop="invitation">
          <el-input
            type="textarea"
            :rows="10"
            :autosize="{ minRows: 10, maxRows: 30 }"
            v-model="M.invitation"
            :disabled="busy"
          />
        </el-form-item>
      </el-form>

      <el-form :model="M" ref="form" class="form large" label-position="top">
        <el-form-item label="一轮缴费成功模版" prop="paymentSuccess">
          <el-input
            type="textarea"
            :rows="10"
            :autosize="{ minRows: 10, maxRows: 30 }"
            v-model="M.paymentSuccess"
            :disabled="busy"
          />
        </el-form-item>
      </el-form>

      <el-form :model="M" ref="form" class="form large" label-position="top">
        <el-form-item label="一轮缴费失败模版" prop="paymentFailure">
          <el-input
            type="textarea"
            :rows="10"
            :autosize="{ minRows: 10, maxRows: 30 }"
            v-model="M.paymentFailure"
            :disabled="busy"
          />
        </el-form-item>
      </el-form>

      <el-form :model="M" ref="form" class="form large" label-position="top">
        <el-form-item label="二轮缴费成功模版" prop="paymentSuccess2">
          <el-input
            type="textarea"
            :rows="10"
            :autosize="{ minRows: 10, maxRows: 30 }"
            v-model="M.paymentSuccess2"
            :disabled="busy"
          />
        </el-form-item>
      </el-form>

      <el-form :model="M" ref="form" class="form large" label-position="top">
        <el-form-item label="二轮缴费失败模版" prop="paymentFailure2">
          <el-input
            type="textarea"
            :rows="10"
            :autosize="{ minRows: 10, maxRows: 30 }"
            v-model="M.paymentFailure2"
            :disabled="busy"
          />
        </el-form-item>
      </el-form>

      <el-button
        icon="check"
        type="primary"
        :loading="busy"
        @click="update"
      > 更新 </el-button>

    </template>

  </div>
</template>

<script>
import Precondition from '@/components/Precondition'

const DEFAULT_INVITATION_MODEL = () => ({
  host: '',
  port: 465,
  account: '',
  password: '',
  nickname: '',
  invitation: '',
  paymentSuccess: '',
  paymentFailure: '',
  paymentSuccess2: '',
  paymentFailure2: ''
})

export default {
  name: 'mail-config',
  components: {
    Precondition
  },
  data: () => ({
    busy: false,
    M: null
  }),
  methods: {
    configLoader() {
      return this.$agent.get('/api/config/mail').body()
    },
    configParser(conf) {
      this.M = { ...DEFAULT_INVITATION_MODEL(), ...conf }
    },
    async update() {
      this.busy = true
      try {
        await this.$agent.put('/api/config/mail', this.M)
        this.$notify({
          type: 'success',
          title: '邀请邮件模版已设置',
          duration: 5000
        })
      } catch(e) {
        this.$notify({
          type: 'error',
          title: '操作失败',
          message: e.message,
          duration: 0
        })
      } finally {
        this.busy = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
.mail-config
  flex-vert: flex-start center
  h4
    text-align: center
  .note
    white-space: nowrap
    color: #475669
    font-size: 14px
  .form
    width: 80%
    margin: 0 auto
    max-width: 40ch
  .form.large
    max-width: 60ch
  .el-input
    max-width: 30ch
</style>
