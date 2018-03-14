<template>
  <el-form
    :class="className"
    :label-width="labelWidth"
    :model="form"
    ref="form"
  >
    <el-form-item
      label="中文名"
      prop="name"
      :rules="[
        { required: true, message: '请输入学校中文名', trigger: 'blur' },
        { type: 'string', pattern: /^[^ ].*$/, message: '首尾包含多余空格', trigger: 'blur' },
        { type: 'string', pattern: /^.*[^ ]$/, message: '首尾包含多余空格', trigger: 'blur' }
      ]"
    >
      <el-input
        v-model="form.name"
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
        { type: 'string', pattern: /^[a-zA-Z0-9_.,'\- ]+$/, message: '只能包含英文字符', trigger: 'blur' },
        { type: 'string', pattern: /^[^ ].*$/, message: '首尾包含多余空格', trigger: 'blur' },
        { type: 'string', pattern: /^.*[^ ]$/, message: '首尾包含多余空格', trigger: 'blur' }
      ]"
    >
      <el-input
        v-model="form.englishName"
        type="text"
        placeholder="English Name"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

    <el-form-item
      label="所在地"
      prop="administrative_area"
      :rules="[
        { required: true, message: '请选择所在地', trigger: 'change' }
      ]"
    >
      <el-select v-model="form.administrative_area" placeholder="请选择所在地" filterable default-first-option>
        <el-option v-for="area in administrativeAreas" :key="area" :value="area" :label="area" />
      </el-select>
    </el-form-item>

    <el-form-item
      label="详细地址"
      prop="address"
      :rules="[
        { required: true, message: '请输入学校地址', trigger: 'blur' },
        { type: 'string', pattern: /^[^ ].*$/, message: '首尾包含多余空格', trigger: 'blur' },
        { type: 'string', pattern: /^.*[^ ]$/, message: '首尾包含多余空格', trigger: 'blur' }
      ]"
    >
      <el-input
        v-model="form.address"
        type="text"
        placeholder="地址"
        :disabled="disabled"
        @change="emit"
      />
    </el-form-item>

  </el-form>
</template>

<script>
import administrativeAreas from '@/lib/administrative-areas'
export default {
  name: 'school-form',
  props: {
    value: { type: Object },
    className: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    labelWidth: { type: String, default: '84px' }
  },
  data: () => ({
    form: {
      name: null,
      englishName: null,
      administrative_area: null,
      address: null
    }
  }),
  computed: {
    administrativeAreas() {
      return administrativeAreas
    }
  },
  methods: {
    emit() {
      this.$nextTick( () => {
        this.$emit('input', this.form)
        this.$emit('change', this.form)
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
      for (let key in this.form)
        this.form[key] = value && value[key] || null
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


<style lang="stylus" scoped>
.el-select
  width: 100%
</style>
