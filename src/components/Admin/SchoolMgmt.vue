<template>

  <ListViewControl
    ref="control"
    :list="schools"
    :order-by="bySchoolName"
    :ungroup="true"
    :id="id"
  >

    <Precondition
      :loader="configLoader"
      @loaded="configParser"
    />

    <template slot="reviewer" scope="props">
      <SchoolView
        slot="reviewer"
        ref="reviewer"
        :sessions="sessions"
        :id="props.id"
        @nuked="$refs.control.handleRemove"
        @next="$refs.control.handleNext"
      />
    </template>

  </ListViewControl>

</template>

<script>
import Precondition from '@/components/Precondition'
import ListViewControl from '../ListViewControl'
import SchoolView from './components/SchoolView'
import pinyinCmp from '@/lib/pinyin-cmp'

export default {
  name: 'school-mgmt',
  components: {
    Precondition,
    ListViewControl,
    SchoolView
  },
  props: { id: { type: String, default: '' } },
  data: () => ({
    sessions: null,
    schools: null,
    bySchoolName: (a, b) => pinyinCmp(a.name, b.name),
  }),
  methods: {
    configLoader() {
      return Promise.all([
        this.$agent.get('/api/sessions/').body(),
        this.$agent.get('/api/schools/').body()
      ])
    },
    configParser([ sessions, schools ]) {
      this.sessions = sessions.filter( session => !session.reserved )
      this.schools = schools
    }
  }
}
</script>
