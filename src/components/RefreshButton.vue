<template>
  <el-button
    ref="btn"
    @click="$emit('click')"
    :type="type"
    :disabled="disabled"
    :icon="icon"
    class="refresh"
    round
    plain
    :loading="Boolean(loading)"
  />
</template>

<script>
import { Button } from 'element-ui'

export default {
  name: 'refresh-button',
  watch: {
    loading(val) {
      if (val === false && this.throttleMs) {
        setTimeout(() => {
          this.type = 'primary'
          this.disabled = false
          this.icon = 'el-icon-refresh'
        }, this.throttleMs)
        this.type = 'success',
        this.disabled = true
        this.icon = 'el-icon-check'
      }
    }
  },
  props: {
    loading: {
      default: false
    },
    throttle: {
      default: false
    }
  },
  computed: {
    throttleMs() {
      if (this.throttle !== undefined || this.throttle !== null) {
        return parseInt(this.throttle, 10).toString() === this.throttle ? Number(this.throttle) : 3000
      } else {
        return 0
      }
    }
  },
  data() {
    return {
      type: 'primary',
      disabled: false,
      icon: 'el-icon-refresh'
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-button
  padding: 5px
</style>