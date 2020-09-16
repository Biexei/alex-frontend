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
 * 查看项目下所有模块
 */
export const findModulesByPeojectId = projectId => HttpRequest.get('/project/modules/' + projectId)

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
export const removeModule = projectId => HttpRequest.get('/project/remove/' + projectId)

/**
 * 查询模块
 */
export const findProjectModuleList = data => HttpRequest.get('/module/list', data)