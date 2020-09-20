/**
 * 异步HTTP请求封装类
 *
 */
import axios from 'axios'
import qs from 'qs'
import { baseUrl } from './env'

export default class HttpRequest {
  static requireParams = '';
  
  /* 设置必传参数 */
  static setRequireParams(param){
    this.requireParams = param;
  }n

  /* 配置请求头部 */
  static _getInsideConfig(method = "get", json) {
    let config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    if (method != 'get') {
      config = {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      }
    }
    if (json == true) {
      console.log("json")
      config = {
        headers: {
          'content-type': 'application/json;charset=utf-8'
        }
      }
    }
    return config
  }

  /**
   * @param {*} instance
   * @param {*} url
   * @param {*} retParent 是否原样返回
   */
  static _interceptors(instance, url, retOrigin, json) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      //获取必须参数
      if(this.requireParams != ""){
        let extraPram = this.requireParams;
        if(config.method == 'post' && !json){
          config.data = config.data ? config.data+"&"+qs.stringify(extraPram) : qs.stringify(extraPram);
        }else{
          Object.assign(config.params, extraPram)
        }
      }
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      const { data, status } = res
      if (this.isSuccess(data)) {
        if (retOrigin) {
          return data
        }
        if (data.datas) {
          return data.datas;
        } else if (data.data) {
          return data.data;
        } else {
          return null
        }
      } else {
        return data
      }
    }, error => {
      return Promise.reject(error)
    })
  }

  //项目内部接口请求
  static _request(options, retOrigin, json) {
    const instance = axios.create()
    options = Object.assign(this._getInsideConfig(options.method, json), options)
    this._interceptors(instance, options.url, retOrigin, json)
    return instance(options)
  }


  //请求项目外部接口，如腾讯地图
  static requestExtranal(options) {
    const instance = axios.create()
    return instance(options)
  }

  static uploadFileRequest(options) {
    const instance = axios.create()
    options = Object.assign(this._getInsideConfig(), options)
    return instance(options)
  }

  /**
   * 判断请求是否成功
   */
  static isSuccess (res) {
    const code = res.code;
    if (code.toString() !== '200') {
      return false;
    }
    return true;
  }

  /**
   * 异常
   */
  static requestException (res) {
    return res;
  }

  /* 请求接口 */
  static get(url, data= {}, retOrigin = true) {
    return this._request({
      url: baseUrl + url,
      method: 'get',
      params: data
    },retOrigin)
  }
  static post(url, data = {}, retOrigin = true, json=false) {
    if (!json) {
      return this._request({
        url: baseUrl + url,
        method: 'post',
        params: {},
        data: qs.stringify(data)
      }, retOrigin, json)
    } else {
      return this._request({
        url: baseUrl + url,
        method: 'post',
        params: {},
        data: data
      }, retOrigin, json)  
    }
  }
  /* 上传文件接口 */
  static postFile(url, data= {}, formData, retOrigin = true) {
    
    return this.uploadFileRequest({
      url: baseUrl + url,
      method: 'post',
      processData: false,
      data: formData,
      params: Object.assign({}, data, this.requireParams),
      headers: {
        'Content-Type': 'multipart/form-data;boundary = ' + new Date().getTime()
      }
    }, retOrigin)
  }

}
