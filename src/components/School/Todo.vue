<template>
  <el-steps
    :space="50"
    direction="vertical"
    :active="stepActive"
    finish-status="success"
  >
    <el-step title="报名" />
    <el-step title="一轮名额确认" />
    <el-step title="一轮名额交换" />
    <el-step title="一轮酒店预订" />
    <el-step title="一轮付款" />
    <el-step title="二轮酒店预订" />
    <el-step title="二轮付款" />
    <el-step title="信息录入" />
    <el-step title="参会" />
  </el-steps>
</template>

<script>
import { Steps, Step } from 'element-ui'
export default {
  name: 'school-todo',
  components: {
    [Steps.name]: Steps,
    [Step.name]: Step
  },
  props: {
    stage: {
      type: String,
      required: true
    }
  },
  computed: {
    stepActive() {
      return [
        '0.apply',
        '1.relinquishment',
        '1.exchange',
        '1.reservation',
        '1.payment',
        '2.reservation',
        '2.payment',
        '3.confirm',
        '9.complete'
      ].indexOf(this.stage)
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
