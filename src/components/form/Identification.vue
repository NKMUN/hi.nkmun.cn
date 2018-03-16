<template>
  <el-form
    :class="className"
    :label-width="labelWidth"
    :model="form"
    ref="form"
  >
    <el-form-item
      label="证件类型"
      prop="type"
      :rules="[
        { required: true, message: '请选择证件类型', trigger: 'change' }
      ]"
    >
      <el-select v-model="form.type" @change="emit" class="el-input" :disabled="disabled">
        <el-option label="中国大陆身份证" value="mainland" v-if="typeAccepts('mainland')" />
        <el-option label="港澳往来内地通行证" value="sar" v-if="typeAccepts('sar')" />
        <el-option label="台湾居民来往大陆通行证" value="taiwan" v-if="typeAccepts('taiwan')" />
        <el-option label="护照（非中国）" value="passport" v-if="typeAccepts('passport')" />
        <el-option label="其它" value="other" v-if="typeAccepts('other')" />
      </el-select>
    </el-form-item>

    <el-form-item
      label="证件号码"
      prop="number"
      :rules="idNumberRules"
    >
      <el-input
        v-model="form.number"
        type="text"
        placeholder="证件号码"
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
  name: 'identification-form',
  props: {
    value: { type: Object },
    className: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    labelWidth: { type: String, default: '72px' },
    acceptableTypes: { type: Array, default: () => ['mainland', 'sar', 'taiwan', 'passport', 'other'] },
  },
  data: () => ({
    form: {
      type: null,
      number: null
    }
  }),
  computed: {
    idNumberRules() {
      const REQUIRED = { required: true, message: '请输入证件号码', trigger: 'blur' }
      const MAINLAND_RESIDENCE_ID = {
        validator: (rule, val, cbk) => cbk( idValidator.isValid(val) ? [] : [new Error('身份证格式不正确')] ),
        trigger: 'blur'
      }
      switch(this.form.type) {
        case 'mainland': return [ REQUIRED, MAINLAND_RESIDENCE_ID ]
        case 'sar':      return [ REQUIRED, {type: 'string', pattern: /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/, message: '证件号不正确', trigger: 'blur'} ]
        case 'taiwan':   return [ REQUIRED, {type: 'string', pattern: /^([0-9]{10}|[0-9]{8})$/, message: '证件号不正确', trigger: 'blur'} ]
        case 'passport': return [ REQUIRED, {type: 'string', pattern: /^[a-zA-Z0-9_\-]+$/, message: '证件号不正确', trigger: 'blur'} ]
        default: return [ REQUIRED ]
      }
    },
  },
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
    reset() {
      this.setValue(null)
      this.emit()
    },
    setValue(value) {
      this.form.type = (value && value.type) || null
      this.form.number = (value && value.number) || null
      if (this.$refs.form && !value)
        this.$refs.form.resetFields()
    },
    typeAccepts(type) {
      return this.acceptableTypes.indexOf(type) !== -1
    }
  },
  watch: {
    value(value) {
      this.setValue(value)
    }
  },
  created() {
    this.setValue(this.value)
    if (this.acceptableTypes.length === 1)
      this.type = this.acceptableTypes[0]
  }
}
</script>
