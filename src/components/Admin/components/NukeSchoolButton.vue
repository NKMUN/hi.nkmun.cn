<template>
  <div>

    <el-tooltip
      effect="dark"
      placement="top"
      content="😡 让这所学校瞬间爆炸！ 危険付きです！"
    >
      <el-button
        type="danger"
        :loading="busy"
        @click="confirmNuke"
      >
        <icon class="el-icon-" name="exclamation-triangle" style="vertical-align: bottom;" />
        <span>{{ busy ? '爆炸中……' : '一键退会' }}</span>
      </el-button>
    </el-tooltip>

    <SeriousConfirm ref="serious" />

  </div>
</template>

<script>
import { Button, Tooltip } from 'element-ui'
import SeriousConfirm from '../../SeriousConfirm'

import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/exclamation-triangle'

export default {
  name: 'NukeSchool',
  components: {
    [Button.name]: Button,
    [Tooltip.name]: Tooltip,
    SeriousConfirm,
    Icon
  },
  props: {
    disabled: { type: Boolean, default: false },
    busy: { type: Boolean, default: false },
    repeat: { type: String, default: '' }
  },
  methods: {
    confirmNuke() {
      this.$refs.serious.confirm('彻底销毁这所学校。\n将释放其名额、酒店。请确认！', this.repeat)
      .then( confirmed => confirmed ? this.$emit('click') : null )
    }
  }
}
</script>

<style lang="stylus" scoped>
div
  text-align: center
</style>
