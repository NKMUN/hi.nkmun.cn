<template>
  <div class="hotel-mgmt" v-loading.body="!hotels">
    <h3>酒店管理</h3>

    <div class="note">
      <ul>
        <li>删除酒店会清空该酒店的所有预定</li>
        <li>入住时间必须包含会议时间段，否则可能无法正常预订</li>
        <li v-if="conferenceStartDate && conferenceEndDate">
          会议时间为
          <code class="date">{{conferenceStartDate}}</code>
          至
          <code class="date">{{conferenceEndDate}}</code>
        </li>
      </ul>
    </div>

    <el-table v-if="hotels" :data="hotels" class="hotel-table">
      <el-table-column prop="name" label="名称" min-width="160" sortable />
      <el-table-column prop="type" label="房型" width="96" sortable />
      <el-table-column prop="notBefore" label="入住时间" width="96" sortable>
        <span slot-scope="{row}">{{ row.notBefore | date }}</span>
      </el-table-column>
      <el-table-column prop="notAfter" label="退房时间" width="96" sortable>
        <span slot-scope="{row}">{{ row.notAfter | date }}</span>
      </el-table-column>
      <el-table-column prop="price" label="单价" width="64" />
      <el-table-column label="拼房费率" header-align="center">
        <el-table-column prop="roomshareInitiatorRate" header-align="center" label="发起" width="54" />
        <el-table-column prop="roomshareRecipientRate" header-align="center" label="接受" width="54" />
      </el-table-column>
      <el-table-column prop="available" label="余量" width="54" />
      <el-table-column prop="stock" label="总量" width="84">
        <template slot-scope="{row}">
          <span class="stock">{{ row.stock }}</span>
          <el-button
            type="text"
            size="small"
            @click="$refs.modifyStock.open(row)"
            :disabled="busy"
          > 修改 </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="72">
        <template slot-scope="{row, $index}">
          <el-button
            type="text"
            size="small"
            icon="el-icon-delete"
            @click="deleteHotel($index)"
            :disabled="busy"
          > 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="controls editor" v-if="hotels">
      <el-button
        type="text"
        size="small"
        icon="el-icon-plus"
        @click="$refs.addHotel.open()"
        :disabled="busy"
      > 新增酒店 </el-button>
    </div>

    <AddHotelDialog
      ref="addHotel"
      :busy="busy"
      @confirm="addHotel"
    />

    <ModifyHotelStockDialog
      ref="modifyStock"
      :busy="busy"
      @confirm="modifyStock"
    />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import AddHotelDialog from './components/AddHotelDialog'
import ModifyHotelStockDialog from './components/ModifyHotelStockDialog'
import { toDateString } from '@/lib/date-util'

export default {
  name: 'hotel-mgmt',
  components: {
    AddHotelDialog,
    ModifyHotelStockDialog
  },
  data: () => ({
    busy: false,
    hotels: null
  }),
  computed: {
    ... mapGetters({
      conferenceStartDate: 'config/conferenceStartDate',
      conferenceEndDate: 'config/conferenceEndDate',
    }),
  },
  filters: {
    date(val) {
      return toDateString(val)
    }
  },
  methods: {
    async deleteHotel(idx) {
      let confirmed = await this.$serious('删除酒店清除所有该酒店的房间预定', this.hotels[idx].name)
      if ( confirmed ) {
        this.busy = true
        try {
          await this.$agent.delete('/api/hotels/'+this.hotels[idx].id)
          this.hotels.splice( idx, 1 )
          this.$notify({
            type: 'warning',
            title: '酒店已删除',
            duration: 5000
          })
        } catch(e) {
          this.$notify({
            type: 'error',
            title: '删除酒店失败',
            message: e.message,
            duration: 0
          })
        } finally {
          this.busy = false
        }
      }
    },
    async addHotel(hotel) {
      this.busy = true
      try {
        // created hotel is returned in body
        const newHotel = await this.$agent.post('/api/hotels', hotel).body()
        this.hotels.push( newHotel )
        this.$notify({
          type: 'success',
          title: '酒店已添加',
          duration: 5000
        })
        this.$refs.addHotel.close()
      } catch (e) {
        this.$notify({
          type: 'error',
          title: '酒店添加失败',
          message: e.message,
          duration: 0
        })
      } finally {
        this.busy = false
      }
    },
    async modifyStock(id, targetStock) {
      this.busy = true
      try {
        const updatedHotel = await this.$agent.patch('/api/hotels/'+id, { stock: targetStock }).body()
        // updated hotel is returned in body
        this.hotels.splice(
          this.hotels.findIndex( $ => $.id === id ),
          1,
          updatedHotel
        )
        this.$notify({
          type: 'success',
          title: '库存已修改',
          message: updatedHotel.name+'的库存已变更为'+updatedHotel.stock+'，当前余量：'+updatedHotel.available,
          duration: 5000
        })
        this.$refs.modifyStock.close()
      } catch(e) {
        this.$notify({
          type: 'error',
          title: '酒店库存修改失败',
          message: e.message,
          duration: 0
        })
      } finally {
        this.busy = false
      }
    }
  },
  mounted() {
    this.$agent
      .get('/api/hotels')
      .body()
      .then(
        hotels => this.hotels = hotels,
        err => this.$notify({
          type: 'error',
          title: '获取酒店列表失败',
          message: e.message,
          duration: 0
        })
      )
  },
}
</script>

<style lang="stylus">
// Do not use `scoped`, el-input inside el-table has different scope!
.error
  &.el-input, &.el-select
    .el-input__inner
      border-color: #FF4949
</style>

<style lang="stylus" scoped>
@import "../../style/flex"
.hotel-mgmt
  flex-vert: flex-start center
  padding-bottom: 2em
  overflow: auto
  .note
    white-space: nowrap
    color: #475669
    font-size: 14px
  .hotel-table
    max-width: 120ch
    .stock
      min-width: 3ch
      display: inline-block
  .el-alert
    width: auto
    margin: 1em auto
</style>
