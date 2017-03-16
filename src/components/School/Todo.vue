<template>
  <el-steps
    :space="50"
    direction="vertical"
    :active="stepActive"
    finish-status="success"
  >
    <el-step v-for="s in stages" :title="nameOf(s)" />
  </el-steps>
</template>

<script>
import { getName, getStages } from '../../STAGE_DEF'
export default {
  name: 'school-todo',
  props: {
    stage: {
      type: String,
      required: true
    }
  },
  computed: {
    stages() {
      return getStages()
    },
    stepActive() {
      return this.stages.indexOf(this.stage)
    }
  },
  methods: {
    nameOf: getName
  }
}
</script>

<style lang="stylus" scoped>

</style>
