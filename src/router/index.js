import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList');
const role = r => require.ensure([], () => r(require('@/page/role')), 'role');
const permission = r => require.ensure([], () => r(require('@/page/permission')), 'permission');
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
const ifReport = r => require.ensure([], () => r(require('@/page/ifReport')), 'ifReport');
const ifCase = r => require.ensure([], () => r(require('@/page/ifCase')), 'ifCase');
const caseTree = r => require.ensure([], () => r(require('@/page/caseTree')), 'caseTree');
const ifSuite = r => require.ensure([], () => r(require('@/page/ifSuite')), 'ifSuite');
const ifSuiteCaseList = r => require.ensure([], () => r(require('@/page/ifSuiteCaseList')), 'ifSuiteCaseList');
const httpSetting = r => require.ensure([], () => r(require('@/page/httpSetting')), 'httpSetting');
const email = r => require.ensure([], () => r(require('@/page/email')), 'email');
const proxy = r => require.ensure([], () => r(require('@/page/proxy')), 'proxy');
const task = r => require.ensure([], () => r(require('@/page/task')), 'task');
const timeout = r => require.ensure([], () => r(require('@/page/timeout')), 'timeout');
const loginLog = r => require.ensure([], () => r(require('@/page/loginLog')), 'loginLog');
const analysis = r => require.ensure([], () => r(require('@/page/analysis')), 'analysis');
const ifSuiteLog = r => require.ensure([], () => r(require('@/page/ifSuiteLog')), 'ifSuiteLog');
const tempEnv = r => require.ensure([], () => r(require('@/page/tempEnv')), 'tempEnv');

const report = r => require.ensure([], () => r(require('@/page/report')), 'report');
const reportSummary = r => require.ensure([], () => r(require('@/page/reportSummary')), 'reportSummary');
const reportDetail = r => require.ensure([], () => r(require('@/page/reportDetail')), 'reportDetail');
const reportChannel = r => require.ensure([], () => r(require('@/page/reportChannel')), 'reportChannel');

const dataFactory = r => require.ensure([], () => r(require('@/page/dataFactory')), 'dataFactory');

const feedbackList = r => require.ensure([], () => r(require('@/page/feedbackList')), 'feedbackList');
const myFeedback = r => require.ensure([], () => r(require('@/page/myFeedback')), 'myFeedback');


const mockNode = r => require.ensure([], () => r(require('@/page/mockNode')), 'mockNode');
const mockApi = r => require.ensure([], () => r(require('@/page/mockApi')), 'mockApi');

