<template>
  <el-tabs v-model="pane" class="tabs">

    <el-tab-pane label="银行转账" name="bank">

      <p>请选择一个银行账号进行转账：</p>

      <BankTransferCred
        card="6212264301018811073"
        name="王亚炜"
        branch="工商银行南京月牙湖支行"
      />
      <BankTransferCred
        card="6236691370000065362"
        name="王亚炜"
        branch="建设银行南京中山门支行"
      />
      <BankTransferCred
        card="6217856100007698647"
        name="王亚炜"
        branch="中国银行南京梅花山庄支行"
      />
    </el-tab-pane>

    <el-tab-pane label="支付宝" name="alipay">
      <p>请用支付宝扫描以下二维码转账：</p>
      <img id="alipay" alt="支付宝二维码" width="300" src="../../../assets/nkmun-alipay-qr.jpg"><img>
    </el-tab-pane>

  </el-tabs>
</template>

<script>
// NOTE: Tabs/TabPane are not used by other components, load in school chunk
import { Tabs, TabPane } from 'element-ui'
import BankTransferCred from './BankTransferCred'
export default {
  name: 'payment-methods',
  components: {
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    BankTransferCred
  },
  data: () => ({
    pane: 'bank'
  })
}
</script>

<style lang="stylus" scoped>
img
  display: block
  margin: 0 auto
</style>
