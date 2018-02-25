<template>
  <table>
    <thead>
      <tr> <th v-for="field in fields" :key="field.key">{{field.name}}</th> </tr>
    </thead>
    <tbody>
      <tr v-for="(r, idx) in data" :key="r.id || idx">
        <td v-for="field in fields" :key="field.key">
          <div v-if="getValue(r, field.key)" class="cell">
            <span v-if="field.mapper">{{ field.mapper( getValue(r, field.key) ) }} </span>
            <span v-else>{{ getValue(r, field.key) }}</span>
          </div>
          <div v-else class="cell">
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'table-view',
  props: {
    data: { type: Array, required: true },
    fields: { }
  },
  methods: {
    getValue(obj, key) {
      let keys = key.split('.')
      let cur = obj
      for (let key of keys) {
        if (cur && cur[key]) {
          cur = cur[key]
        } else {
          return undefined
        }
      }
      return cur
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../../style/table"
table
  font-size: 14px
  td
    min-height: 24px
    vertical-align: middle
</style>
