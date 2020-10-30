<template>
  <el-tabs v-model="pane" class="tabs">
  
    <el-tab-pane label="兴业银行（对公账户）" name="cib">
      <p>请使用以下账号转账：</p>
      <BankTransferCred
        card="409530100100112183"
        name="南京米果文化传媒有限公司"
        branch="兴业银行苜蓿园支行"
      />
    </el-tab-pane>

    <el-tab-pane label="中国银行" name="boc">
      <p>请使用以下账号转账：</p>
      <BankTransferCred
        card="6217856100081189885"
        name="王小平"
        branch="中国银行南京梅花山庄支行"
      />
    </el-tab-pane>

    <el-tab-pane label="工商银行" name="icbc">
      <p>请使用以下账号转账：</p>
      <BankTransferCred
        card="6212264301019663408"
        name="王小平"
        branch="工商银行南京月牙湖支行"
      />
    </el-tab-pane>

    <el-tab-pane label="建设银行" name="ccb">
      <p>请使用以下账号转账：</p>
      <BankTransferCred
        card="6217001370008148074"
        name="王小平"
        branch="建设银行南京城东支行"
      />
    </el-tab-pane>

    <!-- <el-tab-pane label="支付宝" name="alipay">
      <p>请用支付宝扫描以下二维码转账：</p>
      <p>由于提现限制，<b>请支付 0.1% 手续费，总计 ¥{{ alipayAmount }}</b>。</p>
      <img id="alipay" alt="支付宝二维码" width="300" src="../../../assets/nkmun-alipay-qr.jpg"><img>
    </el-tab-pane> -->

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
    pane: 'cib'
  })
}
</script>

<style lang="stylus" scoped>
img
  display: block
  margin: 0 auto
</style>
