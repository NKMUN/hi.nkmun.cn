<template>
  <div></div>
</template>

<script>
import { clearToken } from '@/persistence/token'
export default {
  name: 'logout',
  mounted() {
    this.$store.commit('user/token', null)
    clearToken()
    this.$router.replace('/')
  }
}
</script>
