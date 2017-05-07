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
export default {
  name: 'request-form',
  props: {
    value: { type: Object },
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
  methods: {
    emit() {
      this.$nextTick( () => {
        this.$emit('input', this.M)
        this.$emit('change', this.M)
      })
    },
    reset() {
      this.setValue(null)
      this.emit()
    },
    validate() {
      return new Promise( resolve => {
        this.$refs.form.validate( resolve )
      })
    },
    setValue(value) {
      this.chinese = (value && value.chinese) || 0
      this.english = (value && value.english) || 0
      this.press = (value && value.press) || 0
      this.supervisor = (value && value.supervisor) || 0
      this.observer = (value && value.observer) || 0
      if (this.$refs.form)
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
