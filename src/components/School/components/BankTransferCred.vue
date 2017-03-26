<template>
  <div class="bank-transfer-credential">
    <div>
      <span class="hint">卡号：</span> <BankNumber name="bank-number" class="value" :card-number="card" />
    </div>
    <div v-if="name">
      <span class="hint">收款人：</span> <span class="value">{{ name }}</span>
    </div>
    <div v-if="branch">
      <span class="hint">开户行：</span> <span class="value">{{ branch }}</span>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.bank-transfer-credential
  margin-top: 2em
  margin-bottom: 2em
.hint
  text-align: right
  width: 8ch
  display: inline-block
</style>

<script>
import BankNumber from './BankNumber'

export default {
  components: { BankNumber },
  props: ['name', 'card', 'branch']
}
</script>
