import Vue from 'vue'
import Router from 'vue-router'
import ColorPickerDemo from '@/components/ColorPickerDemo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'pickerdemo',
      component: ColorPickerDemo
    }
  ]
})
