<template>
  <div v-loading="!config">

    <h4>学术测试</h4>
    <el-form :model="form" label-position="top" ref="form" class="academic-staff-apply-academics-tests">
      <el-form-item
        v-for="test in tests"
        v-if="test.departments.find(department => applyDepartmentIds.includes(department))"
        :key="test.id"
        :prop="test.id"
        :rules="test.rules"
      >
        <span slot="label">
          <el-tag type="info" size="mini">{{ test.tag }}</el-tag>
          <span class="text">{{ test.text }}</span>
        </span>
        <el-input
          v-model="form[test.id]"
          type="textarea"
          @change="emit"
          :autosize="{ minRows: 6 }"
        />
        <WordCount :value="form[test.id]" />
      </el-form-item>
    </el-form>

    <h4>学术作品</h4>
    <el-form :model="files" ref="files" label-width="12ch" label-position="right">
      <el-form-item label="学术作品" prop="academic_design" :rules="academicDesignRules">
        <FileListUpload
          :action="uploadEndpoint"
          :headers="{ Authorization: 'Bearer ' + token }"
          :accept="acceptFileType"
          :before-upload="beforeUpload"
          v-model="files.academic_design"
          @change="emit"
        >
          <el-button type="primary" icon="el-icon-plus" size="mini">上传</el-button>
          <div slot="tip" class="el-upload__tip">可上传 doc/docx/rar/zip/pdf 文件，单个文件不超过 10MB</div>
        </FileListUpload>
      </el-form-item>
      <el-form-item label="过往作品" prop="previous_work">
        <FileListUpload
          :action="uploadEndpoint"
          :headers="{ Authorization: 'Bearer ' + token }"
          :accept="acceptFileType"
          :before-upload="beforeUpload"
          v-model="files.previous_work"
          @change="emit"
        >
          <el-button type="primary" icon="el-icon-plus" size="mini">上传</el-button>
          <div slot="tip" class="el-upload__tip">可上传 doc/docx/rar/zip/pdf 文件，单个文件不超过 10MB</div>
        </FileListUpload>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import FileListUpload from './components/FileListUpload'
import WordCount from './components/WordCount'
export default {
  components: {
    FileListUpload,
    WordCount
  },
  computed: {
    token() {
      return this.$store && this.$store.getters['user/token'] || null
    },
    applyDepartmentIds() {
      return (this.value && this.value.roles || []).map(role => role.department_id)
    },
    tests() {
      return (this.config && this.config.tests || [])
        .map((test, idx) => ({
          id: `q${idx}`,
          text: test.text,
          departments: test.departments,
          tag: test.tag,
          rules: [
            { required: true, trigger: 'blur', message: '必填项' }    // TODO: support {max, min}length
          ]
        }))
    },
    formModel() {
      const form = {}
      for (let test of this.tests)
        form[test.id] = null
      return form
    },
    uploadEndpoint() {
      return `/api/academic-staff-applications/user/${this.value && this.value.user}/files/`
    },
    academicDesignRules() {
      const isInChargeOfDepartment = (this.value && this.value.roles || []).find(role => role.position.includes('负责人'))
      return isInChargeOfDepartment
        ? [{
          required: true,
          trigger: 'change',
          validator: (rules, val, cbk) => val.length ? cbk([]) : cbk([new Error('会场负责人必须上传学术设计')])
        }]
        : []
    },
    acceptFileType() {
      return [
        '.rar',
        '.zip',
        '.doc',
        '.docx',
        '.pdf',
        'application/zip',
        'application/x-rar-compressed',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/pdf'
      ].join(',')
    }
  },
  props: {
    value: {}
  },
  data() {
    return {
      form: {},
      files: {
        academic_design: [],
        previous_work: []
      },
      config: null,
      configResolve: null
    }
  },
  watch: {
    formModel() {
      this.setValue(this.value)
    },
    value() {
      this.setValue(this.value)
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
    setValue(val) {
      this.form = {
        ...this.formModel,
        ...(this.value && this.value.test || {})
      }
      this.files = {
        academic_design: this.value && this.value.academic_design || [],
        previous_work: this.value && this.value.previous_work || []
      }
    },
    validate() {
      return this.configResolve.then(_ =>
        Promise.all([
          this.$refs.form.validate().then(_ => true, _ => false),
          this.$refs.files.validate().then(_ => true, _ => false)
        ]).then(
          results => results.reduce((a, b) => a && b)
        )
      )
    },
    beforeUpload(file) {
      if ( file.size / 1024 / 1024 > 10 ) {
        this.$message({
          message: '单个文件必须小于 10MB',
          type: 'error'
        })
        return false
      }
      return true
    },
    emit() {
      const value = { test: this.form, ...this.files }
      this.$emit('input', value)
      this.$emit('change', value)
    }
  },
  created() {
    this.fetchConfig()
  }
}
</script>

<style lang="stylus" scoped>
h4
  text-align: center
.el-form
  max-width: 70ch
  margin: 0 auto
.word-count
  font-size: 90%
  color: #909399
.text
  white-space: pre-wrap
</style>

<style lang="stylus">
.academic-staff-apply-academics-tests
  .el-form-item__label
    line-height: 1.5
</style>