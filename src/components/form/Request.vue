<template>
  <el-form
    :class="className"
    :label-width="labelWidth"
    :model="M"
    ref="form"
  >
    <el-form-item
      label="中文会场"
      prop="chinese"
      :rules="[ { required: true, type: 'integer', message: '请输入申请的名额', trigger: 'blur'} ]"
    >
      <el-input-number
        v-model="chinese"
        :min="0"
        :max="20"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

    <el-form-item
      label="英文会场"
      prop="english"
      :rules="[ { required: true, type: 'integer', message: '请输入申请的名额', trigger: 'blur'} ]"
    >
      <el-input-number
        v-model="english"
        :min="0"
        :max="20"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

    <el-form-item
      v-if="press"
      label="媒体团队"
      prop="press"
      :rules="[ { required: true, type: 'integer', message: '请输入申请的名额', trigger: 'blur'} ]"
    >
      <el-input-number
        v-model="press"
        :min="0"
        :max="20"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

    <el-form-item
      label="指导老师"
      prop="supervisor"
      :rules="[ { required: true, type: 'integer', message: '请输入申请的名额', trigger: 'blur'} ]"
    >
      <el-input-number
        v-model="supervisor"
        :min="0"
        :max="20"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

    <el-form-item
      label="观察员"
      prop="observer"
      :rules="[ { required: true, type: 'integer', message: '请输入申请的名额', trigger: 'blur'} ]"
    >
      <el-input-number
        v-model="observer"
        :min="0"
        :max="20"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

  </el-form>
</template>

<script>
import { Form, FormItem, InputNumber } from 'element-ui'
export default {
  name: 'request-form',
  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [InputNumber.name]: InputNumber
  },
  props: {
    model: { type: Object },
    className: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    labelWidth: { type: String, default: '84px' },
    showPress: { type: Boolean, default: true }
  },
  data: () => ({
    chinese: 0,
    english: 0,
    press: 0,
    supervisor: 0,
    observer: 0
  }),
  computed: {
    M() {
      return {
        chinese: this.chinese,
        english: this.english,
        ...( this.press ? {press: this.press} : {} ),
        supervisor: this.supervisor,
        observer: this.observer
      }
    }
  },
  watch: {
    model(value) {
      this.chinese = value && value.chinese || 0
      this.english = value && value.english || 0
      this.press = value && value.press || 0
      this.supervisor = value && value.supervisor || 0
      this.observer = value && this.observer || 0
    }
  },
  methods: {
    emit() {
      this.$emit('input', this.M)
      this.$emit('change', this.M)
    },
    validate() {
      return new Promise( resolve => {
        this.$refs.form.validate( resolve )
      })
    },
    reset() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
