/**
 * @ Author: xcs
 * @ Create Time: 2020-10-19 18:25:14
 * @ Modified by: xcs
 * @ Modified time: 2020-10-29 10:03:38
 * @ Description:微信公众号
 */

import { Request, Response, NextFunction, Router } from 'express';
import bcrypt from 'bcrypt';
import { AccountModel } from '../services/mongoose-models/account';
import { BindModel } from '../services/mongoose-models/wx_bind';
import wxService from '../services/WxService';
import { ONE_MONTH_IN_MS, CONFIG_WX } from '../config';

const router = Router();

class WxController {
  /**
   * 发送文本消息
   * @param accountid
   * @param msg
   */
  async sendText(req: Request, res: Response, next: NextFunction) {
    const { accountid, msg } = req.body;

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
    const { accountid, templateid, url, color, data } = req.body;
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
}

const wxController = new WxController();

//发送文本信息
router.post('/api/wx/sendText', wxController.sendText);

//发送模板信息
router.post('/api/wx/sendTemplateMessage', wxController.sendTemplateMessage);

export default router;
