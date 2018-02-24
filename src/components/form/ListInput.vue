<template>
  <div class="list-input">
    <table style="width: 100%">
      <tbody>
        <tr v-for="(item, idx) in (value || [])" :key="idx" class="item">
          <td class="item-number">
            <div>{{ idx + 1 }}</div>
            <el-button type="danger" size="mini" class="no-padding" icon="el-icon-delete" @click="deleteItem(item)" :disabled="disabled"/>
          </td>

          <td class="item-content">
            <slot
              :item="item"
              :handle-input="val => handleItemInput(item, val)"
              :handle-change="val => handleItemChange(item, val)"
            ></slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!value || !value.length" style="text-align: center; color: #909399">{{ emptyText }}</div>
    <div v-if="showAddButton" style="text-align: center">
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="addItem" plain :disabled="disabled"> 新增 </el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {},
    itemModel: {
      type: Function,
      default: () => ({})
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    showAddButton: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    addItem() {
      const newValue = [
        ...(this.value || []),
        this.itemModel()
      ]
      this.emitInput(newValue)
      this.emitChange(newValue)
      this.$emit('add-item')
    },
    deleteItem(row) {
      const idx = this.value.indexOf(row)
      const newValue = [
        ...this.value.slice(0, idx),
        ...this.value.slice(idx + 1)
      ]
      this.emitInput(newValue)
      this.emitChange(newValue)
      this.$emit('delete-item')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    emitChange(val) {
      this.$emit('change', val)
    },
    handleItemInput(item, val) {
      // item did in-place update
      if (item === val) {
        this.emitInput(this.value)
      } else {
        const idx = this.value.indexOf(item)
        const newValue = [
          ...this.value.slice(0, idx),
          val,
          ...this.value.slice(idx + 1)
        ]
        this.emitInput(newValue)
      }
    },
    handleItemChange(item, val) {
      // item did in-place update
      if (item === val) {
        this.emitChange(this.value)
      } else {
        // CAVEAT: identity of change's argument is different from input's
        const idx = this.value.indexOf(item)
        const newValue = [
          ...this.value.slice(0, idx),
          val,
          ...this.value.slice(idx + 1)
        ]
        this.emitChange(newValue)
      }
    }
  }
}
</script>

<style lang="stylus">
.list-input
  margin: 1em 0
  .item-number
    font-size: 140%
    font-family: monospace
    text-align: center
    width: 3ch
    padding: .5rem 1rem 0 0
    vertical-align: top
  .el-button.no-padding
    padding: 7px
  > .item-content
    padding-bottom: .5em
    border-bottom: 1px solid #ebeef5
  .item-content > *
    width: 100%
</style>