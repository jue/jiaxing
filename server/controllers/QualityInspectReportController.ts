import { Request, Response, NextFunction, Router } from 'express';

import { QualityInspectReportModel } from '../services/mongoose-models/quality_inspect_report';
import { QualityInspectCheckItemModel } from '../services/mongoose-models/quality_inspect_checkItem';
import mongodbGridfsService from '../services/MongodbGridfsService';
import redisService from '../services/RedisService';
import notifyActionService from '../services/NotifyActionService';
import moment from 'moment';
import { QualityInspectSubjectModel } from '../services/mongoose-models/quality_inspect_subject';

const router = Router();

class QualityInspecReportController {
  async create(req: Request, res: Response, next: NextFunction) {
    const reportInfo = req.body;
    try {
      let seq = await redisService.getSequenceNumber('JC');

      let qInspectReportModel = new QualityInspectReportModel({
        name: reportInfo.name,
        idSubject: reportInfo.idSubject,
        files: reportInfo.files,
        desc: reportInfo.desc,
        way: reportInfo.way,
        type: reportInfo.type,
        frequency: reportInfo.frequency,
        result: reportInfo.result,
        creator: req.user._id,
        state: reportInfo.state,
        number: `${seq}_00`,
      });

      qInspectReportModel = await qInspectReportModel.save();

      //修改subjet中分配状态
      let subjectModel = await QualityInspectSubjectModel.findOne({
        _id: reportInfo.idSubject,
      });
      if (subjectModel !== null) {
        subjectModel.distributionState = 'true';
        await subjectModel.save();
      }

      res.json(qInspectReportModel);

      notifyActionService
        .createAction({
          type: 'create_quality_inspect_report',
          data: qInspectReportModel,
          idCreatedBy: req.user._id,
          idEntity: reportInfo._id,
        })
        .catch((err) => console.log('error', err));
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    let data = [];
    let { _id, page, limit, atCreated, result } = req.query as any;
    try {
      if (_id) {
        let data = await QualityInspectReportModel.findOne({
          _id: _id,
        })
          .populate({
            path: 'checkItems',
            options: { sort: { pos: 1 } },
          })
          .populate({
            path: 'rectification',
          })
          .populate({
            path: 'task',
          });
        res.json(data);
        return;
      }
      let newLimit = +limit || 10;
      let skip = +page * newLimit;

      let searchInfo: any = {};
      if (atCreated) {
        let d1 = new Date(moment(new Date(atCreated)).format('YYYY-MM-DD'));
        let d2 = new Date(
          moment(new Date(atCreated)).add(1, 'days').format('YYYY-MM-DD')
        );
        searchInfo.atCreated = {
          $gte: d1,
          $lt: d2,
        };
      }
      if (result) {
        searchInfo.result = result;
      }

      data = await QualityInspectReportModel.find(searchInfo)
        .populate({
          path: 'checkItems',
          options: { sort: { pos: 1 } },
        })
        .populate({
          path: 'rectification',
        })
        .populate({
          path: 'task',
        })
        .populate({
          path: 'account',
        })
        .skip(skip)
        .limit(newLimit)
        .sort({ atCreated: -1 });

      let count = await QualityInspectReportModel.countDocuments(searchInfo);

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
      const reportInfo = req.body;

      let reportModel = await QualityInspectReportModel.findOne({
        _id: reportInfo._id,
      });

      if (reportInfo.name) {
        reportModel.name = reportInfo.name;
      }
      if (reportInfo.desc) {
        reportModel.desc = reportInfo.desc;
      }
      if (reportInfo.way) {
        reportModel.way = reportInfo.way;
      }
      if (reportInfo.type) {
        reportModel.type = reportInfo.type;
      }
      if (reportInfo.frequency) {
        reportModel.frequency = reportInfo.frequency;
      }
      if (reportInfo.result) {
        reportModel.result = reportInfo.result;
      }
      if (reportInfo.state) {
        reportModel.state = reportInfo.state;
      }
      if (reportInfo.acceptResult) {
        reportModel.acceptResult = reportInfo.acceptResult;
      }
      if (reportInfo.acceptOpinion) {
        reportModel.acceptOpinion = reportInfo.acceptOpinion;
      }
      if (reportInfo.acceptEvaluation) {
        reportModel.acceptEvaluation = reportInfo.acceptEvaluation;
      }

      // 有新上传文件
      if (reportInfo.createFiles) {
        reportModel.files.push(...reportInfo.createFiles);
      }

      // 有删除文件
      if (reportInfo.deleteFiles) {
        reportInfo.deleteFiles.forEach((deleteFile) => {
          mongodbGridfsService.deleteFile(deleteFile._id).catch(() => false);
          reportModel.files.pull({ _id: deleteFile._id });
        });
      }

      let data = await reportModel.save();

      res.json(data);
      notifyActionService
        .createAction({
          type: 'update_quality_inspect_report',
          data: reportInfo,
          idCreatedBy: req.user._id,
          idEntity: reportInfo._id,
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
        res.status(500).json({ msg: 'ID为空' });
        return;
      }

      let reportData = await QualityInspectReportModel.findOne({
        _id,
      });
      if (reportData === null) {
        res.status(500).json({ msg: '报告不存在' });
        return;
      }

      let checkItemData = await QualityInspectCheckItemModel.find({
        idReport: _id,
      });

      checkItemData.forEach((checkItem) => {
        checkItem.deleted = true;
        checkItem.files.pull({});
        checkItem.save();
      });

      reportData.deleted = true;
      reportData.files.pull({});
      await reportData.save();

      let fileIds = reportData.files.map((file) => file._id);
      checkItemData.map((checkItem) => {
        checkItem.files.forEach((file) => fileIds.push(file._id));
      });

      await Promise.all(
        fileIds.map((fileId) =>
          mongodbGridfsService.deleteFile(fileId).catch((e) => false)
        )
      );

      res.json({});

      notifyActionService
        .createAction({
          type: 'delete_quality_inspect_report',
          data: {},
          idCreatedBy: req.user._id,
          idEntity: _id,
        })
        .catch((err) => console.log('error', err));
    } catch (error) {
      next(error);
    }
  }
}

const qualityInspectReportController = new QualityInspecReportController();

router.get(
  '/api/quality/inspect_report/search',
  qualityInspectReportController.search
);

// 质量检查-报告创建
router.post(
  '/api/quality/inspect_report/create',
  qualityInspectReportController.create
);

// 质量检查-报告修改
router.post(
  '/api/quality/inspect_report/update',
  qualityInspectReportController.update
);

// 质量检查-报告删除
router.delete(
  '/api/quality/inspect_report/delete',
  qualityInspectReportController.delete
);

export default router;
