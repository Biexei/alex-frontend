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
 * 修改密码
 */
 export const changePwd = data => HttpRequest.post('/user/pwd/change', data);

/**
 * 用户列表
 */
export const logout = () => HttpRequest.get('/user/logout');

/**
 * 删除用户
 */
export const deleteUser = userId => HttpRequest.get('/user/remove/' + userId)

/**
 * 重置密码
 */
export const pwdReset = userId => HttpRequest.get('/user/reset/' + userId)

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
export const addUser = data => HttpRequest.post('/user/save', data);

/**
 * 用户注册
 */
export const registerUser = data => HttpRequest.post('/user/register', data, true, true);




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
 *  获取接口执行日志(测试报告专用)
 */
export const findInterfaceCaseExecuteLogForReportList = data => HttpRequest.get('/interface/report/log/list', data)

/**
 * 获取接口执行日志详情
 */
export const findInterfaceCaseExecuteLog = executeId => HttpRequest.get('/interface/log/' + executeId)

/**
 * 获取执行用例的调用链
 */
export const caseExecuteLogChain = executeId => HttpRequest.get('/interface/log/chain/' + executeId)

/**
 * 获取指定suiteLogNo的执行记录，不分页
 */
export const findReportChain = suiteLogNo => HttpRequest.get('/interface/log/list/chain/' + suiteLogNo)



/**
 * 
 * 获取接口断言日志
 */
export const listInterfaceAssertLog = data => HttpRequest.get('/interface/assert/log', data)


/**
 * 下载导入模版
 */
export const downloadTemplate = data => HttpRequest.get('/interface/template/download/' + data)

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




/**
 * 新增测试套件
*/ 
export const saveInterfaceCaseSuite = data => HttpRequest.post('/interface/suite/save', data, true, true)

/**
 * 修改测试套件
*/ 
export const modifyInterfaceCaseSuite = data => HttpRequest.post('/interface/suite/modify', data, true, true)

/**
 * 删除测试套件
 */
export const removeInterfaceCaseSuiteById = suiteId => HttpRequest.get('/interface/suite/remove/' + suiteId)

/**
 * 查看测试套件详情
 */
export const findInterfaceCaseSuiteById = suiteId => HttpRequest.get('/interface/suite/' + suiteId)

/**
 * 查看测试套件列表
*/ 
export const findInterfaceCaseSuite = data => HttpRequest.get('/interface/suite', data)

/**
 * 查看测试套件列表
*/ 
export const findInterfaceCaseSuiteAll = data => HttpRequest.get('/interface/suiteAll', data)

/**
 * 测试套件新增用例
 */
export const saveSuiteCase = data => HttpRequest.post('/interface/suite/case/save', data, true, true)

/**
 * 测试套件修改用例
 */
export const modifySuiteCase = data => HttpRequest.post('/interface/suite/case/modify', data)

/**
 * 测试套件删除用例
 */
export const removeSuiteCase = id => HttpRequest.get('/interface/suite/case/remove/' + id)

/**
 * 测试套件删除用例
 */
export const removeSuiteCaseByObject = data => HttpRequest.post('/interface/suite/case/remove', data)

/**
 * 查看测试套件包含的测试用例
 */
export const findSuiteCaseList = data => HttpRequest.get('/interface/suite/case', data)

/**
 * 查看测试套件包含的所有测试用例
 */
export const findAllSuiteCase = data => HttpRequest.get('/interface/suite/case/all', data)

/**
 * 执行测试套件
 */
export const executeSuiteCase = suiteId => HttpRequest.get('/interface/suite/execute/' + suiteId)

/**
 * 执行测试套件中某一个用例
 */
export const executeCaseInSuite = data => HttpRequest.get('/interface/suite/execute-case', data)

/**
 * 复制测试套件
 */
export const copyInterfaceCaseSuiteById = suiteId => HttpRequest.get('/interface/suite/copy/' + suiteId)



/**
 * 查看http设置详情
 */
export const findHttpSettingById = settingId => HttpRequest.get('/setting/' + settingId)


/**
 * 查看http设置列表
 */
export const findHttpSetting = data => HttpRequest.get('/setting', data)


/**
 * 添加http设置
 */
export const saveHttpSetting = data => HttpRequest.post('/setting/save', data)


/**
 * 修改http设置
 */
export const modifyHttpSetting = data => HttpRequest.post('/setting/modify', data)


/**
 * 删除http设置
 */
export const removeHttpSettingById = settingId => HttpRequest.get('/setting/remove/' + settingId)



/**
 * 定时任务列表
 */
export const findTaskList = data => HttpRequest.get('/task/list', data)

/**
 * 定时任务详情
 */
export const findTaskById = taskId => HttpRequest.get('/task/' + taskId)

/**
 * 新增定时任务
 */
export const saveTaskAndRef = data => HttpRequest.post('/task/save', data, true, true)

/**
 * 修改定时任务
 */
export const modifyTask = data => HttpRequest.post('/task/modify', data, true, true)

/**
 * 删除定时任务
 */
export const removeTask = taskId => HttpRequest.get('/task/remove/' + taskId)

/**
 * 定时任务添加邮箱
 */
