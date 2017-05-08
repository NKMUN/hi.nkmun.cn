<template>
  <el-form
    :class="className"
    :label-width="labelWidth"
    :model="M"
    ref="form"
  >
    <el-form-item
      label="关系"
      prop="type"
      :rules="[{ required: true, message: '请选择监护人关系', trigger: 'change' }]"
    >
      <el-select v-model="type" @change="emit" class="el-input">
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
        v-model="name"
        type="text"
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
        v-model="phone"
        type="text"
        placeholder="手机"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

  </el-form>
</template>

<script>
import IdValidator from 'id-validator'
const idValidator = new IdValidator()

export default {
  name: 'guardian-form',
  props: {
    value: { type: Object },
    className: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    labelWidth: { type: String, default: '72px' }
  },
  data: () => ({
    type: null,
    phone: null,
    name: null,
  }),
  computed: {
    M() {    // model to be emitted for 'input' event
      return {
        type: this.type,
        name: this.name,
        phone: this.phone,
      }
    }
  },
  methods: {
    emit() {
      this.$nextTick( () => {
        this.$emit('input', this.M)
        this.$emit('change', this.M)
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
    setValue(value) {
      this.type = (value && value.type) || null
      this.name = (value && value.name) || null
      this.phone = (value && value.phone) || null
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
