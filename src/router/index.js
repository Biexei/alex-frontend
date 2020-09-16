import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList');
const projectList = r => require.ensure([], () => r(require('@/page/projectList')), 'projectList');

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
        }
      ],
    }  
  ],
  strict: process.env.NODE_ENV !== 'production',
})
