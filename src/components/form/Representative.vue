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
      <h4>第一监护人</h4>
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
        v-model="guardian_identification"
        class="form small"
        :label-width="labelWidth"
        :disabled="disabled"
        @change="emit"
      />

      <h4>第二监护人</h4>
      <GuardianForm
        ref="alt_guardian"
        v-model="alt_guardian"
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
          <el-input :disabled="disabled" v-model="comment" autocomplete="off" @change="emit" />
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
  name: 'representative-form',
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
          ? ['graduation', 'guardian', 'guardian_identification', 'alt_guardian']
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
    guardian_identification: null,
    alt_guardian: null,
    is_leader: null,
    comment: ''
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
          guardian_identification: this.guardian_identification,
          alt_guardian: this.alt_guardian,
          comment: this.comment
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
      this.guardian_identification = (value && value.guardian_identification) || {}
      this.alt_guardian = (value && value.alt_guardian) || {}
      this.is_leader = value && value.is_leader
      this.comment = value && value.comment || ''
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
