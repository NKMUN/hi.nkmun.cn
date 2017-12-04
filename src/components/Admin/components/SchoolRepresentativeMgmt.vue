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
        :leader-editable="leaderEditable"
        :show-withdraw="Boolean(showWithdraw)"
        @next="$refs.control.handleNext"
      />
    </template>

  </ListViewControl>

</template>

<script>
import { mapGetters } from 'vuex'
import Precondition from '@/components/Precondition'
import ListViewControl from '../../ListViewControl'
import RepresentativeView from './RepresentativeView'
import pinyinCmp from '@/lib/pinyin-cmp'
import { hasAccess } from '@/lib/access'

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
      access: 'user/access',
    }),
    leaderEditable() {
      if (this.representatives)
        return !this.representatives.find( $ => $.session.id === '_leader_nr' )
      return true
    },
    showWithdraw() {
      return hasAccess(this.$store.getters['user/access'], 'staff')
          || hasAccess(this.$store.getters['user/access'], 'leader')
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
    fetch() {
      return this.$agent
        .get('/api/schools/'+this.school+'/representatives')
        .then(
          res => {
            this.representatives = res.body.map($ => ({
              ... $,
              name: $.session.name
            }))
          },
          err => {
            this.notifyError(err)
            this.representatives = null
          }
        )
    },
    bySessionName(a, b) {
      return pinyinCmp(a.session.name, b.session.name)
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
