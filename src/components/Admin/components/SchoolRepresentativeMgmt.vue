<template>

  <ListViewControl
    ref="control"
    :list="representatives"
    :order-by="bySessionName"
    :ungroup="true"
    :id="id"
    v-loading="!representatives"
  >

    <template slot="reviewer" scope="props">
      <RepresentativeView
        slot="reviewer"
        ref="reviewer"
        :id="props.id"
        :school="school"
        :leaderEditable="leaderEditable"
        :showWithdraw="showWithdraw"
        @next="$refs.control.handleNext"
      />
    </template>

  </ListViewControl>

</template>

<script>
import { mapGetters } from 'vuex'
import Precondition from 'components/Precondition'
import ListViewControl from '../../ListViewControl'
import RepresentativeView from './RepresentativeView'

export default {
  name: 'school-representative-mgmt',
  components: {
    Precondition,
    ListViewControl,
    RepresentativeView
  },
  props: {
    school: { type: String, default: '' },    // school id
    id: { type: String, default: '' },        // representative id
  },
  computed: {
    ... mapGetters({
      authorization: 'user/authorization',
      access: 'user/access',
    }),
    leaderEditable() {
      if (this.representatives)
        return !this.representatives.find( $ => $.session === '_leader_nr' )
      return true
    },
    showWithdraw() {
      return this.access.indexOf('admin') !== -1
    }
  },
  data: () => ({
    representatives: null
  }),
  methods: {
    notifyError(e, title='操作失败') {
      this.$notify({
        type: 'error',
        title,
        message: e.message,
        duration: 0
      })
    },
    async fetch() {
      try {
        let {
          body
        } = await this.$agent.get('/api/schools/'+this.school+'/representatives/')
                      .set( ... this.authorization )
        this.representatives = body.map( $ => ({
          ... $,
          name: $.session.name
        }) )
      } catch(e) {
        this.notifyError(e)
        this.representatives = null
      }
    },
    bySessionName(a, b) {
      return a.session.name.localeCompare(b.session.name)
    }
  },
  mounted() {
    this.fetch()
  },
  watch: {
    school() {
      this.fetch()
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
