<template>
  <div class="reimbursement-rule">
    <el-button class="rule-button" type="primary" plain icon="el-icon-document" @click="show"> 查看报销细则 </el-button>
    <el-dialog
      :visible.sync="visible"
      width="80%"
      title="报销细则"
    >
      <h4>交通工具等级</h4>
      <ol class="ol-2">
        <li>乘坐动⻋车或⾼高铁，报销档次为⼆等座，⼀等座及商务座按同⻋车次二等座标准报销；</li>
        <li>乘坐普通火车，报销档次最高为硬卧，软卧按同车次硬卧标准报销；</li>
        <li>乘坐飞机，报销次最高为经济舱，头等舱商务舱按经济舱标准报销。</li>
      </ol>

      <h4>报销费用上限</h4>
      <p>报销按照实际花费报销，但存在报销上限，往来交通费报销金额上限 800 元。</p>

      <h4>有效报销标准</h4>
      <ol class="ol-2">
        <li>机票行程单和⽕车⾼铁的票⾯价格视为有效报销金额，额外购买的其他套餐不不予报销；</li>
        <li>由现居地（就读大学所在地或家庭居住地）到南京的直达路程或⾮直达路程（中转换乘时间为6⼩时以内）视为有效报销路路程；</li>
        <li>会前其他出发地以及会后其他目的地到南京路程费⽤与现居地到南京的直达路程费用相⽐，以较低金金额作为有效报销⾦额；</li>
        <li>直达往返或者⾮直达往返（中途换乘时间在6⼩时以内）视为有效报销路程；</li>
        <li>会前两天⾄至会后两天视为有效报销时间区间，提前或超过这一区间的路费不予报销；</li>
        <li>南京籍主席不给予路费报销（特殊情况除外）。</li>
      </ol>

      <div slot="footer">
        <el-button type="warning" @click="mute"> 不再显示 </el-button>
        <el-button type="primary" icon="el-icon-close" @click="close"> 关闭 </el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
const KEY = '_reimbursement_rule_viewed'
const getPersistence = key => {
  if (window.localStorage)
    return window.localStorage.getItem(key)
}
const setPersistence = (key, val) => {
  if (window.localStorage)
    return window.localStorage.setItem(key, val)
}

export default {
  data() {
    return {
      visible: getPersistence(KEY) !== this.$store.getters['config/conferenceStartDate']
    }
  },
  methods: {
    mute() {
      setPersistence(KEY, this.$store.getters['config/conferenceStartDate'])
      this.visible = false
    },
    show() {
      this.visible = true
    },
    close() {
      this.visible = false
    }
  },
}
</script>

<style lang="stylus" scoped>
.ol-1
  list-style-type: upper-roman
  padding-left: 4ch
.ol-2
  list-style-type: decimal
  padding-left: 3ch
.rule-button
  display: block
  margin: 1em auto
</style>
