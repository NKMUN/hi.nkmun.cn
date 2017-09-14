<template>
  <ol v-if="payments && payments.length > 0">
    <li>
      <PaymentEntry v-for="payment in payments" :key="payment.id" :data="payment" />
    </li>
  </ol>
</template>

<script>
import PaymentEntry from './PaymentEntry'
export default {
  name: 'payment-list',
  components: {
    PaymentEntry,
  },
  props: {
    payments: { type: Array, default: () => [] }
  },
}
</script>

<style lang="stylus" scoped>
ol
  list-style: none
  display: block
  overflow: visible
h4
  text-align: center
</style>
