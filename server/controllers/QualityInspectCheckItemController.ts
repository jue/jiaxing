import { Request, Response, NextFunction, Router } from 'express';

import mongodbGridfsService from '../services/MongodbGridfsService';
import { QualityInspectReportModel } from '../services/mongoose-models/quality_inspect_report';
import { QualityInspectCheckItemModel } from '../services/mongoose-models/quality_inspect_checkItem';
import notifyActionService from '../services/NotifyActionService';

const router = Router();

class QualityInspectCheckItemController {
  async create(req: Request, res: Response, next: NextFunction) {
    const checkItemInfo = req.body;
    try {
      let reportModel = await QualityInspectReportModel.findOne({
        _id: checkItemInfo.idReport,
      });

      if (reportModel === null) {
        throw new Error('报告不存在');
      }

      let qInspectCheckItemModel = new QualityInspectCheckItemModel({
        name: checkItemInfo.name,
        files: checkItemInfo.files,
        idReport: checkItemInfo.idReport,
        result: checkItemInfo.result,
        type: checkItemInfo.type,
        remark: checkItemInfo.remark,
      });

      qInspectCheckItemModel = await qInspectCheckItemModel.save();

      res.json(qInspectCheckItemModel);

      notifyActionService
        .createAction({
          type: 'create_quality_inspect_checkItem',
          data: qInspectCheckItemModel,
          idCreatedBy: req.user._id,
          idEntity: checkItemInfo._id,
        })
        .catch((err) => console.log('error', err));
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    let data = [];
    let { _id, idReport } = req.query;
    try {
      if (_id) {
        let data = await QualityInspectCheckItemModel.findOne({
          _id: _id,
        }).sort({ pos: 1 });
        res.json(data);
        return;
      }
      let searchInfo: any = {};
      if (idReport) {
        searchInfo.idReport = idReport;
      }
      data = await QualityInspectCheckItemModel.find(searchInfo).sort({
        pos: 1,
      });
    } catch (error) {
      next(error);
      return;
    }
    res.json(data);
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const checkItemInfo = req.body;

      let checkItemModel = await QualityInspectCheckItemModel.findOne({
        _id: checkItemInfo._id,
      });

      if (checkItemInfo.name) {
        checkItemModel.name = checkItemInfo.name;
      }
      if (checkItemInfo.result) {
        checkItemModel.result = checkItemInfo.result;
      }
      if (checkItemInfo.type) {
        checkItemModel.type = checkItemInfo.type;
      }
      if (checkItemInfo.remark) {
        checkItemModel.remark = checkItemInfo.remark;
      }

      // 有新上传文件
      if (checkItemInfo.createFiles) {
        checkItemModel.files.push(...checkItemInfo.createFiles);
      }

      // 有删除文件
      if (checkItemInfo.deleteFiles) {
        checkItemInfo.deleteFiles.forEach((deleteFile) => {
          mongodbGridfsService.deleteFile(deleteFile._id).catch(() => false);
          checkItemModel.files.pull({ _id: deleteFile._id });
        });
      }

      let data = await checkItemModel.save();
      res.json(data);

      notifyActionService
        .createAction({
          type: 'update_quality_inspect_checkItem',
          data: checkItemInfo,
          idCreatedBy: req.user._id,
          idEntity: checkItemInfo._id,
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

      let itemData = await QualityInspectCheckItemModel.findOne({
        _id,
      });
      if (itemData === null) {
        res.status(500).json({ msg: '检查项不存在' });
        return;
      }

      itemData.deleted = true;
      itemData.files.pull({});
      await itemData.save();

      // 删除 checkItem 中的附件
      itemData.files.map((file) => {
        mongodbGridfsService.deleteFile(file._id).catch((e) => false);
      });

      res.json({});

      notifyActionService
        .createAction({
          type: 'delete_quality_inspect_checkItem',
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

const qualityInspectCheckItemController = new QualityInspectCheckItemController();

// 质量检查-检查项创建
router.post(
  '/api/quality/inspect_checkItem/create',
  qualityInspectCheckItemController.create
);

// 质量检查-检查项查询
router.get(
  '/api/quality/inspect_checkItem/search',
  qualityInspectCheckItemController.search
);

// 质量检查-检查项修改
router.post(
  '/api/quality/inspect_checkItem/update',
  qualityInspectCheckItemController.update
);

// 质量检查-检查项删除
router.delete(
  '/api/quality/inspect_checkItem/delete',
  qualityInspectCheckItemController.delete
);

export default router;
