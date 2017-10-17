<template>

  <ListViewControl
    ref="control"
    :list="schools"
    :order-by="bySchoolName"
    :ungroup="true"
    :id="school"
    prefix="/staff/representatives/"
  >

    <Precondition
      :loader="configLoader"
      @loaded="configParser"
    />

    <template slot="reviewer" scope="props">
      <SchoolRepresentativeMgmt
        v-if="props.id"
        slot="reviewer"
        ref="reviewer"
        :school="props.id"
        :id="id"
        class="school-representative-mgmt"
      />
    </template>

  </ListViewControl>

</template>

<script>
import Precondition from '@/components/Precondition'
import ListViewControl from '../ListViewControl'
import SchoolRepresentativeMgmt from './components/SchoolRepresentativeMgmt'
import pinyinCmp from '@/lib/pinyin-cmp'

export default {
  name: 'representative-mgmt',
  components: {
    Precondition,
    ListViewControl,
    SchoolRepresentativeMgmt
  },
  props: {
    school: { type: String, default: '' },
    id: { type: String, default: '' },
  },
  data: () => ({
    schools: null,
    bySchoolName: (a, b) => pinyinCmp(a.name, b.name),
  }),
  methods: {
    configLoader() {
      return this.$agent.get('/api/schools/').body()
    },
    configParser(schools) {
      this.schools = schools.filter( school => Number(school.stage[0]) >= '3' )
    }
  }
}
</script>

<style lang="stylus" scoped>
.school-representative-mgmt
  flex-grow: 1
</style>
