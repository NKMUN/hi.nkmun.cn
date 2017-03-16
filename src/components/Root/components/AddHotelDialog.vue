<template>
  <el-dialog
    ref="dialog"
    title="新增酒店"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <el-form
      :model="M"
      ref="form"
      label-width="108px"
    >
      <el-form-item
        label="名称"
        prop="name"
        :rules="[ { required: true, trigger: 'blur' } ]"
      >
        <el-input
          v-model="M.name"
          placeholder="酒店名称"
          :disabled="busy"
        />
      </el-form-item>

      <el-form-item
        label="房型"
        prop="type"
        :rules="[ { required: true, trigger: 'blur' } ]"
      >
        <el-input
          v-model="M.type"
          placeholder="房型"
          :disabled="busy"
        />
      </el-form-item>

      <el-form-item
        label="单价"
        prop="price"
        :rules="[ { type: 'number', required: true, trigger: 'blur' } ]"
      >
        <el-input-number
          v-model="M.price"
          :min="0"
          :step="50"
          :disabled="busy"
        />
      </el-form-item>

      <el-form-item
        label="总量"
        prop="stock"
        :rules="[ { type: 'number', required: true, trigger: 'blur' } ]"
      >
        <el-input-number
          v-model="M.stock"
          :min="0"
          :disabled="busy"
        />
      </el-form-item>

      <el-form-item
        label="入住时间"
        prop="period"
        :rules="[ { type: 'array', required: true, trigger: 'blur' } ]"
      >
        <el-date-picker
          v-model="M.period"
          type="daterange"
          :disabled="busy"
        />
      </el-form-item>

    </el-form>
    <div class="controls">
      <el-button
        type="danger"
        :disabled="busy"
        @click="cancel"
      > 取消 </el-button>
      <el-button
        icon="check"
        type="primary"
        :loading="busy"
        @click="confirm"
      > 确认 </el-button>
    </div>
  </el-dialog>
</template>

<script>
const DEFAULT_HOTEL_MODEL = () => ({
  name: '',
  type: '',
  price: 0,
  stock: 0,
  period: null,
})

import { toDateString } from 'lib/date-util'

export default {
  name: 'add-hotel-dialog',
  props: {
    busy: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    M: {}
  }),
  methods: {
    open() {
      this.M = DEFAULT_HOTEL_MODEL()
      this.$refs.dialog.open()
    },
    close() {
      this.$refs.dialog.close()
    },
    cancel() {
      this.close()
      this.$emit('close')
    },
    confirm() {
      this.$refs.form.validate( (result) => {
        if (result)
          this.$emit('confirm', {
            name: this.M.name,
            type: this.M.type,
            price: this.M.price,
            stock: this.M.stock,
            notBefore: toDateString(this.M.period[0]),
            notAfter: toDateString(this.M.period[1]),
          })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-input
  max-width: 30ch
.controls
  text-align: center
  margin: 1em auto 0 auto
</style>
