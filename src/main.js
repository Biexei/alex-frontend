// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VCharts from 'v-charts'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
// 后续版本改名了
// import 'element-ui/lib/theme-default/index.css'
import 'element-ui/lib/theme-chalk/index.css'
import JsonViewer from 'vue-json-viewer'

// 设置浏览器标题
router.beforeEach((to, from, next)=>{
  document.title = 'Alex'
  next()
})

Vue.config.productionTip = false

Vue.use(ElementUI);

Vue.use(JsonViewer);

Vue.use(VCharts)



/** 权限指令,对按钮权限的控制 **/
Vue.directive('has', {
  inserted: function(el, binding) {
    if (!Vue.prototype.$_has(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
})
// 权限检查方法（且把该方法添加到vue原型中）
Vue.prototype.$_has = function(value) {
  let isExist = false
  // 从浏览器缓存中获取权限数组（该数组在登入成功后拉取用户的权限信息时保存在浏览器的缓存中）
  var userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  var permission = userInfo.permission
  if (permission === undefined || permission == null) {
    return false
  }
  if (permission.indexOf(value) >= 0) {
    // 若在按钮中定义的权限字段能在后端返回的权限数组中能找到，则该按钮可显示
    isExist = true
  }
  return isExist
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

