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
export const deleteUser = userId => HttpRequest.get('/user/info/' + userId)