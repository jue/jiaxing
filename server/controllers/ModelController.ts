import { Router, Request, Response, NextFunction } from 'express';
import { ModelModel } from '../services/mongoose-models/model';
import notifyActionService from '../services/NotifyActionService';
import mongodbGridfsService from '../services/MongodbGridfsService';
import modelService from '../services/ModelService';
import redisService from '../services/RedisService';

const router = Router();

class ModelController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const modelInfo = req.body;

      //判断版本号是否存在
      let data = await ModelModel.findOne({
        name: modelInfo.name,
        version: modelInfo.version,
      });
      if (data) {
        res.status(200).json({ code: 1003, msg: '版本号已存在' });
        return;
      }

      const suffix = modelInfo.files.originalname.slice(
        modelInfo.files.originalname.lastIndexOf('.') + 1
      );
      const type = suffix.toUpperCase();
      let number = await redisService.getSequenceNumber1(type);

      let modelModel = new ModelModel({
        idEngineering: modelInfo.idEngineering,
        idContract: modelInfo.idContract,
        name: modelInfo.name,
        version: modelInfo.version,
        type: modelInfo.type,
        size: modelInfo.size,
        files: modelInfo.files,
        idCreatedBy: userId,
        number: number,
      });

      await modelModel.save();
      res.json(modelModel);

      notifyActionService
        .createAction({
          type: 'create_model',
          data: modelModel,
          idCreatedBy: req.user._id,
          idEntity: modelModel._id,
        })
        .catch((err) => console.log('error', err));
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    let data = [];
    try {
      const {
        idEngineering,
        idContract,
        name,
        last,
        type,
        end,
        limit,
        page,
      } = req.query;

      let queryInfo: any = {};

      if (last) {
        if (name) {
          data = await ModelModel.find({
            name: new RegExp(name as string),
          })
            .populate('engineering')
            .populate('contract')
            .populate('account')
            .sort({ version: -1 })
            .limit(1)
            .lean(true);

          res.json(await modelService.updateModelStatus(data));

          return;
        }
      }

      let newLimit = +limit || 0;
      let skip = +page * newLimit;

      if (idEngineering) {
        queryInfo.idEngineering = idEngineering;
      }
      if (idContract) {
        queryInfo.idContract = idContract;
      }
      if (type) {
        queryInfo.type = type;
      }
      if (name) {
        queryInfo.name = new RegExp(name as string);
      }
      if (end) {
        queryInfo['files.originalname'] = new RegExp(end as string);
      }

      data = await ModelModel.find(queryInfo)
        .populate('engineering')
        .populate('contract')
        .populate('account')
        .skip(skip)
        .limit(newLimit)
        .sort({ atCreated: -1 })
        .lean(true);

      let count = await ModelModel.countDocuments(queryInfo);
      res.json({ data: await modelService.updateModelStatus(data), count });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const modelInfo = req.body;

      let updateInfo: any = {};

      if (modelInfo.idEngineering) {
        updateInfo.idEngineering = modelInfo.idEngineering;
      }
      if (modelInfo.idContract) {
        updateInfo.idContract = modelInfo.idContract;
      }
      if (modelInfo.name) {
        updateInfo.name = modelInfo.name;
      }
      if (modelInfo.version) {
        updateInfo.version = modelInfo.version;
      }
      if (modelInfo.type) {
        updateInfo.type = modelInfo.type;
      }

      let data = await ModelModel.findByIdAndUpdate(modelInfo._id, updateInfo, {
        new: true,
      });
      res.json(data);

      notifyActionService
        .createAction({
          type: 'update_model',
          data: data,
          idCreatedBy: req.user._id,
          idEntity: data._id,
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

      let modelData = await ModelModel.findOne({ _id: _id });
      if (modelData === null) {
        res.status(200).json({ code: 1002, msg: '模型不存在' });
        return;
      }

      // 删除附件
      mongodbGridfsService.deleteFile(modelData.files._id).catch((e) => false);

      let updateInfo: any = {};
      updateInfo.deleted = true;
      updateInfo.files = {};

      await ModelModel.findByIdAndUpdate(_id, updateInfo, {
        new: true,
      });
      res.json({ data: 'success' });

      notifyActionService
        .createAction({
          type: 'delete_model',
          data: modelData,
          idCreatedBy: req.user._id,
          idEntity: _id,
        })
        .catch((err) => console.log('error', err));
    } catch (error) {
      next(error);
    }
  }
}

const modelController = new ModelController();

router.post('/api/model/create', modelController.create);

router.get('/api/model/search', modelController.search);

router.post('/api/model/update', modelController.update);

router.delete('/api/model/delete', modelController.delete);

export default router;
