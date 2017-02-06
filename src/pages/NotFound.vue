<template>
  <div>
    <Banner />
    <LayoutMiddle>
      <div class="not-found">
        <h3>Oops. 页面不存在</h3>
        <el-button type="primary" size="large" @click="$router.push('/')">返回主页</el-button>
      </div>
    </LayoutMiddle>
  </div>
</template>

<script>
import { Button } from 'element-ui'
import Banner from 'components/Banner'
import Copyright from 'components/Copyright'
import LayoutMiddle from 'components/LayoutMiddle'

export default {
  name: 'not-found',
  components: {
    [Button.name]: Button,
    Banner,
    Copyright,
    LayoutMiddle
  },
  data: () => ({
  })
}
</script>

<style lang="stylus" scoped>
@import "../style/flex"
.not-found
  flex-vert: center center
</style>
