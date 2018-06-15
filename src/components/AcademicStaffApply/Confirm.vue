<template>
  <div v-loading="!config">
    <p class="hint">你已完成全部信息的填写，请签署承诺书并提交。<br/>你也可以查看并修改已填写的资料。</p>

    <h4>签署承诺书</h4>

    <div class="promise" v-html="config && config.promise"></div>

    <div class="signature-block">
      <div class="layout">
        <div class="field"><span>签名：</span><el-input v-model="signature" size="small" placeholder="签名" :disabled="busy" /></div>
        <div class="field"><span>日期：</span>{{ today }}</div>
      </div>
    </div>

    <div class="submit-block">
      <div class="layout">
        <p class="warning">提交后将不能修改申请内容</p>
        <el-progress v-show="busy" :status="progress === 100 ? 'success' : undefined" :percentage="progress" :show-text="false" />
        <el-button
          :disabled="!canSubmit"
          :type="progress === 100 ? 'success' : 'primary'"
          :icon="progress === 100 ? 'el-icon-success' : 'el-icon-upload'"
          :loading="busy"
          @click="confirm"
        >{{ progress === 100 ? '成功' : '提交' }}</el-button>
      </div>
    </div>

    <div ref="mount"></div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AcademicStaffApplyBasic from '@/components/AcademicStaffApply/Basic'
import AcademicStaffApplyRoles from '@/components/AcademicStaffApply/Roles'
import AcademicStaffApplyExperiences from '@/components/AcademicStaffApply/Experiences'
import AcademicStaffApplyAcademics from '@/components/AcademicStaffApply/Academics'
import AcademicStaffApplyExtras from '@/components/AcademicStaffApply/Extras'
import Vue from 'vue'
import { Progress } from 'element-ui'

const pages = [
  AcademicStaffApplyBasic,
  AcademicStaffApplyRoles,
  AcademicStaffApplyExperiences,
  AcademicStaffApplyAcademics,
  AcademicStaffApplyExtras
]

export default {
  components: {
    [Progress.name]: Progress
  },
  props: {
    value: {},
    finishStep: {
      type: Number
    }
  },
  computed: {
    ...mapGetters({ user: 'user/user' }),
    today() {
      const d = new Date()
      const yyyy = d.getFullYear()
      const mm = d.getMonth() + 1
      const dd = d.getDate()
      const pad2 = s => ('0' + s).slice(-2)
      return `${yyyy}-${pad2(mm)}-${pad2(dd)}`
    },
    canSubmit() {
      return this.value && this.value.name === this.signature
    },
    progress() {
      return Math.floor(this.curStep / this.totalSteps * 100)
    }
  },
  data() {
    return {
      config: null,
      busy: false,
      signature: '',
      compo: null,
      curStep: 0,
      totalSteps: pages.length + 1
    }
  },
  methods: {
    fetchConfig() {
      this.configResolve = this.$agent.get(`/api/config/academic-staff-application`).body()
        .then(
          body => this.config = body,
          _ => null
        )
    },
    async validate() {
      for (let i = 0; i !== pages.length; ++i) {
        this.curStep = i
        const Page = Vue.extend(pages[i])
        Page.prototype.$store = this.$store
        const page = new Page({ propsData: { value: this.value } }).$mount()
        const result = await page.validate()
        page.$destroy()
        if (!result) {
          this.$emit('page-validation-error', i + 1)
          return false
        }
      }
      this.curStep = pages.length
      return true
    },
    async confirm() {
      this.busy = true
      try {
        if (!await this.validate()) return

        await this.$agent
          .patch(`/api/academic-staff-applications/user/${this.user}`)
          .set('X-Timestamp', `${Date.now()}`)
          .send({
            reachedStep: this.finishStep,
            signature: this.signature,
            signature_date: this.today,
            submitted: true
          })
        this.curStep = this.totalSteps

        this.$message({
          type: 'success',
          message: '申请已提交'
        })

        // do not clear busy flag

        setTimeout(_ => {
          this.$emit('success')
        }, 3000)
      } catch(e) {
        this.busy = false
      }
    },
  },
  mounted() {
    this.fetchConfig()
  }
}
</script>

<style lang="stylus" scoped>
h4
  text-align: center
.promise
  max-width: 80ch
  margin: 1em auto 3em auto
.hint
  font-size: 90%
  color: #99A9BF
  text-align: center
.warning
  font-size: 90%
  color: #F56C6C
.signature-block, .submit-block
  max-width: 80ch
  margin: 0 auto
  text-align: right
  .el-input
    display: inline-block
    max-width: 16ch
  .layout
    display: inline-block
.signature-block
  .field
    line-height: 36px
  .layout
    text-align: left
.submit-block
  .layout
    text-align: center
.el-progress
  margin-bottom: .5em
</style>