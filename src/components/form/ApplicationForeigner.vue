<template>
  <div class="application-form">

    <div class="section">
      <h4>Personal Information</h4>
      <p class="hint">Personal information must match your passport (or other travel documents).</p>
      <el-form
        :model="form"
        label-position="top"
        ref="personal"
      >
         <el-form-item
          label="First Name"
          prop="first_name"
          :rules="[
            { required: true, message: 'Please input your first name', trigger: 'blur'},
            { type: 'string', pattern: /^[^ ].*$/, message: 'Name should not contain leading spaces', trigger: 'blur'},
            { type: 'string', pattern: /^.*[^ ]$/, message: 'Name should not contain trailing spaces', trigger: 'blur'}
          ]"
        >
          <el-input
            v-model="form.first_name"
            type="text"
            autocomplete="off"
            placeholder="First Name, as appeared in your passport"
            :disabled="disabled"
            @change="emit"
          />
        </el-form-item>
        <el-form-item
          label="Last Name"
          prop="last_name"
          :rules="[
            { required: true, message: 'Please input your last name', trigger: 'blur'},
            { type: 'string', pattern: /^[^ ].*$/, message: 'Name should not contain leading spaces', trigger: 'blur'},
            { type: 'string', pattern: /^.*[^ ]$/, message: 'Name should not contain trailing spaces', trigger: 'blur'}
          ]"
        >
          <el-input
            v-model="form.last_name"
            type="text"
            autocomplete="off"
            placeholder="Last name, as appeared in your passport"
            :disabled="disabled"
            @change="emit"
          />
        </el-form-item>
        <el-form-item
          label="Gender"
          prop="gender"
          :rules="[ { required: true, message: 'Please select your gender', trigger: 'change'} ]"
        >
          <el-radio-group v-model="form.gender" @change="emit" :disabled="disabled">
            <el-radio label="m">Male</el-radio>
            <el-radio label="f">Female</el-radio>
            <el-radio label="x">Other</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="Date of Birth"
          prop="birthday"
          :rules="[ { required: true, message: 'Please provide your date of birth', trigger: 'change'} ]"
        >
          <BirthdayPicker v-model="form.birthday" placeholder="Pick your birthday" />
        </el-form-item>

        <el-form-item
          label="Nationality"
          prop="nationality"
          :rules="[
            { required: true, message: 'Please input your nationality', trigger: 'blur'}
          ]"
        >
          <el-input
            v-model="form.nationality"
            type="text"
            autocomplete="off"
            placeholder="Nationality, as appeared in your passport"
            :disabled="disabled"
            @change="emit"
          />
        </el-form-item>

        <el-form-item
          label="Passport Number"
          prop="passport_number"
          :rules="[ { required: true, message: 'Please provide your passport number', trigger: 'blur'} ]"
        >
          <el-input
            v-model="form.passport_number"
            type="text"
            autocomplete="off"
            placeholder="Passport number (or other travel document)"
            :disabled="disabled"
            @change="emit"
          />
        </el-form-item>
      </el-form>
    </div>

    <div class="section">
      <h4>Application</h4>
      <el-form
        :model="form"
        label-position="top"
        ref="application"
      >
        <el-form-item
          label="University / School Name"
          prop="school"
          :rules="[
            { required: true, message: 'Please provide your school\'s full name', trigger: 'blur'},
          ]"
        >
          <el-input
            v-model="form.school"
            type="text"
            autocomplete="off"
            placeholder="School Full Name"
            :disabled="disabled"
            @change="emit"
          />
        </el-form-item>

        <el-form-item
          label="Committee Preference"
          prop="request_session"
          :rules="[ { required: true, message: 'Please choose one committee preference', trigger: 'change'} ]"
        >
          <SeatSelectForeigner
            label=""
            :sessions="sessions.filter($ => $.type === '英文')"
            v-model="form.request_session"
            :disabled="disabled"
            @change="emit"
            placeholder="Choose one preference"
            ignore-individual-limit
          />
        </el-form-item>

        <el-form-item
          label="Phone (Include Area Code)"
          prop="phone"
          :rules="[
            { required: true, message: 'Please provide your phone number', trigger: 'blur'},
          ]"
        >
          <el-input
            v-model="form.phone"
            type="text"
            autocomplete="off"
            placeholder="+1 12345678"
            :disabled="disabled"
            @change="emit"
          />
        </el-form-item>

        <el-form-item
          label="Email"
          prop="email"
          :rules="[
            { required: true, message: 'Please provide your email address', trigger: 'blur' },
            { validator: emailValidator, trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="form.email"
            type="text"
            autocomplete="off"
            placeholder="your_name@example.com"
            :disabled="disabled"
            @change="emit"
          />
        </el-form-item>

        <el-form-item
          label="Have you ever participated in Model United Nations conferences?"
          prop="past_mun_experience"
          :rules="[{ required: true, message: 'Please declare your past experience', trigger: 'blur' },]"
        >
          <el-radio-group v-model="form.past_mun_experience" @change="emit" :disabled="disabled">
            <el-radio label="y">Yes</el-radio>
            <el-radio label="n">No</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>

    <div class="section">
      <h4>Other Information</h4>
      <el-form
        :model="form"
        label-position="top"
        ref="misc"
      >
        <el-form-item
          label="Emergency Contact's Phone (Include Area Code)"
          prop="emergency_contact_phone"
          :rules="[
            { required: true, message: 'Please provide phone number of your emergency contact', trigger: 'blur'},
          ]"
        >
          <el-input
            v-model="form.emergency_contact_phone"
            type="text"
            autocomplete="off"
            placeholder="+1 12345678"
            :disabled="disabled"
            @change="emit"
          />
        </el-form-item>
        <el-form-item
          label="Dietary Requirement"
          prop="dietary_requirement"
        >
          <el-input
            v-model="form.dietary_requirement"
            type="textarea"
            autocomplete="off"
            placeholder="i.e. allergic to seafood, vegeterian"
            :autosize="{ minRows: 2, maxRows: 6 }"
            :disabled="disabled"
            @change="emit"
          />
        </el-form-item>
        <el-form-item
          label="Special Health Condition"
          prop="health_condition"
        >
          <el-input
            v-model="form.health_condition"
            type="textarea"
            autocomplete="off"
            placeholder="i.e. chronic conditions, mobility assistance"
            :autosize="{ minRows: 2, maxRows: 6 }"
            :disabled="disabled"
            @change="emit"
          />
        </el-form-item>
        <el-form-item
          label="Comment / Remark"
          prop="comment"
        >
          <el-input
            v-model="form.comment"
            type="textarea"
            autocomplete="off"
            placeholder="Anything else we need to be aware of"
            :autosize="{ minRows: 2, maxRows: 6 }"
            :disabled="disabled"
            @change="emit"
          />
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import SeatSelectForeigner from './SeatSelectForeigner'
import { mapGetters } from 'vuex'
import emailValidator from '@/lib/email-validator-i18n'
import BirthdayPicker from '../form/BirthdayPicker'
import Vue from 'vue'

