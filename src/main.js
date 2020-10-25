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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
