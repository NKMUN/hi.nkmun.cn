<template>
  <el-tabs v-model="pane" class="tabs">

    <el-tab-pane label="建设银行" name="bankcomm">
      <p>请使用以下账号转账：</p>
      <BankTransferCred
        card="6217001370034674176"
        name="王亚炜"
        branch="建设银行城东支行"
      />
    </el-tab-pane>

    <el-tab-pane label="中国银行" name="boc">
      <p>请使用以下账号转账，或使用中国银行客户端扫描二维码：</p>
      <BankTransferCred
        card="6217856100007698647"
        name="王亚炜"
        branch="中国银行南京梅花山庄支行"
      />
      <img alt="中国银行二维码" width="300" src="../../../assets/boc-qr.jpg"><img>
    </el-tab-pane>

    <el-tab-pane label="支付宝" name="alipay">
      <p>请用支付宝扫描以下二维码转账：</p>
      <p>由于提现限制，<b>请支付 0.1% 手续费，总计 ¥{{ alipayAmount }}</b>。</p>
      <img id="alipay" alt="支付宝二维码" width="300" src="../../../assets/nkmun-alipay-qr.jpg"><img>
    </el-tab-pane>

  </el-tabs>
</template>

<script>
// NOTE: Tabs/TabPane are not used by other components, load in school chunk
import { Tabs, TabPane } from 'element-ui'
import BankTransferCred from './BankTransferCred'
import computeAlipayTotal from '@/lib/alipay-surcharge'

export default {
  name: 'payment-methods',
  components: {
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    BankTransferCred
  },
  props: {
    rawAmount: {}
  },
  computed: {
    alipayAmount() {
      if (this.rawAmount) {
        // ceil to cents
        return computeAlipayTotal(this.rawAmount)
      } else {
        return '?'
      }
    }
  },
  data: () => ({
    pane: 'alipay'
  })
}
</script>

<style lang="stylus" scoped>
img
  display: block
  margin: 0 auto
</style>
