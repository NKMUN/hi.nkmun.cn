<template>
  <el-dialog title="新增酒店" :visible="visible" :before-close="() => visible = false">
    <el-form
      :model="M"
      ref="form"
      label-width="128px"
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
          size="medium"
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
          size="medium"
          :disabled="busy"
        />
      </el-form-item>

      <el-form-item
        label="入住时间"
        prop="period"
        :rules="[ { type: 'array', required: true, trigger: 'blur' } ]"
      >
        <!-- NOTE: default-value requires upstream element-ui update -->
        <el-date-picker
          v-model="M.period"
          type="daterange"
          value-format="yyyy-MM-dd"
          :disabled="busy"
          :default-value="conferenceStartDate"
        />
      </el-form-item>

      <el-form-item
        label="拼房费率（发起）"
        prop="roomshareInitiatorRate"
        :rules="[ {type: 'number', required: false, trigger: 'blur'} ]"
      >
        <el-input-number
          v-model="M.roomshareInitiatorRate"
          :min="0"
          :max="1"
          size="medium"
          :step="0.1"
          :disabled="busy"
        />
      </el-form-item>

      <el-form-item
        label="拼房费率（接受）"
        prop="roomshareRecipientRate"
        :rules="[ {type: 'number', required: false, trigger: 'blur'} ]"
      >
        <el-input-number
          v-model="M.roomshareRecipientRate"
          :min="0"
          :max="1"
          size="medium"
          :step="0.1"
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
        icon="el-icon-check"
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
  roomshareInitiatorRate: 1,
  roomshareRecipientRate: 0,
})

import { mapGetters } from 'vuex'

export default {
  name: 'add-hotel-dialog',
  props: {
    busy: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ... mapGetters({
      conferenceStartDate: 'config/conferenceStartDate',
      conferenceEndDate: 'config/conferenceEndDate',
    }),
  },
  data: () => ({
    M: {},
    visible: false
  }),
  methods: {
    open() {
      this.M = DEFAULT_HOTEL_MODEL()
      this.visible = true
    },
    close() {
      this.visible = false
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
            notBefore: this.M.period[0],
            notAfter: this.M.period[1],
            roomshareInitiatorRate: this.M.roomshareInitiatorRate,
            roomshareRecipientRate: this.M.roomshareRecipientRate,
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
