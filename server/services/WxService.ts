/**
 * @ Author: xcs
 * @ Create Time: 2020-10-20 13:43:21
 * @ Modified by: xcs
 * @ Modified time: 2020-10-30 15:08:20
 * @ Description: 微信相关服务，账号绑定
 */

import { CONFIG_WX } from '../config';
import { reject } from 'lodash';
import { TokenModel } from '../services/mongoose-models/wx_token';
import { BindModel } from '../services/mongoose-models/wx_bind';
import WechatAuth from 'wechat-oauth';
import WechatApi from 'co-wechat-api';
import redisService from './RedisService';
import _ from 'lodash';

type resolveType = (r: any) => void;
type rejectType = (e: any) => void;

class WxService {
  private auth: WechatAuth;
  private api: WechatApi;
  constructor() {
    this.api = new WechatApi(
      CONFIG_WX.appid,
      CONFIG_WX.appsecret,
      async function () {
        const token = await redisService.client.get(
          `wx_token_${CONFIG_WX.appid}`
        );
        return JSON.parse(token);
      },
      async function (token: any) {
        const tokens = await redisService.client.set(
          `wx_token_${CONFIG_WX.appid}`,
          JSON.stringify(token)
        );
      }
    );
    this.auth = new WechatAuth(
      CONFIG_WX.appid,
      CONFIG_WX.appsecret,
      async function (openid: string, callback: any) {
        // 传入一个根据openid获取对应的全局token的方法
        // 在getUser时会通过该方法来获取token
        callback(null, await TokenModel.getToken(openid));
        // const token = await redisService.client.get('wx_token');
        // return JSON.parse(token);
      },
      async function (openid: string, token: any, callback: any) {
        // 持久化时请注意，每个openid都对应一个唯一的token!
        await TokenModel.setToken(openid, token);
        callback(null);
        // const tokens = await redisService.client.set(
        //   'wx_token',
        //   JSON.stringify(token)
        // );
      }
    );
  }

  /**
   * 获取授权url
   * @param redirect 跳转地址
   * @param state 自定数据
   * @param scope snsapi_userinfo || snsapi_base
   */
  getAuthorizeURL(
    redirect: string,
    state: any,
    scope: 'snsapi_userinfo' | 'snsapi_base' = 'snsapi_base'
  ) {
    var querystring = require('querystring');
    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
    var info = {
      appid: CONFIG_WX.appid,
      redirect_uri: redirect,
      response_type: 'code',
      scope: scope || 'snsapi_base',
      state: state || '',
    };
    return url + '?' + querystring.stringify(info) + '#wechat_redirect';
  }

  /**
   * 获取 openid,token
   * @param code
   */
  async getOpenidAndToken(code: string): Promise<any> {
    return new Promise((resolve: resolveType, reject: rejectType) => {
      this.auth.getAccessToken(code, function (err: any, result: any) {
        if (err) {
          reject(err);
        } else {
          var accessToken = result.data.access_token;
          var openid = result.data.openid;
          resolve({ accessToken, openid });
        }
      });
    });
  }

  /**
   * 通过code获取用户信息
   * @param code
   * @returns any
   */
  async getUserByCode(code: string): Promise<any> {
    return new Promise((resolve: resolveType, reject: rejectType) => {
      this.auth.getUserByCode(code, function (err: any, result: any) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * 通过code获取用户信息
   * @param code
   * @returns any
   */
  async getUserByCodeOld(code: string): Promise<any> {
    const { openid, accessToken } = await this.getOpenidAndToken(code);
    return this.getUserByOpenid(openid);
  }

  /**
   * 通过openid获取用户信息
   * @param openid
   */
  async getUserByOpenid(openid: string): Promise<any> {
    return new Promise((resolve: resolveType, reject: rejectType) => {
      this.auth.getUser(openid, function (err: any, result: any) {
        resolve(result);
      });
    });
  }

  /**
   * 发送文本消息给用户
   * @param accountid
   * @param msg
   */
  async sendTextByAccountid(accountid: string, msg: string) {
    const openid: string = await this.getOpenidByAccountid(accountid);
    if (!openid) {
      throw new Error(`未绑定 ${accountid}`);
    }
    return this.api.sendText(openid, msg);
  }

  /**
   * 发送模板消息
   * @param templateid 模板id
   * @param accountid 账号id
   * @param msg 需要发送的信息
   */
  async sendTemplateMessageByAccountid(
    templateid: string,
    accountid: string,
    url: string,
    color: string,
    data: any
  ): Promise<any> {
    const openid: string = await this.getOpenidByAccountid(accountid);

    if (!openid) {
      throw new Error(`未绑定 ${accountid}`);
    }

    console.log('发送模板消息：', { openid, templateid, url, color, data });
    const result = await this.api.sendTemplate(
      openid,
      templateid,
      url,
      color,
      data
    );
    console.log('发送模板消息微信返回：', result);
    return result;
  }

  async getOpenidByAccountid(accountid: string): Promise<string> {
    const bindInfo = await BindModel.findOne({ accountid: accountid }).exec();
    const { openid }: { openid: string } = bindInfo ? bindInfo : { openid: '' };
    return openid;
  }
}

const wxService: WxService = new WxService();
export default wxService;
