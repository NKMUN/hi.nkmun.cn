<template>
  <div class="committee-member">

    <section>
      <h4>组委信息</h4>
      <el-form
        class="form small"
        :label-width="labelWidth"
        :model="form"
        ref="formSessionAndPhoto"
      >
        <el-form-item label="职能" prop="role" :rules="[{ required: true, message: '请选择会场', trigger: 'change' }]">
          <el-select v-model="form.role" placeholder="请选择部门" @change="emit">
            <el-option-group label="组委">
              <el-option v-for="role in COMMITTEE_ROLES" :key="role.id" :value="'组委-'+role.name" :label="role.name" />
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item label="学校" prop="school" :rules="[{ required: true, message: '请填写学校', trigger: 'blur' }]">
          <el-input v-model="form.school" autocomplete="off" placeholder="请填写学校" @change="emit" />
        </el-form-item>

        <el-form-item label="照片" prop="photoId" :rules="[{ required: true, message: '请上传照片', trigger: 'change' }]">
          <AvatarUpload
            v-model="form.photoId"
            action="/api/images/"
            @change="emit"
            :data="{
              meta: JSON.stringify({
                flow: 'committee-member-registration',
                type: 'avatar',
                user: null
              })
            }"
          />
        </el-form-item>
      </el-form>

      <ContactForm
        ref="contact"
        v-model="contact"
        class="form small"
        :label-width="labelWidth"
        :disabled="disabled"
        @change="emit"
        show-qq
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

    <section>
      <h4>{{ isAdult ? '紧急联系人' : '监护人' }}</h4>
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
    </section>

    <section>
      <h4>其它</h4>

      <div class="controls">
        <el-checkbox v-model="isForeign">外地组委请勾选</el-checkbox>
      </div>

      <p class="hint red">会期外，协议酒店住宿费用： 210/人/天 或 420/间/天</p>

      <el-form
        ref="foreign"
        class="form large"
        label-width="140px"
      >
        <el-form-item label="酒店入住/退房日期">
          <el-date-picker
            v-model="hotelDate"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="入住日期"
            end-placeholder="退房日期"
            :default-value="datePickerDefaultValue"
            :picker-options="pickerOptions"
            @change="emit"
          />
        </el-form-item>
        <el-form-item label="抵宁/离宁日期" v-show="isForeign">
          <el-date-picker
            v-model="arriveDepartDate"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="抵宁日期"
            end-placeholder="离宁日期"
            :default-value="datePickerDefaultValue"
            :picker-options="pickerOptions"
            @change="emit"
          />
        </el-form-item>
      </el-form>

      <el-form
        class="form large"
        :label-width="labelWidth"
      >
        <el-form-item label="备注">
          <el-input :disabled="disabled" v-model="comment" autocomplete="off" />
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
import AvatarUpload from './AvatarUpload'
import COMMITTEE_ROLES from '../../COMMITTEE_ROLES_DEF'

export default {
  name: 'committee-member-form',
  components: {
    ContactForm,
    GraduationForm,
    IdentificationForm,
    GuardianForm,
    AvatarUpload,
  },
  props: {
    value: { type: Object },
    disabled: { type: Boolean, default: false },
    leaderEditable: { type: Boolean, default: true },
  },
  computed: {
    forms() {
      return [
        'contact',
        'identification',
        'guardian',
        'guardian-identification'
      ]
    },
    isAdult() {
      const idNumber = (this.value && this.value.identification && this.value.identification.number) || ''
      const birthdayStr = idNumber.slice(6, 14)
      if (birthdayStr.length === 8) {
        const YYYY = birthdayStr.slice(0, 4)
        const MM = birthdayStr.slice(4, 6)
        const DD = birthdayStr.slice(6, 8)
        const birthday = new Date(YYYY, MM, DD)
        const today = new Date()
        return today - birthday >= 18 * 365 * 24 * 60 * 60 * 1000    // ignore leap year
      } else {
        return null
      }
    },
    datePickerDefaultValue() {
      return this.$store.getters['config/conferenceStartDate']
    },
    pickerOptions() {
      return {
        disabledDate(v) {
          return v < new Date() -  24*60*60*1000
        }
      }
    },
    photoUrl() {
      return this.photoId ? `/api/images/${this.photoId}?size=small&format=jpg` : ''
    }
  },
  data: () => ({
    labelWidth: '108px',
    form: {
      role: null,
      school: null,
      photoId: null,
    },
    contact: null,
    identification: null,
    guardian: null,
    guardian_identification: null,
    isForeign: false,
    arriveDepartDate: null,
    hotelDate: null,
    comment: '',
    COMMITTEE_ROLES,
  }),
  methods: {
    emit() {
      this.$nextTick( () => {
        let M = {
          ...this.form,
          contact: this.contact,
          identification: this.identification,
          guardian: this.guardian,
          guardian_identification: this.guardian_identification,
          comment: this.comment,
          checkInDate: this.hotelDate ? this.hotelDate[0] : null,
          checkOutDate: this.hotelDate ? this.hotelDate[1] : null,
          ...(this.isForeign ? {
            arriveDate: this.arriveDepartDate ? this.arriveDepartDate[0] : null,
            departDate: this.arriveDepartDate ? this.arriveDepartDate[1] : null
          } : {})
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
      let results = await Promise.all([
        ... this.forms.map( ref => this.$refs[ref].validate() ),
        new Promise(r => this.$refs.formSessionAndPhoto.validate(r) )
      ])
      return results.reduce( (a, v) => a && v )
    },
    setValue(value) {
      this.form.role = (value && value.role) || null
      this.form.school = (value && value.school) || null
      this.form.contact = (value && value.contact) || {}
      this.graduation_year = (value && value.graduation_year) || null
      this.identification = (value && value.identification) || {}
      this.guardian = (value && value.guardian) || {}
      this.guardian_identification = (value && value.guardian_identification) || {}
      this.isForeign = this.isForeign || (value && (value.arriveDepartDate || false))
      this.arriveDepartDate = value && value.arriveDate && value.departDate ? [value.arriveDate, value.departDate] : null
      this.hotelDate = value && value.checkInDate && value.checkOutDate ? [value.checkInDate, value.checkOutDate] : null
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
.committee-member
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
  .el-select
    display: block
  .controls
    margin: 1em auto
    text-align: center
  .hint
    font-size: 80%
    text-align: center
    &.red
      color: red
</style>
