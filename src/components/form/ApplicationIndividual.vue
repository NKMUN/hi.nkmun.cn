<template>
  <div class="application-form">

    <div class="section">
      <h4>个人信息</h4>
      <ContactForm
        ref="contact"
        v-model="form.contact"
        :disabled="disabled"
        class="form small"
        :label-width="labelWidth"
        @change="emit"
      />
      <GraduationForm
        ref="graduation"
        v-model="form.graduation"
        class="form small"
        :label-width="labelWidth"
        :disabled="disabled"
        @change="emit"
      />
      <IdentificationForm
        ref="identification"
        v-model="form.identification"
        :disabled="disabled"
        class="form small"
        :label-width="labelWidth"
        @change="emit"
      />
    </div>

    <div class="section">
      <h4>学校</h4>
      <SchoolForm
        ref="school"
        v-model="form.school"
        :disabled="disabled"
        class="form small"
        :label-width="labelWidth"
        @change="arg => { emit(arg); checkRegisteredSchool(arg && arg.name) }"
      />
      <el-alert
        v-if="schoolRegistered"
        type="warning"
        show-icon
        :closable="false"
        title="您的学校已有代表团报名参会"
        description="建议您与学校代表团一起参加，单独报名可能会影响通过。"
      />
    </div>

    <div class="section">
      <h4>第一监护人</h4>
      <GuardianForm
        ref="guardian"
        v-model="form.guardian"
        class="form small"
        :label-width="labelWidth"
        :disabled="disabled"
        @change="emit"
      />
      <IdentificationForm
        ref="guardian_identification"
        v-model="form.guardian_identification"
        class="form small"
        :label-width="labelWidth"
        :disabled="disabled"
        @change="emit"
      />

      <h4>第二监护人</h4>
      <GuardianForm
        ref="alt_guardian"
        v-model="form.alt_guardian"
        class="form small"
        :label-width="labelWidth"
        :disabled="disabled"
        @change="emit"
      />
    </div>

    <div class="section disclaimer">
      <h4>权责声明</h4>
      <p style="text-align: center; margin: 1em 0">
        <a href="https://nkmun.cn/file/NKMUNC-%E6%9D%83%E8%B4%A3%E5%A3%B0%E6%98%8E.pdf" target="_blank" download="NKMUNC-权责声明.pdf">权责声明下载</a>
      </p>
      <p style="text-align: center; margin: 1em 0">请完整打印权责声明书并与监护人详阅，在最后一页完成签字并拍照上传该页，照片要求字迹清晰。</p>
      <ImageUpload
        :class="{
          'image-upload': true,
          'is-error': disclaimerImageError
        }"
        action="/api/images/"
        v-model="form.disclaimer_image"
        @change="() => {emit(); validateDisclaimer()}"
        :disabled="disabled"
        :data="{
          meta: JSON.stringify({
            flow: 'individual-application',
            type: 'disclaimer-image'
          })
        }"
      />
      <el-alert v-if="disclaimerImageError" type="error" title="请上传权责声明签名页" :closable="false" />
    </div>

    <div class="section">
      <h4>名额申请</h4>
      <RequestIndividual
        ref="request_individual"
        v-model="form.request_individual"
        class="form small"
        :disabled="disabled"
        :showPress="press"
        @change="emit"
      />
    </div>

    <div class="section ac-test">
      <h4>学术水平测试</h4>
      <AcademicTestForm
        ref="ac_test"
        v-model="form.ac_test"
        :disabled="disabled"
        :tests="tests"
        class="form large"
        @change="emit"
      />
    </div>
  </div>
</template>

<script>
import ContactForm from './Contact'
import GraduationForm from './Graduation'
import IdentificationForm from './Identification'
import GuardianForm from './Guardian'
import SchoolForm from './School'
import AcademicTestForm from './AcademicTest'
import RequestIndividual from './RequestIndividual'
import ImageUpload from './ImageUpload'

export default {
  name: 'individual-application-form',
  components: {
    ContactForm,
    SchoolForm,
    GuardianForm,
    GraduationForm,
    IdentificationForm,
    AcademicTestForm,
    RequestIndividual,
    ImageUpload
  },
  props: {
    value: { type: Object },
    press: { type: Boolean, default: true },
    tests: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false }
  },
  data: () => ({
    labelWidth: '96px',
    schoolRegistered: null,
    disclaimerImageError: false,
    form: {
      school: null,
      contact: null,
      identification: null,
      graduation: null,
      guardian: null,
      guardian_identification: null,
      alt_guardian: null,
      request_individual: null,
      ac_test: null,
      disclaimer_image: null
    }
  }),
  methods: {
    emit() {
      this.$nextTick( () => {
        const payload = {
          type: 'individual',
          identifier: '个人 - ' + (this.form.contact && this.form.contact.name),
          ...this.form,
        }
        this.$emit('input', payload)
        this.$emit('change', payload)
      })
    },
    reset() {
      this.setValue(null)
      this.emit()
    },
    validate() {
      return Promise.all([
        ...Object.keys(this.form)
          .map(key => this.$refs[key])
          .filter($ => $ && $.validate)
          .map(ref => ref.validate().then(success => true, err => false)),
        Promise.resolve(this.validateDisclaimer())
      ])
      .then(results => results.reduce((s, v) => s && v))
    },
    validateDisclaimer() {
      return !(this.disclaimerImageError = !(this.form && this.form.disclaimer_image))
    },
    setValue(value) {
      for (let key in this.form)
        this.form[key] = value && value[key] || null
    },
    checkRegisteredSchool(school) {
      return this.$agent.get(`/api/schools/name/${school}`)
        .then(res => this.schoolRegistered = res.body)
        .catch(res => this.schoolRegistered = null)
    }
  },
  watch: {
    value(value) {
      this.setValue(value)
    }
  },
  created() {
    this.setValue(this.value)
  }
}
</script>

<style lang="stylus" scoped>
.application-form
  align-self: stretch
  .section
    min-width: 360px
    width: 80%
    margin: 0 auto
    padding: 2em 0
    &:not(:first-child)
      border-top: 1px solid #D3DCE6
    h4
      margin-top: 0
      text-align: center
    .form
      margin: 0 auto
      &.small
        max-width: 36ch
      &.large
        max-width: 80ch
    .el-alert
      width: 42ch
      margin: 0 auto
.section.disclaimer
  .el-alert
    margin: 1em auto
    width: 20ch
  .image-upload
    margin: 0 auto
</style>
