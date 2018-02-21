<template>
  <div>
    <h4> 基本信息 </h4>

    <el-form
      :model="form"
      label-width="16ch"
      ref="form"
    >
      <el-form-item label="姓名" prop="name"
        :rules="[
          { required: true, message: '请输入姓名', trigger: 'blur'},
          { type: 'string', pattern: /^[^ ].*$/, message: '首尾包含多余空格', trigger: 'blur'},
          { type: 'string', pattern: /^.*[^ ]$/, message: '首尾包含多余空格', trigger: 'blur'}
        ]"
      >
        <el-input
          v-model="form.name"
          type="text"
          placeholder="姓名"
          @change="emit"
        />
      </el-form-item>

      <el-form-item label="性别" prop="gender"
        :rules="[ { required: true, message: '请选择性别', trigger: 'change' } ]"
      >
        <el-radio-group v-model="form.gender" @change="emit">
          <el-radio label="m">男</el-radio>
          <el-radio label="f">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="出生日期" prop="birthday"
        :rules="[ { required: true, message: '请选择出生日期', trigger: 'blur' } ]"
      >
        <BirthdayPicker v-model="form.birthday" />
      </el-form-item>

      <el-form-item label="照片" prop="photoId"
        :rules="[ { required: true, message: '请上传照片', trigger: 'change' } ]"
      >
        <ImageUpload v-model="form.photoId" action="/api/images/" @change="emit" />
      </el-form-item>

      <el-form-item label="学校" prop="school"
        :rules="[ { required: true, message: '请填写学校', trigger: 'blur' } ]"
      >
        <el-input v-model="form.school" placeholder="请填写学校" @change="emit"></el-input>
      </el-form-item>

      <el-form-item label="年级" prop="grade"
        :rules="[ { required: true, message: '请选择年级', trigger: 'change' } ]"
      >
        <el-select v-model="form.grade" placeholder="请选择年级" @change="emit">
          <el-option v-for="grade in schoolGrades" :key="grade" :label="grade" :value="grade" />
        </el-select>
      </el-form-item>

      <el-form-item label="毕业去向" prop="post_graduation" v-if="isHighSchoolStudent"
        :rules="[ { required: true, message: '请选择毕业去向', trigger: 'change' } ]"
      >
        <el-radio-group v-model="form.post_graduation" @change="emit">
          <el-radio label="出国">出国</el-radio>
          <el-radio label="高考">高考</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="专业" prop="major"
        :rules="[ { required: true, message: '请填写专业', trigger: 'blur' } ]"
      >
        <el-input v-model="form.major" placeholder="文科 / 理科 / 大学专业" @change="emit"></el-input>
      </el-form-item>


      <el-form-item label="手机" prop="phone"
        :rules="[
          { required: true, message: '请输入手机号', trigger: 'blur'},
          { type: 'string', pattern: /^(1[34578]\d{9}|\+\d{11,})$/, message: '手机号格式不正确', trigger: 'blur' }
        ]"
      >
        <el-input v-model="form.phone" type="text" placeholder="+[国际前缀][手机号]" @change="emit" />
      </el-form-item>

      <el-form-item label="QQ" prop="qq"
        :rules="[
          { required: true, message: '请输入QQ号', trigger: 'blur' },
          { type: 'string', pattern: qqRegex, message: 'QQ号格式不正确', trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="form.qq"
          type="text"
          placeholder="QQ号"
          @change="emit"
        />
      </el-form-item>

      <el-form-item label="Skype" prop="skype">
        <el-input
          v-model="form.skype"
          type="text"
          placeholder="Skype账号"
          @change="emit"
        />
      </el-form-item>

      <el-form-item label="备注" prop="note">
        <el-input v-model="form.note" placeholder="备注" />
      </el-form-item>
    </el-form>

    <h4> 证件信息 </h4>
    <Identification
      ref="identification"
      v-model="identification"
      label-width="16ch"
      @change="emit"
    />

    <h4> 监护人/紧急联系人 </h4>
    <Guardian
      ref="guardian"
      v-model="guardian"
      label-width="16ch"
      @change="emit"
    />
    <Identification
      ref="guardian_identification"
      v-model="guardian_identification"
      label-width="16ch"
      @change="emit"
    />

  </div>
</template>

<script>
import Identification from '../form/Identification'
import Guardian from '../form/Guardian'
import ImageUpload from '../form/ImageUpload'
import BirthdayPicker from '../form/BirthdayPicker'
const qqRegex = /^[0-9]{6,15}$/

export default {
  components: {
    Identification,
    Guardian,
    ImageUpload,
    BirthdayPicker,
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    qqRegex() {
      return qqRegex
    },
    schoolGrades() {
      return [
        '高一',
        '高二',
        '高三',
        '大一',
        '大二',
        '大三',
        '大四',
        '其它'
      ]
    },
    isHighSchoolStudent() {
      return this.form.grade && this.form.grade.startsWith('高')
    }
  },
  watch: {
    value(val) {
      this.setValue(val)
    }
  },
  data() {
    return {
      form: {
        name: null,
        gender: null,
        birthday: null,
        photoId: null,
        school: null,
        grade: null,
        post_graduation: null,
        major: null,
        phone: null,
        qq: null,
        skype: null,
        note: null
      },
      identification: null,
      guardian: null,
      guardian_identification: null
    }
  },
  methods: {
    emit() {
      this.$emit('input', {
        ...this.form,
        post_graduation: this.isHighSchoolStudent ? this.form.post_graduation : null,
        identification: this.identification,
        guardian: this.guardian,
        guardian_identification: this.guardian_identification
      })
    },
    setValue(value) {
      for (let key in this.form)
        this.form[key] = value && value[key] || null
      this.identification = value && value.identification || null
      this.guardian = value && value.guardian || null
      this.guardian_identification = value && value.guardian_identification || null
    },
    validate() {
      return Promise.all([
        this.$refs.form.validate().then(_ => true, _ => false),
        this.$refs.identification.validate(),
        this.$refs.guardian.validate(),
        this.$refs.guardian_identification.validate()
      ]).then(result => result.reduce((a,b) => a && b))
    }
  },
  created() {
    this.setValue(this.value)
  }
}
</script>

<style lang="stylus" scoped>
h4
  text-align: center
.el-form
  max-width: 50ch
  margin: 0 auto
  .el-select
    width: 100%
</style>