<template>
  <div>

    <ol v-if="payments && payments.length > 0">
      <li>
        <PaymentEntry v-for="payment in payments" :data="payment" />
      </li>
    </ol>

    <div v-if="!payments || payments.length === 0">
      <h4>暂无缴费记录</h4>
    </div>

  </div>
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
</style>
