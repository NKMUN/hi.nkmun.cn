<template>
  <div class="">
    <h4> 补充说明 </h4>

    <el-form
      :model="form"
      label-width="16ch"
      ref="form"
      label-position="top"
      class="academic-staff-apply-extras"
    >
      <el-form-item prop="additional_comment">
        <span slot="label">在本份测试题目以外，你对汇文模联组委和学术总监有什么想说的话？请在这里告诉我们，感恩。</span>
        <el-input
          v-model="form.additional_comment"
          type="textarea"
          @change="emit"
          :autosize="{minRows: 8}"
        />
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    value(val) {
      this.setValue(val)
    }
  },
  data() {
    return {
      form: {
        additional_comment: ''
      }
    }
  },
  methods: {
    emit() {
      this.$emit('input', this.form)
    },
    setValue(value) {
      for (let key in this.form)
        this.form[key] = value && value[key] || ''
    },
    validate() {
      return this.$refs.form.validate().then(_ => true, _ => false)
    }
  },
  mounted() {
    this.setValue(this.value)
  }
}
</script>

<style lang="stylus" scoped>
h4
  text-align: center
.el-form
  max-width: 50ch
  margin: 0 auto
  .el-select
    width: 100%
</style>

<style lang="stylus">
.academic-staff-apply-extras
  .el-form-item__label
    line-height: 2
</style>