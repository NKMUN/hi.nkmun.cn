<template>
  <el-tabs v-model="activeTab" v-loading="!representatives">
    <el-tab-pane label="代表信息" name="representative">
      <TableView
        class="table-view"
        :data="representatives || []"
        :fields="[
          { key: 'contact.name', name: '姓名' },
          { key: 'is_leader', name: '', mapper: isLeader },
          { key: 'session.name', name: '会场' },
          { key: 'contact.gender', name: '性别', mapper: genderText },
          { key: 'contact.phone', name: '手机' },
          { key: 'contact.qq', name: 'QQ' },
          { key: 'contact.email', name: '邮箱' },
        ]"
      />
    </el-tab-pane>
    <el-tab-pane label="身份信息" name="identification">
      <TableView
        class="table-view"
        :data="representatives || []"
        :fields="[
          { key: 'contact.name', name: '姓名' },
          { key: 'identification.type', name: '证件类型', mapper: identificationTypeText },
          { key: 'identification.number', name: '证件号码' },
        ]"
      />
    </el-tab-pane>
    <el-tab-pane label="第一监护人" name="guardian">
      <TableView
        class="table-view"
        :data="representatives || []"
        :fields="[
          { key: 'contact.name', name: '姓名' },
          { key: 'guardian.type', name: '监护人关系', mapper: guardianTypeText },
          { key: 'guardian.name', name: '监护人姓名' },
          { key: 'guardian.phone', name: '监护人手机' },
          { key: 'guardian_identification.type', name: '监护人证件类型', mapper: identificationTypeText },
          { key: 'guardian_identification.number', name: '监护人证件号码' },
        ]"
      />
    </el-tab-pane>
    <el-tab-pane label="第二监护人" name="altGuardian">
      <TableView
        class="table-view"
        :data="representatives || []"
        :fields="[
          { key: 'contact.name', name: '姓名' },
          { key: 'alt_guardian.type', name: '监护人关系', mapper: guardianTypeText },
          { key: 'alt_guardian.name', name: '监护人姓名' },
          { key: 'alt_guardian.phone', name: '监护人手机' },
        ]"
      />
    </el-tab-pane>
    <el-tab-pane label="其他" name="etc">
      <TableView
        class="table-view"
        :data="representatives || []"
        :fields="[
          { key: 'contact.name', name: '姓名' },
          { key: 'graduation_year', name: '预期毕业' },
          { key: 'note', name: '备注' },
          { key: 'disclaimer_image', name: '权责声明', mapper: disclaimerImageText }
        ]"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { mapGetters } from 'vuex'
import genderText from '../../../lib/gender-text'
import identificationTypeText from '../../../lib/identification-type-text'
import guardianTypeText from '../../../lib/guardian-type-text'
import { Tabs, TabPane } from 'element-ui'
import TableView from './TableView'

const validateIdentification = (identification) => (
     identification
  && identification.type
  && identification.number
)

const validateGuardian = (guardian) => (
     guardian
  && guardian.type
  && guardian.name
  && guardian.phone
)

// return list of errors
const validateRepresentative = (representatives) => {
  let ret = []
  let leaderSelected = 0
  for (let r of representatives) {
    const name = r.contact && r.contact.name
               ? r.contact.name
               : r.session.name
    let representativeErrors = []
    if (r.withdraw)
      continue
    if (r.is_leader)
      ++leaderSelected
    if ( ! ( r.contact
          && r.contact.name
          && r.contact.gender
          && r.contact.phone
          && r.contact.email
          && r.contact.qq
          && validateIdentification(r.identification)
          && r.graduation_year
          && validateGuardian(r.guardian)
          && validateIdentification(r.guardian_identification)
          && validateGuardian(r.alt_guardian)
    ) ) {
      representativeErrors.push(`信息不完全`)
    }
    if (!r.disclaimer_image)
      representativeErrors.push(`权责声明未上传`)
    if (representativeErrors.length) {
      ret.push(`${name}：${representativeErrors.join('、')}`)
    }
  }
  if (leaderSelected===0)
    ret.push('未选择领队')
  if (leaderSelected!==1)
    ret.push('只能选择一个领队')
  return ret
}

export default {
  name: 'representative-table',
  components: {
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    TableView,
  },
  computed: {
    ... mapGetters({
      school: 'user/school'
    }),
  },
  data: () => ({
    activeTab: 'representative',
    representatives: null,
    mapper: {
      'contact.gender': genderText
    }
  }),
  methods: {
    async fetch() {
      try {
        const representativeList = await this.$agent.get('/api/schools/'+this.school+'/representatives/').body()
        this.representatives = await Promise.all(
          representativeList.map(
            $ => this.$agent.get('/api/schools/'+this.school+'/representatives/'+$.id).body()
          )
        ).then(representatives => representatives.filter($ => !$.withdraw))

        this.$emit('validated', validateRepresentative(this.representatives))
      } catch(e) {
        console.error(e)
        this.representatives = null
      }
    },
    genderText,
    identificationTypeText,
    guardianTypeText,
    disclaimerImageText(val) {
      return val ? '已上传' : '未上传'
    },
    isLeader(v) {
      return v ? '领队' : ''
    },
  },
  mounted() {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
@import "../../../style/flex"
div
  flex-vert: flex-start center
  *
    flex-shrink: 0
    flex-grow: 0
  .reservations
    margin: 0 auto 1em auto
    min-width: 50%
    max-width: 720px
  .delimiter
    color: #99A9BF
  .date
    font-family: monospace
.table-view
  min-width: 80ch
  max-width: 100%
</style>
