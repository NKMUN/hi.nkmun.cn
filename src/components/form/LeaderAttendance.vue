<template>
  <el-form :class="className" placement="right">
    <el-form-item>
      <el-select
        :value="value"
        @input="emit"
        @change="emit"
        placeholder="领队是否参会？"
        :disabled="disabled"
      >
        <el-option
          label="领队在参会代表中"
          :value="true"
        />
        <el-option
          label="领队不在参会代表中"
          :value="false"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
import { Form, FormItem, Select, Option } from 'element-ui'
import Precondition from 'components/Precondition'

export default {
  name: 'leader-attendance',
  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Select.name]: Select,
    [Option.name]: Option,
  },
  props: {
    value: { type: Boolean },
    disabled: { type: Boolean, default: false },
    className: { type: String, default: '' },
  },
  methods: {
    emit(val) {
      this.$nextTick( () => {
        this.$emit('input', val)
        this.$emit('change', val)
      })
    },
  },
}
</script>
