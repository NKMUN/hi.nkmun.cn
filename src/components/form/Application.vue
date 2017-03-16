<template>
  <div class="application-form">
    <div class="section">
      <h4>学校</h4>
      <SchoolForm
        ref="school"
        v-model="school"
        :disabled="disabled"
        class="form small"
        @change="emit"
      />
    </div>

    <div class="section">
      <h4>第一联系人</h4>
      <ContactForm
        ref="contact"
        v-model="contact"
        :disabled="disabled"
        class="form small"
        @change="emit"
      />
    </div>

    <div class="section">
      <h4>第二联系人</h4>
      <ContactForm
        ref="altContact"
        v-model="altContact"
        :disabled="disabled"
        class="form small"
        @change="emit"
      />
    </div>

    <div class="section">
      <h4>名额申请</h4>
      <RequestForm
        ref="request"
        v-model="request"
        :disabled="disabled"
        :showPress="press"
        class="form small"
        @change="emit"
      />
    </div>

    <div class="section ac-test">
      <h4>学术水平测试</h4>
      <AcademicTestForm
        ref="acTest"
        v-model="acTest"
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
import SchoolForm from './School'
import RequestForm from './Request'
import AcademicTestForm from './AcademicTest'

const MAX_NUM_OF_SEATS = 10

export default {
  name: 'application-form',
  components: {
    ContactForm,
    SchoolForm,
    RequestForm,
    AcademicTestForm
  },
  props: {
    value: { type: Object },
    press: { type: Boolean, default: true },
    tests: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false }
  },
  data: () => ({
    MAX_SEATS: 10,
    school: {},
    contact: {},
    altContact: {},
    request: {},
    acTest: {},
    forms: ['school', 'contact', 'altContact', 'request', 'acTest']
  }),
  methods: {
    emit() {
      this.$nextTick( () => {
        let M = {
          school: this.school,
          contact: this.contact,
          altContact: this.altContact,
          request: this.request,
          acTest: this.acTest
        }
        this.$emit('input', M)
        this.$emit('change', M)
      })
    },
    reset() {
      this.setValue(null)
      this.emit()
    },
    async validate() {
      let results = await Promise.all( this.forms.map( ref => this.$refs[ref].validate() ) )
      return results.reduce( (a, v) => a && v )
    },
    setValue(value) {
      this.school = (value && value.school) || {}
      this.contact = (value && value.contact) || {}
      this.altContact = (value && value.altContact) || {}
      this.request = (value && value.request) || {}
      this.acTest = (value && value.acTest) || {}
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
</style>
