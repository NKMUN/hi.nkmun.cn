// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import superagent from 'superagent'
import { getToken } from 'persistence/token'
import {
    Alert,
    Button,
    ButtonGroup,
    Card,
    Checkbox,
    DatePicker,
    Dialog,
    Form,
    FormItem,
    Input,
    InputNumber,
    Menu,
    MenuItem,
    MenuItemGroup,
    Option,
    OptionGroup,
    Radio,
    RadioGroup,
    Select,
    Step,
    Steps,
    Table,
    TableColumn,
    Tag,
    Tooltip,
    Notification,
    Loading,
    MessageBox
} from 'element-ui'

Vue.use( Alert )
Vue.use( Button )
Vue.use( ButtonGroup )
Vue.use( Card )
Vue.use( Checkbox )
Vue.use( DatePicker )
Vue.use( Dialog )
Vue.use( Form )
Vue.use( FormItem )
Vue.use( Input )
Vue.use( InputNumber )
Vue.use( Menu )
Vue.use( MenuItem )
Vue.use( MenuItemGroup )
Vue.use( Option )
Vue.use( OptionGroup )
Vue.use( Radio )
Vue.use( RadioGroup )
Vue.use( Select )
Vue.use( Step )
Vue.use( Steps )
Vue.use( Table )
Vue.use( TableColumn )
Vue.use( Tag )
Vue.use( Tooltip )
Vue.use( Loading )

Vue.prototype.$agent = superagent
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification

let token = getToken()
if (token) {
    store.commit('user/token', token)
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
