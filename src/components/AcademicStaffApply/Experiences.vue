<template>
  <div class="academic-staff-application-experiences">
    <div v-for="({items, name, prop}, idx) in FORMS" :key="name" class="section">
      <h4>
        {{ name }}
        <el-button
          class="no-padding"
          type="primary"
          plain
          round
          size="mini"
          icon="el-icon-plus"
          @click="$refs.listInput[idx].addItem()"
        />
      </h4>
      <ListInput
        v-model="form[prop]"
        @change="emit"
        empty-text="暂无，请添加"
        :show-add-button="false"
        :item-model="getItemModelFor(items)"
        ref="listInput"
      >
        <el-form
          ref="forms"
          slot-scope="{item: row, handleInput: listItemInput, handleChange: listItemChange}"
          :model="row"
          label-position="right"
          label-width="12ch"
        >
          <el-form-item
            v-for="item in items"
            :key="item.prop"
            :label="item.label"
            :rules="item.rules"
            :prop="item.prop"
          >
            <el-input
              v-model="row[item.prop]"
              autocomplete="off"
              size="mini"
              @input="listItemInput(row)"
              @change="listItemChange(row)"
              :placeholder="item.placeholder || ''"
            />
          </el-form-item>
        </el-form>
      </ListInput>
    </div>
  </div>
</template>

<script>
import ListInput from '@/components/form/ListInput'
const REQUIRED = { required: true, trigger: 'blur', message: '必填项' }
const FORMS = [
  { name: '参会经历（作为代表）', prop: 'experiences_as_delegate', items: [
    { label: '会议名称', prop: 'conference', rules: [REQUIRED] },
    { label: '级别', prop: 'level', rules: [REQUIRED] },
    { label: '主办方', prop: 'organizer', rules: [REQUIRED] },
    { label: '委员会', prop: 'committee', rules: [REQUIRED] },
    { label: '议题', prop: 'topic', rules: [REQUIRED] },
    { label: '奖项', prop: 'prize', rules: [] }
  ] },
  { name: '参会经历（作为主席）', prop: 'experiences_as_dais', items: [
    { label: '会议名称', prop: 'conference', rules: [REQUIRED] },
    { label: '级别', prop: 'level', rules: [REQUIRED] },
    { label: '主办方', prop: 'organizer', rules: [REQUIRED] },
    { label: '委员会', prop: 'committee', rules: [REQUIRED] },
    { label: '议题', prop: 'topic', rules: [REQUIRED] },
    { label: '职位/职务', prop: 'position', rules: [REQUIRED] }
  ] },
  { name: '参会经历（作为组织者）', prop: 'experiences_as_organizer', items: [
    { label: '会议名称', prop: 'conference', rules: [REQUIRED] },
    { label: '级别', prop: 'level', rules: [REQUIRED] },
    { label: '主办方', prop: 'organizer', rules: [REQUIRED] },
    { label: '职位', prop: 'position', rules: [REQUIRED] },
    { label: '职务', prop: 'role', rules: [REQUIRED] }
  ] },
  { name: '其它活动经历', prop: 'experiences_of_other_events', items: [
    { label: '活动名称', prop: 'conference', rules: [REQUIRED] },
    { label: '职位', prop: 'position', rules: [REQUIRED] },
    { label: '职务', prop: 'role', rules: [REQUIRED] }
  ] }
]

export default {
  components: {
    ListInput
  },
  computed: {
    FORMS() { return FORMS }
  },
  props: {
    value: {}
  },
  watch: {
    value(val) {
      this.setValue(val)
    }
  },
  data() {
    return {
      form: {
        experiences_as_delegate: [],
        experiences_as_dais: [],
        experiences_as_organizer: [],
        experiences_of_other_events: []
      }
    }
  },
  methods: {
    emit() {
      this.$emit('input', this.form)
      this.$emit('change', this.form)
    },
    getItemModelFor(items) {
      return () => {
        let ret = {}
        for (let item of items)
          ret[item.prop] = null
        return ret
      }
    },
    validate() {
      return Promise.all(
        (this.$refs.forms || []).map(
          form => form.validate().then(_ => true, _ => false)
        )
      ).then(
        results => results.reduce((a, b) => a && b, true)
      )
    },
    setValue(val) {
      for (let key in this.form)
        this.form[key] = val && val[key] || []
    }
  },
  created() {
    this.setValue(this.value)
  }
}
</script>

<style lang="stylus" scoped>
h4
  text-align: center
.el-button.no-padding
  padding: 7px
.el-form
  .el-input
    max-width: 55ch
.list-input
  max-width: 70ch
  margin: 1em auto
</style>

<style lang="stylus">
// override el-form-item style, make form more compact
.academic-staff-application-experiences
  .el-form-item
    margin-bottom: 0
  .el-form-item::after, .el-form-item::before
    display: unset
    content: unset
  .el-form-item__content::after, .el-form-item__content::before
    display: unset
    content: unset
  .el-form-item__error
    display: inline-block
    margin-left: 2ch
    position: unset
    top: unset
    left: unset
    padding-top: 0
</style>