export const saveTaskEmailRef = data => HttpRequest.post('/task/ref/save', data)

/**
 * 定时任务删除邮箱
 */
export const removeTaskEmailRef = data => HttpRequest.get('/task/ref/remove', data)

/**
 * 查询所有邮箱
 */
export const findAllEmail = () => HttpRequest.get('/setting/email/all')



/**
 * 统计数据，用户总数，套件总数，断言总数，用例总数
 */
export const countAll = () => HttpRequest.get('/count')

/**
 * 统计数据，用户总数，套件总数，断言总数，用例总数
 */
export const countGroup = () => HttpRequest.get('/count/group')

/**
 * 统计数据，统计近7天用户注册数
 */
export const registerWeek = () => HttpRequest.get('/week/register')

/**
 * 统计数据，近7天用例新增数
 */
export const caseWeek = () => HttpRequest.get('/week/case')

/**
 * 统计数据，近7天断言新增数
 */
export const assertWeek = () => HttpRequest.get('/week/assert')

/**
 * 统计数据，近7天测试套件新增数
 */
export const suiteWeek = () => HttpRequest.get('/week/suite')

/**
 * 统计数据，近7天用例执行情况统计
 */
export const executeLogWeek = () => HttpRequest.get('/week/executeLog')

/**
 * 统计数据，近7天断言执行情况统计
 */
export const assertLogWeek = () => HttpRequest.get('/week/assertLog')




/**
 * 查询测试套件执行日志列表
 */
export const findIfSuiteLog = data => HttpRequest.get('/suite/log', data)

/**
 * 根据编号查询测试套件执行日志
 */
export const findIfSuiteLogByNo = suiteLogNo => HttpRequest.get('/suite/log/no/' + suiteLogNo)

/**
 * 根据测试套件执行日志编号查询日志详情
 */
export const findIfSuiteLogById = id => HttpRequest.get('/suite/log/' + id)

/**
 * 根据项目 模块统计执行情况
 */
export const findSuiteLogSummary = suiteLogNo => HttpRequest.get('/suite/summary/' + suiteLogNo)


/**
 * 统计测试报告首页测试套件执行情况
 */
export const findSuiteReportAssert = suiteLogNo => HttpRequest.get('/suite/assert/log/' + suiteLogNo)


/**
 * 获取所有的临时后置处理器值
 */
export const findAllTempValue = data => HttpRequest.get('/env', data)

/**
 * 移除指定临时后置处理器值
 */
export const removeTempValue = key => HttpRequest.get('/env/remove/' + key)

/**
 * 移除全部临时后置处理器值
 */
export const removeAllTempValue = () => HttpRequest.get('/env/removeAll')



/**
 * 新增数据工厂
 */
export const saveDataFactory = data => HttpRequest.post('/data/factory/save', data)

/**
 * 修改数据工厂
 */
export const modifyDataFactory = data => HttpRequest.post('/data/factory/modify', data)

/**
 * 删除数据工厂
 */
export const removeDataFactoryById = id => HttpRequest.get('/data/factory/remove/' + id)

/**
 * 获取数据工厂详情
 */
export const findDataFactoryById = id => HttpRequest.get('/data/factory/' + id)

/**
 * 获取数据工厂列表
 */
export const findDataFactoryList = data => HttpRequest.get('/data/factory', data)

/**
 * 执行数据工厂
 */
export const executeDataFactory = id => HttpRequest.get('/data/factory/execute/' + id)




/**
 * 查看角色列表（分页）
 */
 export const findRole = data => HttpRequest.get('/role', data)

 /**
 * 查看角色列表（全部）
 */
  export const findAllRole = data => HttpRequest.get('/role/all', data)

 /**
  * 查看角色详情
  */
 export const findRoleById = roleId => HttpRequest.get('/role/' + roleId)
 
 
 /**
  * 修改角色信息
  */
 export const modifyRole = data => HttpRequest.post('/role/modify', data)

  /**
  * 新增角色信息
  */
   export const saveRole = data => HttpRequest.post('/role/save', data)
 
 
 /**
  * 删除角色信息
  */
 export const removeRoleById = roleId => HttpRequest.get('/role/remove/' + roleId)

  /**
  * 查询角色已有权限
  */
   export const findPermissionIdArrayByRoleId = roleId => HttpRequest.get('/role/permission/' + roleId)

 /**
  * 为角色新增权限
  */
  export const saveRolePermission = data => HttpRequest.post('/role/permission/save', data)

  /**
  * 为角色删除权限
  */
   export const removeRolePermission = data => HttpRequest.post('/role/permission/remove', data)




  /**
  * 查看所有权限
  */
  export const findAllPermission = () => HttpRequest.get('/permission')

  /**
  * 详情
  */
   export const findPermissionById = id => HttpRequest.get('/permission/' + id)

  /**
  * 新增权限
  */
  export const savePermission = data => HttpRequest.post('/permission/save', data)

  /**
  * 修改权限
  */
  export const modifyPermission = data => HttpRequest.post('/permission/modify', data)


  /**
  * 删除权限
  */
  export const removePermissionById = id => HttpRequest.get('/permission/remove/' + id)