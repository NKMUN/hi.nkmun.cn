<template>
  <el-form
    :class="className"
    :label-width="labelWidth"
    :model="form"
    ref="form"
  >
    <el-form-item
      label="会场"
      prop="session"
      :rules="[ { required: true, message: '请选择会场', trigger: 'change'} ]"
    >
      <el-select
        v-model="form.session"
        placeholder="请选择会场"
        :disabled="disabled"
        @change="emit"
        class="el-input"
      >
        <el-option value="chinese" label="中文会场" />
        <el-option value="english" label="英文会场" />
        <el-option v-if="showPress" value="press" label="媒体团队" />
        <el-option value="observer" label="观察员" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'individual-request-form',
  props: {
    value: {},
    className: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    labelWidth: { type: String, default: '84px' },
    showPress: { type: Boolean, default: true }
  },
  data: () => ({
    form: {
      session: null
    }
  }),
  methods: {
    emit() {
      this.$nextTick( () => {
        this.$emit('input', this.form.session)
        this.$emit('change', this.form.session)
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
      this.form.session = value
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
