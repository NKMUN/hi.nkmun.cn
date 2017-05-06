<template>
  <el-form
    :class="className"
    :label-width="labelWidth"
    :model="M"
    ref="form"
  >
    <el-form-item
      label="证件类型"
      prop="type"
      :rules="[{ required: true, message: '请选择证件类型', trigger: 'blur'}]"
    >
      <el-select v-model="type" @change="emit" class="el-input">
        <el-option label="中国大陆身份证" value="mainland" />
        <el-option label="港澳往来内地通行证" value="sar" />
        <el-option label="台湾居民来往大陆通行证" value="taiwan" />
        <el-option label="护照（非中国）" value="passport" />
        <el-option label="其它" value="other" />
      </el-select>
    </el-form-item>

    <el-form-item
      label="证件号码"
      prop="number"
      :rules="idNumberRules"
    >
      <el-input
        v-model="number"
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
    labelWidth: { type: String, default: '72px' }
  },
  data: () => ({
    type: null,
    number: null
  }),
  computed: {
    idNumberRules() {
      const REQUIRED = { required: true, message: '请输入证件号码', trigger: 'blur' }
      const MAINLAND_RESIDENCE_ID = {
        validator: (rule, val, cbk) => cbk( idValidator.isValid(val) ? [] : [new Error('身份证格式不正确')] ),
        trigger: 'blur'
      }
      switch(this.type) {
        case 'mainland': return [ REQUIRED, MAINLAND_RESIDENCE_ID ]
        case 'sar':      return [ REQUIRED, {type: 'string', pattern: /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/, message: '证件号不正确', trigger: 'blur'} ]
        case 'taiwan':   return [ REQUIRED, {type: 'string', pattern: /^([0-9]{10}|[0-9]{8})$/, message: '证件号不正确', trigger: 'blur'} ]
        case 'passport': return [ REQUIRED, {type: 'string', pattern: /^[a-zA-Z0-9_\-]+$/, message: '证件号不正确', trigger: 'blur'} ]
        default: return [ REQUIRED ]
      }
    },
    M() {    // model to be emitted for 'input' event
      return {
        type: this.type,
        number: this.number
      }
    },
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
      this.number = (value && value.number) || null
      if (this.$mounted)
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
