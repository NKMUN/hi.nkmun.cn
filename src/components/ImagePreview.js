import _ImagePreview from './ImagePreview.vue'
import Vue from 'vue'

const ImagePreview = Vue.extend(_ImagePreview)

export default (url, opts = {}) => {
  let vm = new ImagePreview({ propsData: { url, ...opts } }).$mount(document.body.appendChild(document.createElement('div')))
  vm.$once('close', () => {
    setTimeout(() => {
      vm.$destroy()
      document.body.removeChild(vm.$el)
    }, 500)
  })
}
