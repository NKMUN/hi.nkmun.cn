<template>
  <el-dialog
    :visible="visible"
    title="库存修改"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <el-form label-width="108px">

      <el-form-item label="酒店" >
        {{ hotel.name }}
      </el-form-item>

      <el-form-item label="房型" >
        {{ hotel.type }}
      </el-form-item>

      <el-form-item label="目标库存" >
        <el-input-number
          :min="minStock"
          size="medium"
          v-model="targetStock"
          :disabled="busy"
        />
      </el-form-item>

    </el-form>

    <el-alert
      type="info"
      show-icon
      :closable="false"
      :title="'预计修改后余量：'+(targetStock - hotel.stock + hotel.available)"
    />

    <el-alert
      v-if="targetStock < hotel.stock"
      type="warning"
      show-icon
      :closable="false"
      title="说明"
      description="如发生竞争情况，余量可能会变为负数"
    />

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

export default {
  name: 'modify-hotel-stock-dialog',
  props: {
    busy: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    hotel: {},
    targetStock: null,
    minStock: null,
    visible: false
  }),
  methods: {
    open(hotel) {
      this.hotel = hotel
      this.minStock = this.hotel.stock - this.hotel.available
      this.targetStock = this.hotel.stock
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
      this.$emit('confirm', this.hotel.id, this.targetStock)
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
.el-alert
  margin-top: 1em
</style>
