// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import superagent from 'superagent'
import superagentUse from 'superagent-use'
import { getToken } from '@/persistence/token'
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
    Submenu,
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
    MessageBox,
    Message,
    Scrollbar,
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
Vue.use( Submenu )
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
Vue.use( Scrollbar )

import RefreshButton from '@/components/RefreshButton'
Vue.component('RefreshButton', RefreshButton)

import Logout from '@/components/Logout'
Vue.component('Logout', Logout)

import SeriousConfirm from '@/components/SeriousConfirm.js'

Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$serious = SeriousConfirm
Vue.prototype.$message = (opts) => Message({ ...opts, showClose: true })

import Icon from 'vue-awesome/components/Icon'
Vue.component('Icon', Icon)

let token = getToken()
if (token) {
    store.commit('user/token', token)
}

// superagent:
// 1. automatic authorization injection
// 2. body(), blob() method
Vue.prototype.$agent = superagentUse(superagent)
Vue.prototype.$agent.use(req => {
    const token = store.getters['user/token']
    token && req.auth(token, null, {type: 'bearer'})
})
Vue.prototype.$agent.use(req => {
    req.body = () => new Promise((resolve, reject) =>
        req.then(
            res => resolve(res.body),
            reject
        )
    )
    req.blob = () => req.responseType('blob').body()
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
