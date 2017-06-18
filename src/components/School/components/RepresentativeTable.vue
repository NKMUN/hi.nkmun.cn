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
    <el-tab-pane label="监护人信息" name="guardian">
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
    <el-tab-pane label="其他" name="etc">
      <TableView
        class="table-view"
        :data="representatives || []"
        :fields="[
          { key: 'contact.name', name: '姓名' },
          { key: 'graduation_year', name: '预期毕业' },
          { key: 'note', name: '备注' },
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

const isAdult = (r) => {
  return (r && r)
    && ( r.session.id === 'teacher'
      || r.session.id === 'supervisor'
      || r.session.id === '_supervisor'
    )
}

// return list of errors
const validateRepresentative = (representatives) => {
  let ret = []
  let leaderSelected = 0
  for (let r of representatives) {
    if (r.withdraw)
      continue
    if (r.is_leader)
      ++leaderSelected
    if ( ! ( r.contact
          && r.contact.name
          && r.contact.gender
          && r.contact.phone
          && r.contact.email
          && r.identification
          && r.identification.type
          && r.identification.number
          && (
            isAdult(r)
            ? true
            : (  r.graduation_year
              && r.guardian
              && r.guardian.type
              && r.guardian.name
              && r.guardian.phone
              && r.guardian_identification
              && r.guardian_identification.type
              && r.guardian_identification.number
            )
          )
    ) ) {
      let name = r.contact && r.contact.name
               ? r.contact.name
               : r.session.name
      ret.push(name+'的信息不完全')
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
      school: 'user/school',
      authorization: 'user/authorization'
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
        let {
          body: representativeList
        } = await this.$agent.get('/api/schools/'+this.school+'/representatives/')
                  .set( ... this.authorization )

        this.representatives = await Promise.all(
          representativeList.map(
            $ => this.$agent.get('/api/schools/'+this.school+'/representatives/'+$.id)
                 .set( ... this.authorization )
                 .then( res => res.body )
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