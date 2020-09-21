import HttpRequest from '@/config/requests'

/**
 * 登录
 */

export const login = data => HttpRequest.post('/user/login', data);

/**
 * 用户列表
 */
export const userList = data => HttpRequest.get('/user/list', data);

/**
 * 删除用户
 */
export const deleteUser = userId => HttpRequest.get('/user/remove/' + userId)

/**
 * 用户详情
 */
export const getUserInfo = userId => HttpRequest.get('/user/info/' + userId)

/**
 * 修改用户信息
 */
export const modifyUserInfo = data => HttpRequest.post('/user/update', data);

/**
 * 新增用户
 */
export const addUser = data => HttpRequest.post('/user/register', data);




/**
 * 查询项目列表
 */
export const getProjectList = data => HttpRequest.get('/project/list', data);

/**
 * 查询全部项目列表
 */
export const getAllProject = data => HttpRequest.get('/project/all', data);

/**
 * 查看项目下所有模块
 */
export const findModulesByProjectId = projectId => HttpRequest.get('/project/modules/' + projectId)

/**
 * 查看项目信息
 */
export const getProject = data => HttpRequest.get('/project/info', data)

/**
 * 新增项目
 */
export const saveProject = data => HttpRequest.post('/project/save', data)

/**
 * 修改项目
 */
export const modifyProject = data => HttpRequest.post('/project/modify', data)

/**
 * 删除项目
 */
export const deleteProject = projectId => HttpRequest.get('/project/remove/' + projectId)




/**
 * 新增模块
 */
export const saveModule = data => HttpRequest.post('/module/save', data)

/**
 * 修改模块
 */
export const modifyModule = data => HttpRequest.post('/module/modify', data)

/**
 * 删除模块
 */
export const removeModule = projectId => HttpRequest.get('/module/remove/' + projectId)

/**
 * 查询模块
 */
export const findProjectModuleList = data => HttpRequest.get('/module/list', data)




/**
 * 添加数据源
 */
export const saveDb = data => HttpRequest.post('/db/save', data)

/**
 * 修改数据源
 */
export const modifyDb = data => HttpRequest.post('/db/modify', data)

/**
 * 查看数据源详情
 */
export const findDbById = dbId => HttpRequest.get('/db/' + dbId)

/**
 * 查询数据源
 */
export const findDbList = data => HttpRequest.get('/db', data)

/**
 * 删除数据源
 */
export const removeDb = dbId => HttpRequest.get('/db/remove/' + dbId)

/**
 * 预检数据源
 */
export const checkDb = dbId => HttpRequest.get('/db/check/' + dbId)




/**
 * 新增接口数据依赖
 */
export const saveIfRelyData = data => HttpRequest.post('/interface/rely/save', data)

/**
 * 修改接口数据依赖
 */
export const modifyIfRelyData = data => HttpRequest.post('/interface/rely/modify', data)

/**
 * 获取接口数据依赖详情
 */
export const findIfRelyData = relyId => HttpRequest.get('/interface/rely/' + relyId)

/**
 * 获取接口数据依赖列表
 */
export const findIfRelyDataList = data => HttpRequest.get('/interface/rely', data)

/**
 * 删除接口数据依赖
 */
export const removeIfRelyData = relyId => HttpRequest.get('/interface/rely/remove/' + relyId)

/**
 * 预检接口数据依赖
 */
export const checkIfRelyData = relyId => HttpRequest.get('/interface/rely/check/' + relyId)





/**
 * 新增其它依赖
 */
export const saveRelyData = data => HttpRequest.post('/rely/save', data)

/**
 * 修改其它依赖
 */
export const modifyRelyData = data => HttpRequest.post('/rely/modify', data)

/**
 * 获取其它依赖详情
 */
export const findRelyDataById = relyId => HttpRequest.get('/rely/' + relyId)

/**
 * 获取其它依赖列表
 */
export const findRelyDataList = data => HttpRequest.get('/rely', data)

/**
 * 删除其它依赖
 */
export const removeRelyData = relyId => HttpRequest.get('/rely/remove/' + relyId)




/**
 *  获取接口执行日志
 */
export const findInterfaceCaseExecuteLogList = data => HttpRequest.get('/interface/log/list', data)

/**
 * 获取接口执行日志详情
 */
export const findInterfaceCaseExecuteLog = executeId => HttpRequest.get('/interface/log/' + executeId)




/**
 * 
 * 获取接口断言日志
 */
export const listInterfaceAssertLog = data => HttpRequest.get('/interface/assert/log', data)




/**
 * 查询用例列表
 */
export const listInterfaceCase = data => HttpRequest.get('/interface/case/list', data)

/**
 * 插入接口测试用例
 */
export const saveInterfaceCase = data => HttpRequest.post('/interface/case/save', data, true, true)

 /**
  * 修改接口测试用例
  */
 export const modifyInterfaceCase = data => HttpRequest.post('/interface/case/modify', data, true, true) 

/**
 * 删除接口测试用例
 */
export const removeInterfaceCase = interfaceCaseId => HttpRequest.get('/interface/case/remove/' + interfaceCaseId)

/**
 * 查看接口测试用例详情
 */
export const findInterfaceCaseByCaseId = interfaceCaseId => HttpRequest.get('/interface/case/info/' + interfaceCaseId)

/**
 * 执行接口测试用例
*/ 
export const executeInterfaceCase = interfaceCaseId => HttpRequest.get('/interface/case/execute/' + interfaceCaseId)