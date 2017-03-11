<template>
  <div class="hotel-mgmt" v-loading.body="!hotels">
    <h3>酒店管理</h3>

    <div class="note">
      <ul>
        <li>删除酒店会清空该酒店的所有预定</li>
      </ul>
    </div>

    <el-table v-if="hotels" :data="hotels" class="hotel-table">
      <!-- <el-table-column prop="id" label="ID" width="144" sortable fixed /> -->
      <el-table-column prop="name" label="名称" min-width="96" sortable />
      <el-table-column prop="type" label="房型" width="96" sortable />
      <el-table-column prop="notBefore" label="入住时间" width="120" sortable>
        <template scope="scope"> <span>{{ scope.row.notBefore | date }}</span> </template>
      </el-table-column>
      <el-table-column prop="notAfter" label="退房时间" width="120" sortable>
        <template scope="scope"> <span>{{ scope.row.notAfter | date }}</span> </template>
      </el-table-column>
      <el-table-column prop="price" label="单价" width="72" />
      <el-table-column prop="available" label="余量" width="72" />
      <el-table-column prop="stock" label="总量" width="108">
        <template scope="scope">
          <span class="stock">{{ scope.row.stock }}</span>
          <el-button
            type="text"
            size="small"
            @click="$refs.modifyStock.open(scope.row)"
            :disabled="busy"
          > 修改 </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="96">
        <template scope="scope">
          <el-button
            type="text"
            size="small"
            icon="delete"
            @click="deleteHotel(scope.$index)"
            :disabled="busy"
          > 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="controls editor" v-if="hotels">
      <el-button
        type="text"
        size="small"
        icon="plus"
        @click="$refs.addHotel.open()"
        :disabled="busy"
      > 新增酒店 </el-button>
    </div>

    <SeriousConfirm ref="seriousConfirm" />

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
import {
  Table,
  TableColumn,
  Notification,
  Button,
  Alert
} from 'element-ui'
import { mapGetters } from 'vuex'
import SeriousConfirm from 'components/SeriousConfirm'
import AddHotelDialog from './components/AddHotelDialog'
import ModifyHotelStockDialog from './components/ModifyHotelStockDialog'
import toDateString from 'lib/to-date-string'

export default {
  name: 'hotel-mgmt',
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Button.name]: Button,
    [Alert.name]: Alert,
    SeriousConfirm,
    AddHotelDialog,
    ModifyHotelStockDialog
  },
  data: () => ({
    busy: false,
    hotels: null
  }),
  computed: {
    ... mapGetters({ authorization: 'user/authorization' }),
    seriousConfirm() { return (...args) => this.$refs.seriousConfirm.confirm(...args) }
  },
  filters: {
    date(val) {
      return toDateString(val)
    }
  },
  methods: {
    async deleteHotel(idx) {
      let confirmed = await this.seriousConfirm('删除酒店清除所有该酒店的房间预定', this.hotels[idx].name)
      if ( confirmed ) {
        this.busy = true
        try {
          let {
            ok
          } = await this.$agent.delete('/api/hotels/'+this.hotels[idx].id)
                    .set( ... this.authorization )
          this.hotels.splice( idx, 1 )
          Notification({
            type: 'warning',
            title: '酒店已删除',
            duration: 5000
          })
        } catch(e) {
          Notification({
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
        let {
          body
        } = await this.$agent.post('/api/hotels', hotel)
                  .set( ... this.authorization )
        // created hotel is returned in body
        this.hotels.push( body )
        Notification({
          type: 'success',
          title: '酒店已添加',
          duration: 5000
        })
        this.$refs.addHotel.close()
      } catch (e) {
        Notification({
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
        let {
          body
        } = await this.$agent.patch('/api/hotels/'+id, { stock: targetStock })
                  .set( ... this.authorization )
        // updated hotel is returned in body
        this.hotels.splice(
          this.hotels.findIndex( $ => $.id === id ),
          1,
          body
        )
        Notification({
          type: 'success',
          title: '库存已修改',
          message: body.name+'的库存已变更为'+body.stock+'，当前余量：'+body.available,
          duration: 5000
        })
        this.$refs.modifyStock.close()
      } catch(e) {
        Notification({
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
  async mounted() {
    try {
      let {
        body
      } = await this.$agent.get('/api/hotels')
                .set( ... this.authorization )
      this.hotels = body
    } catch(e) {
      Notification({
        type: 'error',
        title: '获取酒店列表失败',
        message: e.message,
        duration: 0
      })
    }
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
  .note
    white-space: nowrap
    color: #475669
    font-size: 14px
  .hotel-table
    max-width: 90ch
    .stock
      min-width: 3ch
      display: inline-block
  .el-alert
    width: auto
    margin: 1em auto
</style>
