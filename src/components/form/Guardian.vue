<template>
  <el-form
    :class="className"
    :label-width="labelWidth"
    :model="form"
    ref="form"
  >
    <el-form-item
      label="关系"
      prop="type"
      :rules="[{ required: true, message: '请选择监护人关系', trigger: 'change' }]"
    >
      <el-select v-model="form.type" @change="emit" class="el-input" :disabled="disabled">
        <el-option label="父" value="father" />
        <el-option label="母" value="mother" />
        <el-option label="其他" value="other" />
      </el-select>
    </el-form-item>

    <el-form-item
      label="姓名"
      prop="name"
      :rules="[
        { required: true, message: '请输入姓名', trigger: 'blur'},
        { type: 'string', pattern: /^[^ ].*$/, message: '首尾包含多余空格', trigger: 'blur'},
        { type: 'string', pattern: /^.*[^ ]$/, message: '首尾包含多余空格', trigger: 'blur'},
      ]"
    >
      <el-input
        v-model="form.name"
        type="text"
        autocomplete="off"
        placeholder="姓名"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

    <el-form-item
      label="手机"
      prop="phone"
      :rules="[
        { required: true, message: '请输入监护人的手机号', trigger: 'blur' },
        { pattern: /^(1[34578]\d{9}|\+\d{11,})$/, message: '请输入监护人的手机号', trigger: 'blur' },
      ]"
    >
      <el-input
        v-model="form.phone"
        type="text"
        autocomplete="off"
        placeholder="手机"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  name: 'guardian-form',
  props: {
    value: { type: Object },
    className: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    labelWidth: { type: String, default: '72px' }
  },
  data: () => ({
    form: {
      type: null,
      phone: null,
      name: null,
    }
  }),
  methods: {
    emit() {
      this.$emit('input', this.form)
      this.$emit('change', this.form)
    },
    validate() {
      return new Promise( resolve => {
        this.$refs.form.validate( resolve )
      })
    },
    clearValidate() {
      this.$refs.form.clearValidate()
    },
    reset() {
      this.setValue(null)
      this.emit()
    },
    setValue(value) {
      this.form.type = (value && value.type) || null
      this.form.name = (value && value.name) || null
      this.form.phone = (value && value.phone) || null
      if (this.$refs.form && !value)
        this.$refs.form.resetFields()
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
