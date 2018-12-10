<template>
  <el-form
    :class="className"
    :label-width="labelWidth"
    :model="form"
    ref="form"
  >
    <el-form-item
      label="毕业时间"
      prop="graduation"
      :rules="[{ required: true, message: '请选择毕业年份', trigger: 'change' }]"
    >
      <el-select v-model="form.graduation" @change="emit" class="el-input" :disabled="disabled">
        <el-option v-for="year in graduationYears" :key="year" :label="year" :value="year" />
      </el-select>
    </el-form-item>

  </el-form>
</template>

<script>
const ConsecutiveIntegers = (n = 0, s = 0) => [ ... Array(s) ].map( (_, i) => i + n )
export default {
  name: 'graduation-form',
  props: {
    value: {},
    className: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    labelWidth: { type: String, default: '72px' }
  },
  computed: {
    graduationYears() {
      let conferenceYear = new Date(this.$store.getters['config/conferenceStartDate']).getFullYear()
      return ConsecutiveIntegers(conferenceYear, 3)
    }
  },
  data() {
    return {
      form: {
        graduation: null
      }
    }
  },
  methods: {
    emit() {
      this.$nextTick( () => {
        this.$emit('input', this.form.graduation)
        this.$emit('change', this.form.graduation)
      })
    },
    validate() {
      return this.$refs.form.validate()
    },
    reset() {
      this.setValue(null)
      this.emit()
    },
    setValue(value) {
      this.form.graduation = value
    },
    clearValidate() {
      this.$refs.form.clearValidate()
    },
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
