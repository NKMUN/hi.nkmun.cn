<template>
  <div></div>
</template>

<script>
export default {
  name: 'logout',
  mounted() {
    this.$store.commit('user/token', null)
    this.$router.replace('/')
  }
}
</script>
