<template>
  <span class="bank-number">
    <span v-for="(seg, idx) in segments" :key="idx" class="segment">{{ seg }}</span>
  </span>
</template>

<script>
export default {
  name: 'bank-number',
  props: ['cardNumber'],
  computed: {
    segments() {
      return String(this.cardNumber).match(/.{1,4}/g)
    }
  }
}
</script>

<style lang="stylus" scoped>
.bank-number
  .segment
    margin-right: .75ch
    &:last-child
      margin-right: 0ch
</style>
