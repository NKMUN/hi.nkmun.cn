<template>
  <div>

    <Precondition
      :loader="configLoader"
      @loaded="configParser"
    />

    <div class="service-agreement" v-if="serviceAgreement">

      <p>请阅读并确认以下服务协议：</p>

      <div v-html="serviceAgreement" />

      <el-form
        :class="className"
        :model="M"
        ref="form"
      >
        <el-form-item
          prop="checked"
          :rules="validator"
        >
          <el-checkbox v-model="checked" @change="emit"> <b>我理解并同意以上服务协议</b> </el-checkbox>
        </el-form-item>
      </el-form>

    </div>

  </div>
</template>

<script>
import { Form, FormItem, Checkbox } from 'element-ui'
import Precondition from 'components/Precondition'

export default {
  name: 'service-agreement',
  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Checkbox.name]: Checkbox,
    Precondition
  },
  props: {
    value: { type: Boolean },
    disabled: { type: Boolean, default: false },
    className: { type: String, default: '' },
  },
  data: () => ({
    serviceAgreement: null,
    checked: false,
    validator: {
      validator(r, v, cb) {
        return
        if ( v!== true )
          cb([ new Error('你必须同意许可协议才能继续') ])
        else
          cb([])
      }
    }
  }),
  computed: {
    M() { return { checked: this.checked } }
  },
  methods: {
    configLoader() {
      return this.$agent.get('/api/service-agreement').then( res => res.body )
    },
    configParser(config) {
      this.serviceAgreement = config.html
    },
    emit() {
      this.$nextTick( () => {
        this.$emit('input', this.checked)
        this.$emit('change', this.checked)
      })
    },
    reset() {
      this.setValue(null)
      this.emit()
    },
    validate() {
      return new Promise( resolve => {
        this.$refs.form.validate( resolve )
      })
    },
    setValue(value) {
      this.checked = value || false
      if (this.$mounted)
        this.$refs.form.resetFields()
    }
  },
  watch: {
    value(value) {
      this.setValue(value)
    }
  },
  created() {
    this.setValue(this.value)
  }
}
</script>
