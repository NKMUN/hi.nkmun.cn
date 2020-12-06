<template>
  <el-button :type="type" :plain="plain" @click="logout"> <icon name="sign-out-alt" /> </el-button>
</template>

<script>
import { clearToken } from '@/persistence/token'
import 'vue-awesome/icons/sign-out-alt'

export default {
  name: 'logout',
  props: {
    type: {
      type: String,
      default: "primary"
    },
    plain: {
      type: Boolean,
      default: false
    }
  },
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
