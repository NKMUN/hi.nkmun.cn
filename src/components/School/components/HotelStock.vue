<template>
  <div>

    <div class="header">
      <b>可交换名额</b>
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
      <el-table-column prop="type" label="房型" width="180" sortable />
      <el-table-column prop="available" label="余量" width="144" sortable />
      <el-table-column label="操作" v-if="$scopedSlots.operation">
        <template scope="scope">
          <slot name="operation" :hotel="scope.row" />
        </template>
      </el-table-column>
    <el-table>

  </div>
</template>

<script>
import { Button, Table, TableColumn } from 'element-ui'
import moment from 'moment'
import momentTz from 'moment-timezone'
import { mapGetters } from 'vuex'

export default {
  name: 'hotel-stock',
  components: {
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
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
