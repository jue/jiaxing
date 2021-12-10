import { Request, Response, NextFunction, Router } from 'express';
import { AuthModel } from '../services/mongoose-models/auth';
import notifyActionService from '../services/NotifyActionService';

const router = Router();

class AuthController {
  async create(req: Request, res: Response, next: NextFunction) {
    const authInfo = req.body;

    try {
      let data = await AuthModel.findOne({
        action: authInfo.action,
        moduleType: authInfo.moduleType,
      });

      let authModel: any = null;
      if (data === null) {
        authModel = new AuthModel({
          name: authInfo.name,
          action: authInfo.action,
          moduleType: authInfo.moduleType,
        });
        authModel = await authModel.save();
        notifyActionService
          .createAction({
            type: 'create_auth',
            data: authModel,
            idCreatedBy: req.user._id,
            idEntity: authInfo._id,
          })
          .catch((err) => console.log('error', err));

        res.json(authModel);
        return;
      }
      res.status(500).json({ msg: '权限已存在' });
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    let data = [];
    let { _id } = req.query;

    try {
      if (_id) {
        let data = await AuthModel.findOne({
          _id: _id,
        });
        res.json(data);
        return;
      }

      let searchInfo: any = {};
      data = await AuthModel.find(searchInfo);

      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const authInfo = req.body;

      let authModel = await AuthModel.findOne({
        _id: authInfo._id,
      });

      if (authInfo.name) {
        authModel.name = authInfo.name;
      }
      if (authInfo.action) {
        authModel.action = authInfo.action;
      }

      let data = await authModel.save();
      res.json(data);

      notifyActionService
        .createAction({
          type: 'update_auth',
          data: authInfo,
          idCreatedBy: req.user._id,
          idEntity: authInfo._id,
        })
        .catch((err) => console.log('error', err));
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

      let authData = await AuthModel.findOne({
        _id: _id,
      });
      if (authData === null) {
        res.status(500).json({ msg: '权限不存在' });
        return;
      }

      authData.deleted = true;
      await authData.save();

      res.json({});
      notifyActionService
        .createAction({
          type: 'delete_auth',
          data: {},
          idCreatedBy: req.user._id,
          idEntity: _id as string,
        })
        .catch((err) => console.log('error', err));
    } catch (error) {
      next(error);
    }
  }
}

const authController = new AuthController();

// 权限查询
router.get('/api/auth/search', authController.search);

// 权限新增
router.post('/api/auth/create', authController.create);

// 权限修改
router.post('/api/auth/update', authController.update);

// 权限删除
router.delete('/api/auth/delete', authController.delete);

export default router;
