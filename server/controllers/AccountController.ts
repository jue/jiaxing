import { Request, Response, NextFunction, Router } from 'express';
import bcrypt from 'bcrypt';
import { AccountModel } from '../services/mongoose-models/account';
import notifyActionService from '../services/NotifyActionService';
import { StatusCode } from '../../constants/enums';
import authController from './AuthController';
import { ONE_MONTH_IN_MS } from '../config';

const router = Router();

function resSetCookie(res: Response, token: string) {
  res.cookie('token', token, {
    maxAge: ONE_MONTH_IN_MS,
    httpOnly: true,
    encode: String,
  });
}

class AccountController {
  async create(req: Request, res: Response, next: NextFunction) {
    const accountInfo = req.body;

    if (!accountInfo.password) {
      accountInfo.password = '123456';
    }
    try {
      let accountModel = new AccountModel({
        userName: accountInfo.userName,
        nickName: accountInfo.nickName,
        password: await bcrypt.hash(accountInfo.password, 10),
        idCompany: accountInfo.idCompany,
        idDepartment: accountInfo.idDepartment,
        idJob: accountInfo.idJob,
        phone: accountInfo.phone,
        email: accountInfo.email,
        role: accountInfo.role,
        idsAuth: accountInfo.auth,
      });
      accountModel = await accountModel.save();
      res.json(accountModel);

      notifyActionService
        .createAction({
          type: 'create_account',
          data: accountModel,
          idCreatedBy: req.user._id,
          idEntity: accountInfo._id,
        })
        .catch((err) => console.log('error', err));
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    let data = [];
    let { _id, page, limit, userName, idCompany, idDepartment } = req.query;
    const userId = req.user._id;

    try {
      if (_id) {
        let queryRes: any = {};

        if (userId !== _id) {
          queryRes = AccountModel.findOne(
            {
              _id: _id,
            },
            '-signId'
          );
        } else {
          queryRes = AccountModel.findOne({
            _id: _id,
          });
        }

        let data = await queryRes
          .populate({
            path: 'company',
          })
          .populate({
            path: 'dept',
          })
          .populate({
            path: 'job',
          })
          .populate({
            path: 'auth',
          });
        res.json(data);
        return;
      }
      let newLimit = +limit || 10;
      let skip = +page * newLimit;

      let searchInfo: any = {};
      if (userName) {
        searchInfo.userName = new RegExp(userName as string);
      }
      if (idCompany) {
        searchInfo.idCompany = idCompany;
      }
      if (idDepartment) {
        searchInfo.idDepartment = idDepartment;
      }

      data = await AccountModel.find(searchInfo, '-signId')
        .populate({
          path: 'company',
        })
        .populate({
          path: 'dept',
        })
        .populate({
          path: 'job',
        })
        .populate({
          path: 'auth',
        })
        .skip(skip)
        .limit(newLimit)
        .sort({ atCreated: -1 });

      let count = await AccountModel.countDocuments(searchInfo);
      res.json({
        data,
        count,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const accountInfo = req.body;
      const userId = req.user._id;

      let accountModel = await AccountModel.findOne({
        _id: accountInfo._id,
      });

      if (accountInfo.userName) {
        accountModel.userName = accountInfo.userName;
      }
      if (accountInfo.nickName) {
        accountModel.nickName = accountInfo.nickName;
      }
      if (accountInfo.idCompany) {
        accountModel.idCompany = accountInfo.idCompany;
      }
      if (accountInfo.idDepartment) {
        accountModel.idDepartment = accountInfo.idDepartment;
      }
      if (accountInfo.idJob) {
        accountModel.idJob = accountInfo.idJob;
      }
      if (accountInfo.phone) {
        accountModel.phone = accountInfo.phone;
      }
      if (accountInfo.email) {
        accountModel.email = accountInfo.email;
      }
      if (accountInfo.role) {
        accountModel.role = accountInfo.role;
      }
      if (accountInfo.idsAuth) {
        accountModel.idsAuth = accountInfo.idsAuth;
      }
      if (accountInfo.files) {
        accountModel.files = accountInfo.files;
      }
      // signId only can be updated by userSelf
      if (accountInfo.signId && userId == accountInfo._id) {
        accountModel.signId = accountInfo.signId;
      }

      let data = await accountModel.save();
      res.json(data);

      notifyActionService
        .createAction({
          type: 'update_account',
          data: accountInfo,
          idCreatedBy: req.user._id,
          idEntity: accountInfo._id,
        })
        .catch((err) => console.log('error', err));
    } catch (error) {
      next(error);
    }
  }

  async self(req: Request, res: Response, next: NextFunction) {
    let user = req.user;

    try {
      if (user) {
        let data = await AccountModel.findOne({
          _id: user._id,
        })
          .populate({
            path: 'company',
          })
          .populate({
            path: 'dept',
          })
          .populate({
            path: 'job',
          })
          .populate([
            {
              path: 'auth',
            },
            {
              path: 'bind',
              select: 'openid -accountid -_id',
            },
          ]);
        res.json(data);
        return;
      }
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      let { _id } = req.query;
      if (!_id) {
        res.status(500).json({ msg: 'ID为空' });
        return;
      }

      let accountData = await AccountModel.findOne({
        _id: _id,
      });

      if (accountData === null) {
        res.status(500).json({ msg: '用户不存在' });
        return;
      }
      accountData.deleted = true;
      await accountData.save();

      res.json({});

      notifyActionService
        .createAction({
          type: 'delete_account',
          data: {},
          idCreatedBy: req.user._id,
          idEntity: _id as string,
        })
        .catch((err) => console.log('error', err));
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      let updateInfo = req.body;

      let accountData = await AccountModel.findOne({
        _id: updateInfo._id,
      }).select('+password');

      if (accountData === null) {
        res.status(500).json({ msg: '用户不存在' });
        return;
      }

      if (await bcrypt.compare(updateInfo.password, accountData.password)) {
        accountData.password = await bcrypt.hash(updateInfo.newPassword, 10);
        let data = await accountData.save();
        res.json(data);

        notifyActionService
          .createAction({
            type: 'update_account_password',
            data: data,
            idCreatedBy: req.user._id,
            idEntity: updateInfo._id,
          })
          .catch((err) => console.log('error', err));
      } else {
        res.json({ msg: '密码错误', status: StatusCode.password_error });
      }
    } catch (error) {
      next(error);
    }
  }

  async validPassword(req: Request, res: Response, next: NextFunction) {
    try {
      let validInfo = req.body;

      let accountData = await AccountModel.findOne({
        _id: validInfo._id,
      }).select('+password');

      if (accountData === null) {
        res.status(500).json({ msg: '用户不存在' });
        return;
      }

      if (await bcrypt.compare(validInfo.password, accountData.password)) {
        res.json({
          msg: '验证成功',
          status: StatusCode.password_valid_success,
        });
      } else {
        res.json({
          msg: '验证失败',
          status: StatusCode.password_valid_fail,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async moveRole(req: Request, res: Response, next: NextFunction) {
    try {
      const accountInfo = req.body;

      let accountModel = await AccountModel.findOne({
        _id: accountInfo._id,
      });

      //判断是否是管理员
      if ('companyAdmin' === accountModel.role) {
        accountModel.role = 'common';
        await accountModel.save();
        let accountIds = accountInfo.accountIds;

        let data = await AccountModel.find({
          _id: { $in: accountIds },
        });
        data.forEach((account) => {
          account.role = 'companyAdmin';
          account.save();
        });

        res.json({
          msg: '移交成功',
          status: StatusCode.role_move_success,
        });
        notifyActionService
          .createAction({
            type: 'update_account_role',
            data: { mvUser: accountModel, mvUserId: accountIds },
            idCreatedBy: req.user._id,
            idEntity: accountInfo._id,
          })
          .catch((err) => console.log('error', err));
      } else {
        res.json({ msg: '没有权限', status: StatusCode.role_off });
      }
    } catch (error) {
      next(error);
    }
  }

  async insertRole(req: Request, res: Response, next: NextFunction) {
    try {
      const accountInfo = req.body;

      let accountModel = await AccountModel.findOne({
        _id: accountInfo._id,
      });

      //判断是否是管理员
      if (['companyAdmin', 'systemAdmin'].includes(accountModel.role)) {
        let accountIds = accountInfo.accountIds;

        let data = await AccountModel.find({
          _id: { $in: accountIds },
        });
        data.forEach((account) => {
          account.role = 'companyAdmin';
          account.save();
        });

        res.json({
          msg: '添加成功',
          status: StatusCode.role_insert_success,
        });
        notifyActionService
          .createAction({
            type: 'insert_account_role',
            data: { addUser: accountModel, addUserId: accountIds },
            idCreatedBy: req.user._id,
            idEntity: accountInfo._id,
          })
          .catch((err) => console.log('error', err));
      } else {
        res.json({ msg: '没有权限', status: StatusCode.role_off });
      }
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { userName, password } = req.body;
    try {
      let preAccount = await AccountModel.findOne({
        userName,
      }).select('+password');

      if (preAccount === null) {
        throw new Error('用户名或密码错误');
      }

      let match = await bcrypt.compare(password, preAccount.password);
      if (!match) {
        throw new Error('用户名或密码错误');
      }

      let { token, account } = await AccountModel.sign(preAccount._id);
      resSetCookie(res, token);

      res.json({
        account,
        token,
        status: 'ok',
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    res.clearCookie('token');
    res.cookie('token', '', {
      maxAge: Date.now(),
      httpOnly: true,
      encode: String,
    });
    res.json({ status: 'ok' });
  }
}

const accountController = new AccountController();

// 人员管理-用户创建
router.post('/api/account/create', accountController.create);

// 人员管理-用户查询
router.get('/api/account/search', accountController.search);

// 人员管理|个人中心-用户修改
router.post('/api/account/update', accountController.update);

// 人员管理-用户删除
router.delete('/api/account/delete', accountController.delete);

// 个人中心-获取自己信息
router.get('/api/account/self', accountController.self);

// 个人中心-修改密码
router.post('/api/account/updatePassword', accountController.updatePassword);

// 个人中心-验证密码
router.post('/api/account/validPassword', accountController.validPassword);

// 个人中心-移交管理员
router.post('/api/account/moveRole', accountController.moveRole);

// 个人中心-添加管理员
router.post('/api/account/insertRole', accountController.insertRole);

// 登录
router.post('/api/account/login', accountController.login);

// 登出
router.post('/api/account/logout', accountController.logout);

export default router;
