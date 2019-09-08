<template>
  <div class="application-form">
    <div class="section">
      <h4>学校</h4>
      <SchoolForm
        ref="school"
        v-model="form.school"
        :disabled="disabled"
        class="form small"
        @change="emit"
      />
    </div>

    <div class="section">
      <h4>第一联系人</h4>
      <ContactForm
        ref="contact"
        v-model="form.contact"
        :disabled="disabled"
        class="form small"
        @change="emit"
      />
    </div>

    <div class="section">
      <h4>第二联系人</h4>
      <ContactForm
        ref="alt_contact"
        v-model="form.alt_contact"
        :disabled="disabled"
        class="form small"
        @change="emit"
      />
    </div>

    <div class="section">
      <h4>名额申请</h4>
      <SeatInput
        ref="request"
        :sessions="sessions.filter($ => $.allowsSchool)"
        v-model="form.request"
        :disabled="disabled"
        :showPress="press"
        class="form small"
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
import SchoolForm from './School'
import AcademicTestForm from './AcademicTest'
import SeatInput from '../Admin/components/SeatInput'
import { mapGetters } from 'vuex'

export default {
  name: 'school-application-form',
  components: {
    ContactForm,
    SchoolForm,
    SeatInput,
    AcademicTestForm
  },
  computed: {
    ...mapGetters({
      sessions: 'config/sessions'
    }),
  },
  props: {
    value: { type: Object },
    press: { type: Boolean, default: true },
    tests: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false }
  },
  data: () => ({
    MAX_SEATS: 10,
    form: {
      school: null,
      contact: null,
      alt_contact: null,
      request: null,
      ac_test: null
    }
  }),
  methods: {
    emit() {
      this.$nextTick( () => {
        let payload = {
          type: 'school',
          identifier: this.form.school && this.form.school.name,
          ...this.form
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
          .map(ref => ref.validate())
      )
      .then(results => results.reduce((s, v) => s && v))
    },
    setValue(value) {
      for (let key in this.form)
        this.form[key] = value && value[key]
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
