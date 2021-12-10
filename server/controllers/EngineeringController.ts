import { Router, Request, Response, NextFunction } from 'express';
import { EngineeringModel } from '../services/mongoose-models/engineering';
import notifyActionService from '../services/NotifyActionService';

const router = Router();

class EngineeringController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const {
        name,
        changeableAmount,
        head,
        phone,
        constructionUnit,
      } = req.body;

      let engineeringModel = new EngineeringModel({
        name: name,
        changeableAmount: changeableAmount,
        head: head,
        phone: phone,
        constructionUnit: constructionUnit,
        idCreatedBy: userId,
      });

      await engineeringModel.save();
      res.json(engineeringModel);

      notifyActionService
        .createAction({
          type: 'create_engineering',
          data: engineeringModel,
          idCreatedBy: req.user._id,
          idEntity: engineeringModel._id,
        })
        .catch((err) => console.log('error', err));
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    let data = [];
    try {
      const { name } = req.query;
      let searchInfo: any = {};
      if (name) {
        searchInfo.name = new RegExp(name as string);
      }
      data = await EngineeringModel.find(searchInfo);
    } catch (error) {}
    res.json(data);
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const engineeringInfo = req.body;

      let updateInfo: any = {};
      if (engineeringInfo.name) {
        updateInfo.name = engineeringInfo.name;
      }
      if (engineeringInfo.changeableAmount) {
        updateInfo.changeableAmount = engineeringInfo.changeableAmount;
      }
      if (engineeringInfo.head) {
        updateInfo.head = engineeringInfo.head;
      }
      if (engineeringInfo.phone) {
        updateInfo.phone = engineeringInfo.phone;
      }
      if (engineeringInfo.constructionUnit) {
        updateInfo.constructionUnit = engineeringInfo.constructionUnit;
      }
      let data = await EngineeringModel.findByIdAndUpdate(
        engineeringInfo._id,
        updateInfo,
        { new: true }
      );
      res.json(data);

      notifyActionService
        .createAction({
          type: 'update_engineering',
          data: updateInfo,
          idCreatedBy: req.user._id,
          idEntity: engineeringInfo._id,
        })
        .catch((err) => console.log('error', err));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      let { _id } = req.query as any;
      if (!_id) {
        res.status(200).json({ code: 1001, msg: 'ID为空' });
        return;
      }

      let engineeringData = await EngineeringModel.findOne({ _id: _id });
      if (engineeringData === null) {
        res.status(200).json({ code: 1002, msg: '工程不存在' });
        return;
      }

      let updateInfo: any = {};
      updateInfo.deleted = true;

      await EngineeringModel.findByIdAndUpdate(_id, updateInfo, {
        new: true,
      });

      res.json({ data: 'success' });

      notifyActionService
        .createAction({
          type: 'delete_engineering',
          data: engineeringData,
          idCreatedBy: req.user._id,
          idEntity: _id,
        })
        .catch((err) => console.log('error', err));
    } catch (error) {
      next(error);
    }
  }
}

const engineeringController = new EngineeringController();

router.post('/api/engineering/create', engineeringController.create);

router.get('/api/engineering/search', engineeringController.search);

router.post('/api/engineering/update', engineeringController.update);

router.delete('/api/engineering/delete', engineeringController.delete);

export default router;
