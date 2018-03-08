<template>
  <div class="wrap">
    <Banner />

    <h2>报名</h2>

    <div class="apply-options">
      <el-button
        :class="{
          school: true,
          disabled: !applySchool
        }"
        :disabled="!applySchool"
        plain
        @click="$router.push('/apply/school/')"
      >
        <h4> 代表团 </h4>
        <p class="hint" v-if="applySchool">（三人以上团体）</p>
        <p class="hint" v-if="!applySchool"> 暂未开放 </p>
      </el-button>

      <el-button
        :class="{
          individual: true,
          disabled: !applyIndividual
        }"
        :disabled="!applyIndividual"
        plain
        @click="$router.push('/apply/individual/')"
      >
        <h4> 个人代表 </h4>
        <p class="hint" v-if="!applyIndividual"> 暂未开放 </p>
      </el-button>
    </div>

    <div class="back">
      <el-button icon="el-icon-arrow-left" type="primary" size="large" @click="$router.go(-1)">返回</el-button>
    </div>

    <Copyright />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Banner from '@/components/Banner'
import Copyright from '@/components/Copyright'

export default {
  name: 'apply-intro',
  components: {
    Banner,
    Copyright
  },
  computed: {
    ...mapGetters({
      applySchool: 'config/applySchool',
      applyIndividual: 'config/applyIndividual'
    })
  }
}
</script>

<style lang="stylus" scoped>
@import "../style/flex"
.wrap
  flex-vert: flex-start stretch
  h2
    text-align: center
  .apply-options
    flex-horz: center flex-start
    flex: 0 0 auto
    padding: 2em 0 4em 0
    .el-button
      flex-grow: 1
      max-width: 30ch
      margin: 0 4ch
      padding: 2em 4ch
      min-height: 8em
      h4
        text-align: center
        margin: 0 0 1em 0
      .hint
        font-size: 90%
  .back
    text-align: center
    flex: 1 0 auto
</style>
