<template>
  <SchoolRepresentativeMgmt
    slot="reviewer"
    ref="reviewer"
    :school="school"
    :id="id"
    class="school-representative-mgmt"
  />
</template>

<script>
import { mapGetters } from 'vuex'
import SchoolRepresentativeMgmt from '../Admin/components/SchoolRepresentativeMgmt'
import SessionUtils from '@/lib/session-utils'

export default {
  name: 'school-representative',
  components: {
    SchoolRepresentativeMgmt
  },
  mixins: [
    SessionUtils
  ],
  computed: {
    ...mapGetters({ school: 'user/school' })
  },
  props: {
    id: { type: String, default: '' },
  },
  data: () => ({
    busy: false
  })
}
</script>
