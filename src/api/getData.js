import fetch from '@/config/fetch'

/**
 * 登录
 */

export const login = data => fetch('/user/login', data, 'POST', 'POST');

/**
 * 用户列表
 */
export const userList = data => fetch('/user/list', data, 'GET');