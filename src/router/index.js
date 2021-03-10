import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList');
const role = r => require.ensure([], () => r(require('@/page/role')), 'role');
const projectList = r => require.ensure([], () => r(require('@/page/projectList')), 'projectList');
const moduleList = r => require.ensure([], () => r(require('@/page/moduleList')), 'moduleList');
const dbList = r => require.ensure([], () => r(require('@/page/dbList')), 'dbList');
const ifRelyData = r => require.ensure([], () => r(require('@/page/ifRelyData')), 'ifRelyData');
const relySqlData = r => require.ensure([], () => r(require('@/page/relySqlData')), 'relySqlData');
const relyInitMethodData = r => require.ensure([], () => r(require('@/page/relyInitMethodData')), 'relyInitMethodData');
const relyFixedData = r => require.ensure([], () => r(require('@/page/relyFixedData')), 'relyFixedData');
const relyData = r => require.ensure([], () => r(require('@/page/relyData')), 'relyData');
const executeLog = r => require.ensure([], () => r(require('@/page/executeLog')), 'executeLog');
const ifAssertLog = r => require.ensure([], () => r(require('@/page/ifAssertLog')), 'ifAssertLog');
const ifCase = r => require.ensure([], () => r(require('@/page/ifCase')), 'ifCase');
const ifSuite = r => require.ensure([], () => r(require('@/page/ifSuite')), 'ifSuite');
const ifSuiteCaseList = r => require.ensure([], () => r(require('@/page/ifSuiteCaseList')), 'ifSuiteCaseList');
const httpSetting = r => require.ensure([], () => r(require('@/page/httpSetting')), 'httpSetting');
const email = r => require.ensure([], () => r(require('@/page/email')), 'email');
const proxy = r => require.ensure([], () => r(require('@/page/proxy')), 'proxy');
const task = r => require.ensure([], () => r(require('@/page/task')), 'task');
const analysis = r => require.ensure([], () => r(require('@/page/analysis')), 'analysis');
const ifSuiteLog = r => require.ensure([], () => r(require('@/page/ifSuiteLog')), 'ifSuiteLog');
const tempEnv = r => require.ensure([], () => r(require('@/page/tempEnv')), 'tempEnv');

const report = r => require.ensure([], () => r(require('@/page/report')), 'report');
const reportSummary = r => require.ensure([], () => r(require('@/page/reportSummary')), 'reportSummary');
const reportDetail = r => require.ensure([], () => r(require('@/page/reportDetail')), 'reportDetail');
const reportChannel = r => require.ensure([], () => r(require('@/page/reportChannel')), 'reportChannel');

const dataFactory = r => require.ensure([], () => r(require('@/page/dataFactory')), 'dataFactory');



const router = new Router({
  routes: [
    {
      path: '/',
      component: login,
      meta: {
        requireAuth: false
      },
    },
    {
      path: '/report',
      component: report,
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: '',
          name: 'reportSummary',
          component: reportSummary,
          meta: {
            requireAuth: true
          },
        },
        {
          path: '/reportDetail',
          name: 'reportDetail',
          component: reportDetail,
          meta: {
            requireAuth: true
          },
        }, 
        {
          path: '/reportChannel',
          name: 'reportChannel',
          component: reportChannel,
          meta: {
            requireAuth: true
          },
        }, 
      ]
    }, 
    {
      path: '/manage',
      component: manage,
      name: '',
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: '/userList',
          component: userList,
          meta: {
            path: ['用户管理'],
            requireAuth: true
          },
        },
        {
          path: '/role',
          component: role,
          meta: {
            path: ['角色管理'],
            requireAuth: true
          },
        },
        {
          path: '/projectList',
          component: projectList,
          meta: {
            path: ['项目管理'],
            requireAuth: true
          },
        },
        {
          path: '/moduleList',
          component: moduleList,
          meta: {
            path: ['模块管理'],
            requireAuth: true
          },
        }, 
        {
          path: '/dbList',
          component: dbList,
          meta: {
            path: ['数据源中心'],
            requireAuth: true
          },
        }, 
        {
          path: '/tempEnv',
          component: tempEnv,
          meta: {
            path: ['数据中心','临时变量'],
            requireAuth: true
          },
        }, 
        {
          path: '/ifRelyData',
          component: ifRelyData,
          meta: {
            path: ['数据中心','接口依赖'],
            requireAuth: true
          },
        }, 
        {
          path: '/relySqlData',
          component: relySqlData,
          meta: {
            path: ['数据中心','其他依赖','查询语句'],
            requireAuth: true
          },
        }, 
        {
          path: '/relyInitMethodData',
          component: relyInitMethodData,
          meta: {
            path: ['数据中心','其他依赖','预置方法'],
            requireAuth: true
          },
        }, 
        {
          path: '/relyFixedData',
          component: relyFixedData,
          meta: {
            path: ['数据中心','其他依赖','固定字符'],
            requireAuth: true
          },
        }, 
        {
          path: '/relyData',
          component: relyData,
          meta: {
            path: ['数据中心','其它依赖'],
            requireAuth: true
          },
        },   
        {
          path: '/executeLog',
          component: executeLog,
          meta: {
            path: ['接口测试','执行日志'],
            requireAuth: true
          },
        }, 
        {
          path: '/ifAssertLog',
          component: ifAssertLog,
          meta: {
            path: ['接口测试','断言日志'],
            requireAuth: true
          },
        }, 
        {
          path: '/ifCase',
          component: ifCase,
          meta: {
            path: ['接口测试','测试用例'],
            requireAuth: true
          },
        },     
        {
          path: '/ifSuite',
          component: ifSuite,
          meta: {
            path: ['接口测试','测试套件'],
            requireAuth: true
          },
        },  
        {
          name: 'ifSuiteCaseList',
          path: '/ifSuiteCaseList',
          component: ifSuiteCaseList,
          meta: {
            path: ['接口测试','测试套件','用例维护'],
            requireAuth: true
          },
        },  
        {
          name: 'ifSuiteLog',
          path: '/ifSuiteLog',
          component: ifSuiteLog,
          meta: {
            path: ['接口测试','测试套件','执行日志'],
            requireAuth: true
          },
        }, 
        {
          path: '/httpSetting',
          component: httpSetting,
          meta: {
            path: ['配置中心','全局配置'],
            requireAuth: true
          },
        },  
        {
          path: '/email',
          component: email,
          meta: {
            path: ['配置中心','邮箱管理'],
            requireAuth: true
          },
        },  
        {
          path: '/proxy',
          component: proxy,
          meta: {
            path: ['配置中心','代理配置'],
            requireAuth: true
          },
        }, 
        {
          path: '/task',
          component: task,
          meta: {
            path: ['配置中心','定时任务'],
            requireAuth: true
          },
        },  
        {
          path: '/dataFactory',
          component: dataFactory,
          meta: {
            path: ['数据工厂'],
            requireAuth: true
          },
        },  
        {
          path: '/analysis',
          component: analysis,
          meta: {
            path: [],
            requireAuth: true
          },
        },    
      ],
    }  
  ],
  strict: process.env.NODE_ENV !== 'production',
})

export default router
router.beforeEach((from, to, next) => {
  if (to.meta.requireAuth == true) { // 判断跳转的路由是否需要登录
      if (sessionStorage.getItem("isLogin")) {
          next() // 已登录
      } else {
          next({path:"/"})
      }
  } else {
      next()
  }
})