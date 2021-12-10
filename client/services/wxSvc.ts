/**
 * @ Author: xcs
 * @ Create Time: 2020-10-21 11:23:05
 * @ Modified by: xcs
 * @ Modified time: 2020-10-21 15:04:24
 * @ Description: 微信api接口服务
 */

import BaseSvc from './BaseSvc';
import qs from 'querystring';

class WxSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/wx';
  }

  /**
   * 绑定账号
   * @param userName 用户名
   * @param password 密码
   * @param openid
   */
  async bindAccount(userName: string, password: string, openid: string) {
    const queryString = qs.stringify({
      userName,
      password,
      openid,
    });
    const { data } = await this.api.post(`/bindAccount`, queryString);
    return data;
  }

  /**
   * 获取用户信息
   * @param openid
   */
  async getUserInfo(openid: string) {
    const { data } = await this.api.get(`/getUserInfo/${openid}`);
    return data;
  }

  /**
   * 配置信息
   */
  async jsConfig() {
    const { data } = await this.api.get(`/jsConfig`);
    return data;
  }
}

const wxSvc = new WxSvc();
export default wxSvc;
