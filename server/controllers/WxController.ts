/**
 * @ Author: xcs
 * @ Create Time: 2020-10-19 18:25:14
 * @ Modified by: xcs
 * @ Modified time: 2020-10-29 17:08:47
 * @ Description:微信公众号
 */

import { Request, Response, NextFunction, Router } from 'express';
import bcrypt from 'bcrypt';
import { AccountModel } from '../services/mongoose-models/account';
import { BindModel } from '../services/mongoose-models/wx_bind';
import wxService from '../services/WxService';
import { ONE_MONTH_IN_MS, CONFIG_WX } from '../config';
import { reject } from 'lodash';
import request from 'request';
import sha1 from 'js-sha1';

const router = Router();

class WxController {
  /**
   * 检测绑定账号
   * @param code 微信重定向后的参数code
   * @param state 用户定义数据
   */
  async checkBindAccount(req: Request, res: Response, next: NextFunction) {
    const { code, state } = req.query;
    try {
      if (state == 'bind' && code) {
        const userinfo = await wxService.getUserByCode(code as string);
        const { openid }: { openid: string } = userinfo ? userinfo : {};
        if (openid) {
          const bindInfo: any = await BindModel.findOne({
            openid,
          }).exec();
          if (!bindInfo) {
            res.redirect(`${CONFIG_WX.bind_url}?openid=${openid}`);
          } else {
            res.redirect('/wx/bindSuccess');
          }
        } else {
          res.send('error openid');
        }
      } else {
        const url = wxService.getAuthorizeURL(
          CONFIG_WX.bind_check_url,
          'bind',
          'snsapi_userinfo'
        );
        res.redirect(url);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * 绑定账号
   * @param userName 用户名
   * @param password 密码
   * @param openid  openid
   */
  async bindAccount(req: Request, res: Response, next: NextFunction) {
    const { userName, password, openid } = req.body;
    try {
      if (!userName || !password || !openid) {
        res.json({
          msg: '绑定数据输入有误',
          status: 'fail',
        });
        return;
      }
      const accountInfo = await AccountModel.findOne({ userName })
        .select('+password')
        .exec();

      const match = accountInfo
        ? await bcrypt.compare(password, accountInfo.password)
        : false;

      if (match) {
        const bindInfo = await BindModel.findOne({ openid }).exec();
        if (!bindInfo) {
          const result = await BindModel.bindAccount(openid, accountInfo._id);
          res.json({
            result,
            msg: result ? '绑定成功' : '绑定失败',
            status: result ? 'ok' : 'fail',
          });
        } else {
          res.json({
            result: false,
            msg: '重复绑定',
            status: 'fail',
          });
        }
      } else {
        res.json({
          msg: '账号输入有误',
          status: 'fail',
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取授权url
   * @param redirect 跳转地址
   * @param state 用户数据
   * @param scope  snsapi_userinfo || snsapi_base
   */
  async getAuthorizeURL(req: Request, res: Response, next: NextFunction) {
    const {
      redirect,
      state = '',
      scope = 'snsapi_userinfo',
    }: {
      redirect: string;
      state: any;
      scope: 'snsapi_userinfo' | 'snsapi_base';
    } = req.body;
    try {
      const url = wxService.getAuthorizeURL(redirect, state, scope);
      res.json({
        url,
        status: 'ok',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取用户信息
   * @param openid
   */
  async getUserInfo(req: Request, res: Response, next: NextFunction) {
    const { openid } = req.params;
    try {
      const userinfo = await wxService.getUserByOpenid(openid);
      res.json({
        userinfo,
        status: 'ok',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 发送文本消息
   * @param accountid
   * @param msg
   */
  async sendText(req: Request, res: Response, next: NextFunction) {
    const { accountid, msg } = req.params;

    if (!accountid || !msg) {
      res.json({
        msg: '参数错误',
        status: 'fail',
      });
      return;
    }

    try {
      const result = await wxService.sendTextByAccountid(accountid, msg);
      res.json({
        result,
        status: 'ok',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 发送模板消息
   * @param accountid
   * @param templateid
   * @param url
   * @param color
   * @param data
   */
  async sendTemplateMessage(req: Request, res: Response, next: NextFunction) {
    const { accountid, templateid, url, color, data } = req.params;
    if (!accountid || (!templateid && !data)) {
      res.json({
        msg: '参数错误',
        status: 'fail',
      });
      return;
    }

    try {
      const result = await wxService.sendTemplateMessageByAccountid(
        templateid,
        accountid,
        url,
        color,
        data
      );
      res.json({
        result,
        status: 'ok',
      });
    } catch (error) {
      next(error);
    }
  }

  async testSendTemplateMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const accountid = '5f8e3e419d8138704e7a6b6e';
    const templateid = 'odZQZdnH-NAHz7RnwsKSw__RmK-EvNHYk-Hy8GxXmqI';
    const url = '';
    const color = '#FF0000';
    const data = {
      first: {
        value: '内容11',
        color: '#173177',
      },
      keyword1: {
        value: '项目名称1',
        color: '#173177',
      },
      keyword2: {
        value: '环节名称2',
        color: '#173177',
      },
      keyword3: {
        value: '报备人员3',
        color: '#173177',
      },
      keyword4: {
        value: '报备内容4',
        color: '#173177',
      },
      keyword5: {
        value: '延期天数5',
        color: '#173177',
      },
      remark: {
        value: '备注6',
        color: '#173177',
      },
    };
    if (!accountid || (!templateid && !data)) {
      res.json({
        msg: '参数错误',
        status: 'fail',
      });
      return;
    }

    try {
      const result = await wxService.sendTemplateMessageByAccountid(
        templateid,
        accountid,
        url,
        color,
        data
      );
      res.json({
        result,
        status: 'ok',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 微信消息回调
   */
  async msg(req: Request, res: Response, next: NextFunction) {}

  /**
   * 微信配置
   */
  async jsConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const ticket_url: string =
        'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' +
        CONFIG_WX.access_token +
        '&type=jsapi';
      let body: string = await new Promise((resolve, reject) => {
        request.get(ticket_url, (err: any, res: any, body: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(body);
          }
        });
      });

      const jsapi_ticket: string = JSON.parse(body).ticket;
      const timestamp: string = String((new Date().getTime() / 1000) << 0); // 时间戳
      //ctx.request.header.referer   // 使用接口的url链接，不包含#后的内容
      // 将请求以上字符串，先按字典排序，再以'&'拼接，如下：其中j > n > t > u，此处直接手动排序
      // 用sha1加密
      let signature: string = sha1(
        'jsapi_ticket=' +
          jsapi_ticket +
          '&noncestr=' +
          CONFIG_WX.nonce_str +
          '×tamp=' +
          timestamp +
          '&url=' +
          CONFIG_WX.url
      );
      res.json({
        appId: CONFIG_WX.appid,
        timestamp: timestamp,
        nonceStr: CONFIG_WX.nonce_str,
        signature: signature,
        status: 'ok',
      });
    } catch (error) {
      next(error);
    }
  }
}

const wxController = new WxController();
//微信配置信息
router.get('/api/wx/jsConfig', wxController.jsConfig);

//绑定账号
router.post('/api/wx/bindAccount', wxController.bindAccount);

//获取用户信息
router.get('/api/wx/getUserInfo/:openid', wxController.getUserInfo);

//微信菜单访问
router.get('/wx/checkBindAccount', wxController.checkBindAccount);

//获取微信用户授权地址
router.get('/api/wx/getAuthorizeURL', wxController.getAuthorizeURL);

//发送文本信息
router.post('/api/wx/sendText', wxController.sendText);

//发送模板信息
router.post('/api/wx/sendTemplateMessage', wxController.sendTemplateMessage);

// router.get(
//   '/api/wx/testSendTemplateMessage',
//   wxController.testSendTemplateMessage
// );

export default router;
