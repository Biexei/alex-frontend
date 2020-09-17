import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList');
const projectList = r => require.ensure([], () => r(require('@/page/projectList')), 'projectList');
const moduleList = r => require.ensure([], () => r(require('@/page/moduleList')), 'moduleList');
const dbList = r => require.ensure([], () => r(require('@/page/dbList')), 'dbList');
const ifRelyData = r => require.ensure([], () => r(require('@/page/ifRelyData')), 'ifRelyData');
const relyData = r => require.ensure([], () => r(require('@/page/relyData')), 'relyData');

export default new Router({
  routes: [
    {
      path: '/',
      component: login
    },
    {
      path: '/manage',
      component: manage,
      name: '',
      children: [
        {
          path: '/userList',
          component: userList,
          meta: ['用户管理'],
        },
        {
          path: '/projectList',
          component: projectList,
          meta: ['项目管理'],
        },
        {
          path: '/moduleList',
          component: moduleList,
          meta: ['模块管理'],
        }, 
        {
          path: '/dbList',
          component: dbList,
          meta: ['数据源中心'],
        }, 
        {
          path: '/ifRelyData',
          component: ifRelyData,
          meta: ['数据中心','接口依赖'],
        }, 
        {
          path: '/relyData',
          component: relyData,
          meta: ['数据中心','自定义依赖'],
        },         
      ],
    }  
  ],
  strict: process.env.NODE_ENV !== 'production',
})