const stabilityCase = r => require.ensure([], () => r(require('@/page/stabilityCase')), 'stabilityCase');
const stabilityCaseLog = r => require.ensure([], () => r(require('@/page/stabilityCaseLog')), 'stabilityCaseLog');



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
      path: '/caseTree',
      component: caseTree,
      meta: {
        requireAuth: true
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
            path: ['????????????'],
            requireAuth: true
          },
        },
        {
          path: '/role',
          component: role,
          meta: {
            path: ['????????????'],
            requireAuth: true
          },
        },
        {
          path: '/permission',
          component: permission,
          meta: {
            path: ['????????????'],
            requireAuth: true
          },
        },
        {
          path: '/projectList',
          component: projectList,
          meta: {
            path: ['????????????'],
            requireAuth: true
          },
        },
        {
          path: '/moduleList',
          component: moduleList,
          meta: {
            path: ['????????????'],
            requireAuth: true
          },
        }, 
        {
          path: '/dbList',
          component: dbList,
          meta: {
            path: ['???????????????'],
            requireAuth: true
          },
        }, 
        {
          path: '/tempEnv',
          component: tempEnv,
          meta: {
            path: ['????????????','????????????'],
            requireAuth: true
          },
        }, 
        {
          path: '/ifRelyData',
          component: ifRelyData,
          meta: {
            path: ['????????????','????????????'],
            requireAuth: true
          },
        }, 
        {
          path: '/relySqlData',
          component: relySqlData,
          meta: {
            path: ['????????????','????????????','????????????'],
            requireAuth: true
          },
        }, 
        {
          path: '/relyInitMethodData',
          component: relyInitMethodData,
          meta: {
            path: ['????????????','????????????','????????????'],
            requireAuth: true
          },
        }, 
        {
          path: '/relyFixedData',
          component: relyFixedData,
          meta: {
            path: ['????????????','????????????','????????????'],
            requireAuth: true
          },
        }, 
        {
          path: '/relyData',
          component: relyData,
          meta: {
            path: ['????????????','????????????'],
            requireAuth: true
          },
        },   
        {
          path: '/executeLog',
          component: executeLog,
          meta: {
            path: ['????????????','????????????'],
            requireAuth: true
          },
        }, 
        {
          path: '/ifAssertLog',
          component: ifAssertLog,
          meta: {
            path: ['????????????','????????????'],
            requireAuth: true
          },
        }, 
        {
          path: '/ifReport',
          component: ifReport,
          meta: {
            path: ['????????????','????????????'],
            requireAuth: true
          },
        }, 
        {
          path: '/ifCase',
          component: ifCase,
          meta: {
            path: ['????????????','????????????'],
            requireAuth: true
          },
        },     
        {
          path: '/ifSuite',
          component: ifSuite,
          meta: {
            path: ['????????????','????????????'],
            requireAuth: true
          },
        },  
        {
          name: 'ifSuiteCaseList',
          path: '/ifSuiteCaseList',
          component: ifSuiteCaseList,
          meta: {
            path: ['????????????','????????????','????????????'],
            requireAuth: true
          },
        },  
        {
          name: 'ifSuiteLog',
          path: '/ifSuiteLog',
          component: ifSuiteLog,
          meta: {
            path: ['????????????','????????????','????????????'],
            requireAuth: true
          },
        }, 
        {
          name: 'stabilityCase',
          path: '/stabilityCase',
          component: stabilityCase,
          meta: {
            path: ['???????????????','????????????'],
            requireAuth: true
          },
        }, 
        {
          name: 'stabilityCaseLog',
          path: '/stabilityCaseLog',
          component: stabilityCaseLog,
          meta: {
            path: ['???????????????','????????????'],
            requireAuth: true
          },
        }, 
        {
          path: '/httpSetting',
          component: httpSetting,
          meta: {
            path: ['????????????','????????????'],
            requireAuth: true
          },
        },  
        {
          path: '/email',
          component: email,
          meta: {
            path: ['????????????','????????????'],
            requireAuth: true
          },
        },  
        {
          path: '/proxy',
          component: proxy,
          meta: {
            path: ['????????????','????????????'],
            requireAuth: true
          },
        }, 
        {
          path: '/task',
          component: task,
          meta: {
            path: ['????????????','????????????'],
            requireAuth: true
          },
        }, 
        {
          path: '/timeout',
          component: timeout,
          meta: {
            path: ['????????????','????????????'],
            requireAuth: true
          },
        }, 
        {
          path: '/loginLog',
          component: loginLog,
          meta: {
            path: ['????????????','????????????'],
            requireAuth: true
          },
        }, 
        {
          path: '/dataFactory',
          component: dataFactory,
          meta: {
            path: ['????????????'],
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
        {
          path: '/feedbackList',
          component: feedbackList,
          meta: {
            path: ['????????????','????????????'],
            requireAuth: true
          },
        }, 
        {
          path: '/myFeedback',
          component: myFeedback,
          meta: {
            path: ['????????????','????????????'],
            requireAuth: true
          },
        }, 
        {
          path: '/mockNode',
          component: mockNode,
          meta: {
            path: ['Mock','????????????'],
            requireAuth: true
          },
        }, 
        {
          path: '/mockApi',
          component: mockApi,
          meta: {
            path: ['Mock','????????????'],
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
  if (to.meta.requireAuth == true) { // ???????????????????????????????????????
      if (sessionStorage.getItem("isLogin")) {
          next() // ?????????
      } else {
          next({path:"/"})
      }
  } else {
      next()
  }
})