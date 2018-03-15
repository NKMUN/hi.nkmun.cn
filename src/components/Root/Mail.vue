<template>
  <div class="mail-config">

    <Precondition
      :loader="configLoader"
      @loaded="configParser"
    />

    <template v-if="M">

      <h4>邀请邮件设置</h4>

      <el-form :model="M" ref="form" class="form" label-position="right" label-width="108px">

        <div :class="{
          'disabled-mask': true,
          'active': !isInternalMailer
        }">
          <div class="mask"></div>

          <div class="text">
            <p>使用外部邮件配置：{{ mailer }}</p>
          </div>

          <div class="content">
            <el-form-item label="SMTP服务器" prop="host">
              <el-input :disabled="busy || !isInternalMailer" v-model="M.host" placeholder="smtp.provider.com" />
            </el-form-item>

            <el-form-item label="SMTP端口" prop="port">
              <el-input :disabled="busy || !isInternalMailer" type="number" :min="0" :max="65535" v-model="M.port" />
            </el-form-item>

            <el-form-item label="发信账号" prop="account">
              <el-input :disabled="busy || !isInternalMailer" v-model="M.account" placeholder="noreply@example.com" />
            </el-form-item>

            <el-form-item label="账号密码" prop="account">
              <el-input :disabled="busy || !isInternalMailer" v-model="M.password" placeholder="请输入发信账号密码" />
            </el-form-item>
          </div>

        </div>

        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="M.nickname" placeholder="昵称" :disabled="busy" />
        </el-form-item>
      </el-form>

      <el-button
        type="primary"
        @click="sendTestEmail"
      > 发送测试邮件 </el-button>

      <div class="note">
        <ul>
          <li>邮件模版需要为有效HTML文档</li>
          <li><code>{school}</code> 表示学校</li>
          <li><code>{name}</code> 表示联系人/申请人姓名</li>
          <li><code>{code}</code> 表示邀请码</li>
          <li><code>{reason}</code> 表示缴费审核不通过的理由</li>
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

        <el-form-item label="一轮缴费成功模版" prop="paymentSuccess">
          <el-input
            type="textarea"
            :rows="10"
            :autosize="{ minRows: 10, maxRows: 30 }"
            v-model="M.paymentSuccess"
            :disabled="busy"
          />
        </el-form-item>

        <el-form-item label="一轮缴费失败模版" prop="paymentFailure">
          <el-input
            type="textarea"
            :rows="10"
            :autosize="{ minRows: 10, maxRows: 30 }"
            v-model="M.paymentFailure"
            :disabled="busy"
          />
        </el-form-item>

        <el-form-item label="追加缴费成功模版" prop="paymentSuccess2">
          <el-input
            type="textarea"
            :rows="10"
            :autosize="{ minRows: 10, maxRows: 30 }"
            v-model="M.paymentSuccess2"
            :disabled="busy"
          />
        </el-form-item>

        <el-form-item label="追加缴费失败模版" prop="paymentFailure2">
          <el-input
            type="textarea"
            :rows="10"
            :autosize="{ minRows: 10, maxRows: 30 }"
            v-model="M.paymentFailure2"
            :disabled="busy"
          />
        </el-form-item>

        <el-form-item label="学术团队申请：录取" prop="academic_staff_admit">
          <el-input
            type="textarea"
            :rows="10"
            :autosize="{ minRows: 10, maxRows: 30 }"
            v-model="M.academic_staff_admit"
            :disabled="busy"
          />
        </el-form-item>

        <el-form-item label="学术团队申请：Waitlist" prop="academic_staff_waitlist">
          <el-input
            type="textarea"
            :rows="10"
            :autosize="{ minRows: 10, maxRows: 30 }"
            v-model="M.academic_staff_waitlist"
            :disabled="busy"
          />
        </el-form-item>

        <el-form-item label="学术团队申请：拒绝" prop="academic_staff_refuse">
          <el-input
            type="textarea"
            :rows="10"
            :autosize="{ minRows: 10, maxRows: 30 }"
            v-model="M.academic_staff_refuse"
            :disabled="busy"
          />
        </el-form-item>
      </el-form>

      <el-button
        icon="el-icon-check"
        type="primary"
        :loading="busy"
        @click="update"
      > 更新 </el-button>

    </template>

  </div>
</template>

<script>
import Precondition from '@/components/Precondition'

const DEFAULT_MAIL_MODEL = () => ({
  host: '',
  port: 465,
  account: '',
  password: '',
  nickname: '',
  invitation: '',
  paymentSuccess: '',
  paymentFailure: '',
  paymentSuccess2: '',
  paymentFailure2: '',
  academic_staff_admit: '',
  academic_staff_waitlist: '',
  academic_staff_refuse: ''
})

import { mapGetters } from 'vuex'

export default {
  name: 'mail-config',
  computed: {
    ... mapGetters({
      mailer: 'config/mailer'
    }),
    isInternalMailer() {
      return this.mailer === 'internal'
    }
  },
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
      this.M = { ...DEFAULT_MAIL_MODEL(), ...conf }
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
    },
    async sendTestEmail() {
      await this.$prompt('请输入邮箱', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '邮箱格式不正确'
      })
      .then(
        async ({ value }) => {
          try {
            await this.$agent.post('/api/config/mail/')
              .query({ action: 'test' })
              .send({ args: value })
            this.$notify({
              type: 'success',
              title: '已发送邮件',
              duration: 5000
            })
          } catch(e) {
            this.$notify({
              type: 'error',
              title: '操作失败',
              message: e.message,
              duration: 0
            })
          }
        },
        () => null  // do nothing is user cancels input
      )
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../style/flex"
.mail-config
  flex-vert: flex-start center
  padding-bottom: 2em
  overflow: auto
  h4
    text-align: center
  .note
    margin: 1em 0
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
  .disabled-mask
    position: relative
    // match element's form-item
    padding: 23px 23px 1px 23px
    margin-bottom: 22px
    .mask
      display: none
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background-color: #c0ccda
      opacity: .2
      z-index: 98
    .text
      display: none
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      z-index: 99
    &.active
      .mask, .text
        display: block
      .content
        filter: blur(4px)
</style>