export default {
  name: 'foreigner-application-form',
  components: {
    SeatSelectForeigner,
    BirthdayPicker,
  },
  computed: {
    ...mapGetters({
      sessions: 'config/sessions'
    }),
    emailValidator() {
      return emailValidator
    },
    referrer() {
      return this.$route.query.ref || ''
    }
  },
  props: {
    value: { type: Object },
    disabled: { type: Boolean, default: false }
  },
  data: () => ({
    form: {
      first_name: null,
      last_name: null,
      gender: null,
      school: null,
      nationality: null,
      birthday: null,
      email: null,
      phone: null,
      passport_number: null,
      request_session: null,
      dietary_requirement: null,
      health_condition: null,
      past_mun_experience: null,
      emergency_contact_phone: null,
      comment: null,
    },
  }),
  methods: {
    emit() {
      this.$nextTick( () => {
        const payload = {
          type: 'foreigner-individual',
          identifier: (
            this.form.last_name && this.form.first_name
              ? '国际个人 - ' + this.form.last_name + ' ' + this.form.first_name
              : '国际个人 - '
          ),
          referrer: this.referrer,
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
          this.$refs.personal,
          this.$refs.application,
          this.$refs.misc
        ].map(ref => ref.validate().then(success => true, err => false))
      )
      .then(results => results.reduce((s, v) => s && v))
    },
    setValue(value) {
      this.form = {
        first_name: this.value && this.value.first_name || null,
        last_name: this.value && this.value.last_name || null,
        gender: this.value && this.value.gender || null,
        school: this.value && this.value.school || null,
        nationality: this.value && this.value.nationality || null,
        birthday: this.value && this.value.birthday || null,
        email: this.value && this.value.email || null,
        phone: this.value && this.value.phone || null,
        passport_number: this.value && this.value.passport_number || null,
        request_session: this.value && this.value.request_session || null,
        dietary_requirement: this.value && this.value.dietary_requirement || null,
        health_condition: this.value && this.value.health_condition || null,
        past_mun_experience: this.value && this.value.past_mun_experience || null,
        emergency_contact_phone: this.value && this.value.emergency_contact_phone || null,
        comment: this.value && this.value.comment || null,
      }
    },
  },
  watch: {
    value(value) {
      this.setValue(value)
    }
  },
  created() {
    this.setValue(this.value)
    Vue.config.lang = 'en'
    document.title = 'Hi! NKMUN'
  },
  beforeDestroy() {
    Vue.config.lang = 'zh-cn'
  }
}
</script>

<style lang="stylus" scoped>
.application-form
  align-self: stretch
  .hint
    font-size: 80%
    max-width: 80ch
    margin: 1em auto
  .section
    min-width: 240px
    max-width: 400px
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
>>> .el-form-item__label
  padding-bottom: 0
  line-height: 24px
</style>
