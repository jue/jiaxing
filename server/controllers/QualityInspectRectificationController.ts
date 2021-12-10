import { Request, Response, NextFunction, Router } from 'express';
import { QualityInspectRectificationModel } from '../services/mongoose-models/quality_inspect_rectification';
import { QualityInspectReportModel } from '../services/mongoose-models/quality_inspect_report';
import notifyActionService from '../services/NotifyActionService';

interface RequestWithBody extends Request {
  body: { [key: string]: string | undefined };
}

const router = Router();
class QualityInspectRectificationController {
  async create(req: RequestWithBody, res: Response, next: NextFunction) {
    try {
      let rectificationInfo = req.body;

      let preReportModel = await QualityInspectReportModel.findOne({
        _id: rectificationInfo.idReport,
      });
      if (preReportModel === null) {
        throw new Error('检查报告不存在');
      }

      let qInspectRectificationModel = new QualityInspectRectificationModel({
        name: rectificationInfo.name,
        endTime: new Date(rectificationInfo.endTime),
        idExecutive: rectificationInfo.idExecutive,
        idsCC: rectificationInfo.idsCC,
        idReport: rectificationInfo.idReport,
        creator: req.user._id,
      });
      qInspectRectificationModel = await qInspectRectificationModel.save();

      await preReportModel.save();

      res.json(qInspectRectificationModel);

      notifyActionService
        .createAction({
          type: 'create_quality_inspect_rectification',
          data: rectificationInfo,
          idCreatedBy: req.user._id,
          idEntity: rectificationInfo._id,
        })
        .catch((err) => console.log('error', err));
    } catch (error) {
      next(error);
    }
  }
  async search(req: RequestWithBody, res: Response, next: NextFunction) {
    let data = [];
    let { _id, idReport } = req.query;
    try {
      if (_id) {
        let data = await QualityInspectRectificationModel.findOne({
          _id: _id,
        });
        res.json(data);
        return;
      }
      let searchInfo: any = {};
      if (idReport) {
        searchInfo.idReport = idReport;
      }

      data = await QualityInspectRectificationModel.find(searchInfo)
        .populate({
          path: 'executive',
        })
        .populate({
          path: 'cc',
        });

      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const rectificationInfo = req.body;

      let rectificationModel = await QualityInspectRectificationModel.findOne({
        _id: rectificationInfo._id,
      });

      if (rectificationInfo.name) {
        rectificationModel.name = rectificationInfo.name;
      }
      if (rectificationInfo.idExecutive) {
        rectificationModel.idExecutive = rectificationInfo.idExecutive;
      }
      if (rectificationInfo.endTime) {
        rectificationModel.endTime = new Date(rectificationInfo.endTime);
      }
      if (rectificationInfo.idsCC) {
        rectificationModel.idsCC = rectificationInfo.idsCC;
      }

      let data = await rectificationModel.save();
      res.json(data);

      notifyActionService
        .createAction({
          type: 'update_quality_inspect_rectification',
          data: rectificationInfo,
          idCreatedBy: req.user._id,
          idEntity: rectificationInfo._id,
        })
        .catch((err) => console.log('error', err));
    } catch (error) {
      next(error);
    }
  }
}

const qualityInspectRectificationController = new QualityInspectRectificationController();

// 质量检查-整改创建
router.post(
  '/api/quality/inspect_rectification/create',
  qualityInspectRectificationController.create
);

// 质量检查-整改查询
router.get(
  '/api/quality/inspect_rectification/search',
  qualityInspectRectificationController.search
);

// 质量检查-整改修改
router.post(
  '/api/quality/inspect_rectification/update',
  qualityInspectRectificationController.update
);

export default router;
