<template>
  <div>

    <el-tooltip
      effect="dark"
      placement="top"
      content="让该学校退会，请确认后再点击！"
    >
      <el-button
        type="danger"
        :loading="busy"
        @click="confirmNuke"
      >
        <icon class="el-icon-" name="exclamation-triangle" style="vertical-align: bottom;" />
        <span>{{ busy ? '退会中……' : '一键退会' }}</span>
      </el-button>
    </el-tooltip>

  </div>
</template>

<script>
import 'vue-awesome/icons/exclamation-triangle'

export default {
  name: 'NukeSchool',
  props: {
    disabled: { type: Boolean, default: false },
    busy: { type: Boolean, default: false },
    repeat: { type: String, default: '' }
  },
  methods: {
    confirmNuke() {
      this.$serious('这所学校完全退会。\n将释放其名额、酒店。此操作不能撤销，请确认！', this.repeat)
      .then( confirmed => confirmed ? this.$emit('click') : null )
    }
  }
}
</script>

<style lang="stylus" scoped>
div
  text-align: center
</style>
