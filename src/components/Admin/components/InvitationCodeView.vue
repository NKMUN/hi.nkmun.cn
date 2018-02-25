<template>
  <div v-if="invitation">
    <span>邀请码：</span>
    <span class="code">{{invitation.invitation}}</span>
    <span v-if="invitation.used" class="used">已使用</span>
    <span v-else class="not-used">未使用</span>
  </div>
  <div v-else> ... </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      invitation: null
    }
  },
  methods: {
    async fetch() {
      this.invitation = await this.$agent.get('/api/invitations/').query({ school: this.id }).body()
    }
  },
  watch: {
    id() {
      this.invitation = null
      this.fetch()
    }
  },
  mounted() {
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
div
  text-align: center
  margin: .5em 0
.used
  color: #F7BA2A
.not-used
  color: #13CE66
.code
  font-family: monospace
  font-size: 120%
  background-color: #E5E9F2
  padding: 0 1ch
</style>