<template>
  <el-form
    :class="className"
    :label-width="labelWidth"
    :model="M"
    ref="form"
  >
    <el-form-item
      label="中文名"
      prop="name"
      :rules="[
        { required: true, message: '请输入学校中文名', trigger: 'blur'},
        { type: 'string', pattern: /^[^ ].*$/, message: '首尾包含多余空格', trigger: 'blur'},
        { type: 'string', pattern: /^.*[^ ]$/, message: '首尾包含多余空格', trigger: 'blur'}
      ]"
    >
      <el-input
        v-model="name"
        type="text"
        placeholder="学校中文名"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

    <el-form-item
      label="英文名"
      prop="englishName"
      :rules="[
        { required: true, message: '请输入学校英文名', trigger: 'blur' },
        { type: 'string', pattern: /^[a-zA-Z0-9_.,\- ]+$/, message: '只能包含英文字符', trigger: 'blur' },
        { type: 'string', pattern: /^[^ ].*$/, message: '首尾包含多余空格', trigger: 'blur'},
        { type: 'string', pattern: /^.*[^ ]$/, message: '首尾包含多余空格', trigger: 'blur'}
      ]"
    >
      <el-input
        v-model="englishName"
        type="text"
        placeholder="English Name"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

    <el-form-item
      label="地址"
      prop="address"
      :rules="[
        { required: true, message: '请输入学校地址', trigger: 'blur'},
        { type: 'string', pattern: /^[^ ].*$/, message: '首尾包含多余空格', trigger: 'blur'},
        { type: 'string', pattern: /^.*[^ ]$/, message: '首尾包含多余空格', trigger: 'blur'}
      ]"
    >
      <el-input
        v-model="address"
        type="text"
        placeholder="地址"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  name: 'school-form',
  props: {
    value: { type: Object },
    className: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    labelWidth: { type: String, default: '72px' }
  },
  data: () => ({
    name: null,
    englishName: null,
    address: null
  }),
  computed: {
    M() {
      return {
        name: this.name,
        englishName: this.englishName,
        address: this.address
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
      this.name = (value && value.name) || null
      this.englishName = (value && value.englishName) || null
      this.address = (value && value.address) || null
      if (this.$refs.form && !value)
        this.$refs.form.resetFields()
    }
  },
  watch: {
    value(value) {
      this.setValue(value)
    },
  },
  created() {
    this.setValue(this.value)
  }
}
</script>
