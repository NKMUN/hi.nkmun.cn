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
    bySchoolName: (a, b) => (a.name || '').localeCompare(b.name || ''),
  }),
  methods: {
    configLoader() {
      return Promise.all([
        this.$agent.get('/api/sessions/').then( res => res.body ),
        this.$agent.get('/api/schools/').then( res => res.body )
      ])
    },
    configParser([ sessions, schools ]) {
      this.sessions = sessions.filter( session => !session.reserved )
      this.schools = schools
    }
  }
}
</script>
