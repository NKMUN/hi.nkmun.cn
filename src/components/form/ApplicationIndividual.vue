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
      <h4>监护人</h4>
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

export default {
  name: 'individual-application-form',
  components: {
    ContactForm,
    SchoolForm,
    GuardianForm,
    GraduationForm,
    IdentificationForm,
    AcademicTestForm,
    RequestIndividual
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
    form: {
      school: null,
      contact: null,
      identification: null,
      graduation: null,
      guardian: null,
      guardian_identification: null,
      request_individual: null,
      ac_test: null
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
      return Promise.all(
        Object.keys(this.form)
          .map(key => this.$refs[key])
          .filter($ => $ && $.validate)
          .map(ref => ref.validate().then(
            success => true,
            err => false
          ))
      )
      .then(results => results.reduce((s, v) => s && v))
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
</style>
