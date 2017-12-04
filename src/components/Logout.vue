<template>
  <el-button type="primary" @click="logout"> <icon name="sign-out" /> </el-button>
</template>

<script>
import { clearToken } from '@/persistence/token'
import 'vue-awesome/icons/sign-out'

export default {
  name: 'logout',
  methods: {
    logout() {
      this.$store.commit('user/token', null)
      clearToken()
      this.$router.replace('/') 
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-button
  border-left: 0
  border-bottom: solid 1px #e6e6e6
</style>
