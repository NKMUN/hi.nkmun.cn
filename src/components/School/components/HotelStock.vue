<template>
  <div>

    <div class="header">
      <b>酒店余量</b>
      <el-button
        type="info"
        size="small"
        icon="information"
        :loading="loading"
        @click="fetch"
      > 刷新 </el-button>
    </div>

    <el-table :data="hotels || []" v-loading.body="loading" >
      <el-table-column prop="name" label="酒店" min-width="240" sortable />
      <el-table-column prop="type" label="房型" width="108" sortable />
      <el-table-column prop="available" label="余量" width="108" sortable />
      <el-table-column label="操作" v-if="$scopedSlots.operation">
        <template scope="scope">
          <slot name="operation" :hotel="scope.row" />
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'hotel-stock',
  computed: {
    ... mapGetters({
      authorization: 'user/authorization'
    }),
  },
  data: () => ({
    loading: false,
    hotels: []
  }),
  methods: {
    async fetch() {
      this.loading = true
      try {
        let {
          body
        } = await this.$agent.get('/api/hotels/')
                  .set( ... this.authorization )
        this.hotels = body
      } catch(e) {

      } finally {
        this.loading = false
      }
    }
  },
  async mounted() {
    await this.fetch()
  }
}
</script>

<style lang="stylus" scoped>
.header
  padding: 10px 15px
</style>
