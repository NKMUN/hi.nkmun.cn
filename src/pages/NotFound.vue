<template>
  <div class="not-found">
    <Banner />
    <LayoutMiddle class="layout">
      <div class="not-found">
        <h3>Oops. 页面不存在</h3>
        <div>
          <el-button icon="arrow-left" type="info" size="large" @click="$router.go(-1)">返回</el-button>
          <el-button icon="star" type="primary" size="large" @click="$router.push('/')">前往主页</el-button>
        </div>
      </div>
    </LayoutMiddle>
  </div>
</template>

<script>
import Banner from 'components/Banner'
import Copyright from 'components/Copyright'
import LayoutMiddle from 'components/LayoutMiddle'

export default {
  name: 'not-found',
  components: {
    Banner,
    Copyright,
    LayoutMiddle
  }
}
</script>

<style lang="stylus" scoped>
@import "../style/flex"
.not-found
  flex-vert: center center
  .layout
    margin-bottom: 8em
</style>
