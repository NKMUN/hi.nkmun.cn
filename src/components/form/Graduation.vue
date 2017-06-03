<template>
  <el-form
    :class="className"
    :label-width="labelWidth"
    :model="M"
    ref="form"
  >
    <el-form-item
      label="毕业时间"
      prop="year"
      :rules="[{ required: true, type: 'number', message: '请选择毕业年份', trigger: 'change' }]"
    >
      <el-select :value="value" @input="emit" class="el-input">
        <el-option v-for="year in graduationYears" :label="year" :value="year" />
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
    },
    M() {    // model for validation
      return {
        year: this.value
      }
    },
  },
  methods: {
    emit(value) {
      this.$nextTick( () => {
        this.$emit('input', value)
        this.$emit('change', value)
      })
    },
    validate() {
      return new Promise( resolve => {
        this.$refs.form.validate( resolve )
      })
    },
    reset() {
      this.setValue(null)
      this.emit()
    },
  },
  watch: {
    value(value) {
      if (this.$refs.form && !value)
        this.$refs.form.resetFields()
    }
  }
}
</script>
