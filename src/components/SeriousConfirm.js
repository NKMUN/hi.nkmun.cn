import _SeriousConfirm from './SeriousConfirm.vue'
import Vue from 'vue'
import merge from '../lib/merge-option'

const SeriousConfirm = Vue.extend(_SeriousConfirm)

const CHARACTERS = 'abcdefghijklmnopqrstuvwxyz'
function randomString(length=6, characters=CHARACTERS) {
  let str = ''
  for (let i=0; i!==length; ++i)
    str += characters[Math.floor(Math.random()*characters.length)]
  return str
}

export default (...arg) => {
  const defaultArg = {
    message: '请再次确认本操作',
    repeat: randomString(),
    type: 'warning'
  }

  let opts

  // default
  if (arg.length === 0)
    opts = merge(defaultArg, {})

  // legacy signature
  if (typeof arg[0] === 'string')
    opts = merge(defaultArg, {
      message: arg[0],
      repeat: arg[1],
      type: arg[2]
    })

  // new signature
  if (typeof arg[0] === 'object')
    opts = merge(defaultArg, arg[0])

  let vm = new SeriousConfirm({ propsData: opts }).$mount(document.body.appendChild(document.createElement('div')))

  return vm.open().then(result => {
    // destroy after dialog faded out
    setTimeout(() => {
      vm.$destroy()
      document.body.removeChild(vm.$el)
    }, 500)
    return result
  })
}
