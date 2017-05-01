<template>

  <ListViewControl
    ref="control"
    :list="schools"
    :order-by="bySchoolName"
    :ungroup="true"
    :id="school"
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

  </ReviewControl>

</template>

<script>
import { mapGetters } from 'vuex'
import Precondition from 'components/Precondition'
import ListViewControl from '../ListViewControl'
import SchoolRepresentativeMgmt from './components/SchoolRepresentativeMgmt'

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
  computed: {
    ... mapGetters({
      authorization: 'user/authorization'
    })
  },
  data: () => ({
    schools: null,
    bySchoolName: (a, b) => (a.name || '').localeCompare(b.name || ''),
  }),
  methods: {
    configLoader() {
      return this.$agent.get('/api/schools/')
                 .set( ... this.authorization )
                 .then( res => res.body )
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
