<template>
  <div class="representative-form">

    <section>
      <h4>代表信息</h4>

      <form class="el-form form small">
        <div class="el-form-item">
          <label for="name" class="el-form-item__label" :style="{width: labelWidth}">会场</label>
          <div class="el-form-item__content" :style="{marginLeft: labelWidth, padding: '0 10px'}">
            {{SESSION(session).type}} <span class="delimiter">/</span> {{ SESSION(session).name }}
          </div>
        </div>
      </form>

      <ContactForm
        ref="contact"
        v-model="contact"
        class="form small"
        :label-width="labelWidth"
        :disabled="disabled"
        @change="emit"
      />

      <el-form
        class="form small"
        :label-width="labelWidth"
      >
        <el-form-item label="">
          <el-checkbox
            v-model="is_leader"
            @input="emit"
            :disabled="!leaderEditable"
          > 该代表是领队 </el-checkbox>
        </el-form-item>
      </el-form>

      <GraduationForm
        v-if="!isAdult"
        ref="graduation"
        v-model="graduation_year"
        class="form small"
        :label-width="labelWidth"
        :disabled="disabled"
        @change="emit"
      />

      <IdentificationForm
        ref="identification"
        v-model="identification"
        class="form small"
        :label-width="labelWidth"
        :disabled="disabled"
        @change="emit"
      />

    </section>

    <section v-if="!isAdult">
      <h4>监护人</h4>
      <GuardianForm
        ref="guardian"
        v-model="guardian"
        class="form small"
        :label-width="labelWidth"
        :disabled="disabled"
        @change="emit"
      />
      <IdentificationForm
        ref="guardian-identification"
        v-model="guardianIdentification"
        class="form small"
        :label-width="labelWidth"
        :disabled="disabled"
        @change="emit"
      />
    </section>

    <section>
      <h4>其他</h4>
      <el-form
        class="form large"
        :label-width="labelWidth"
      >
        <el-form-item label="备注">
          <el-input :disabled="disabled">
        </el-form-item>
      </el-form>
    </section>

  </div>
</template>

<script>
import ContactForm from './Contact'
import GraduationForm from './Graduation'
import IdentificationForm from './Identification'
import GuardianForm from './Guardian'
import SessionUtils from '../../lib/session-utils'

export default {
  name: 'registration-form',
  components: {
    ContactForm,
    GraduationForm,
    IdentificationForm,
    GuardianForm,
  },
  mixins: [
    SessionUtils
  ],
  props: {
    value: { type: Object },
    disabled: { type: Boolean, default: false },
    session: { type: String, default: '' },
    leaderEditable: { type: Boolean, default: true },
    isAdult: { type: Boolean, default: false },
  },
  computed: {
    forms() {
      return [
        'contact',
        'identification',
        ... (
            ! this.isAdult
          ? ['graduation', 'guardian', 'guardian-identification']
          : []
        )
      ]
    }
  },
  data: () => ({
    labelWidth: '108px',
    contact: null,
    graduation_year: null,
    identification: null,
    guardian: null,
    guardianIdentification: null,
    is_leader: null,

  }),
  methods: {
    emit() {
      this.$nextTick( () => {
        let M = {
          contact: this.contact,
          graduation_year: this.graduation_year,
          identification: this.identification,
          is_leader: this.is_leader,
          guardian: this.guardian,
          guardianIdentification: this.guardianIdentification,
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
      this.contact = (value && value.contact) || {}
      this.graduation_year = (value && value.graduation_year) || null
      this.identification = (value && value.identification) || {}
      this.guardian = (value && value.guardian) || {}
      this.guardianIdentification = (value && value.guardianIdentification) || {}
      this.is_leader = value && value.is_leader
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
.representative-form
  align-self: stretch
  h4
    text-align: center
  .form
    margin: 0 auto
    &.small
      max-width: 36ch
    &.large
      max-width: 64ch
  .delimiter
    color: #99A9BF
    font-size: 80%
</style>
