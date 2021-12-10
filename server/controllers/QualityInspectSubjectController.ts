import { Request, Response, NextFunction, Router } from 'express';

import { QualityInspectPlanModel } from '../services/mongoose-models/quality_inspect_plan';
import mongodbGridfsService from '../services/MongodbGridfsService';
import { QualityInspectSubjectModel } from '../services/mongoose-models/quality_inspect_subject';
import notifyActionService from '../services/NotifyActionService';

const router = Router();

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

class QualityInspectSubjectController {
  async create(req: RequestWithBody, res: Response, next: NextFunction) {
    const subjectInfo = req.body;
    try {
      let planModel = await QualityInspectPlanModel.findOne({
        _id: subjectInfo.idPlan,
      });

      if (planModel === null) {
        throw new Error('质量检查计划不存在');
      }

      let qInspectSubjectModel = new QualityInspectSubjectModel({
        name: subjectInfo.name,
        files: subjectInfo.files,
        idPlan: subjectInfo.idPlan,
        method: subjectInfo.method,
        frequency: subjectInfo.frequency,
        count: subjectInfo.count,
        type: subjectInfo.type,
        allocateObjects: subjectInfo.allocateObjects,
        startTime: new Date(subjectInfo.startTime),
        endTime: new Date(subjectInfo.endTime),
        distributionState: subjectInfo.distributionState,
        progress: subjectInfo.progress,
        pos: subjectInfo.pos,
      });

      qInspectSubjectModel = await qInspectSubjectModel.save();
      res.json(qInspectSubjectModel);

      notifyActionService
        .createAction({
          type: 'create_quality_inspect_subject',
          data: qInspectSubjectModel,
          idCreatedBy: req.user._id,
          idEntity: subjectInfo._id,
        })
        .catch((err) => console.log('error', err));
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    let { _id, idPlan, distributionState, delay } = req.query;
    try {
      if (_id) {
        let data = await QualityInspectSubjectModel.findOne({
          _id: _id,
        }).sort({ pos: 1 });
        res.json(data);
        return;
      }

      let searchInfo: any = {};
      if (idPlan) {
        searchInfo.idPlan = idPlan;
      }
      if (distributionState === 'fasle') {
        searchInfo.distributionState = distributionState;
      }
      if (delay === 'true') {
        searchInfo.endTime = {
          $lt: new Date(),
        };
      }
      let data = await QualityInspectSubjectModel.find(searchInfo).sort({
        pos: 1,
      });
      let progressCount = 0;
      let progresslengh = 0;
      let progressAvg = 0;
      data.map((data) => {
        progressCount += Number(data.progress);
        progresslengh++;
      });
      if (progresslengh !== 0) {
        progressAvg = progressCount / progresslengh;
      }

      searchInfo.endTime = {
        $lt: new Date(),
      };
      let delayCount = await QualityInspectSubjectModel.countDocuments(
        searchInfo
      );

      res.json({
        data,
        delayCount,
        progressAvg,
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const subjectInfo = req.body;

      let subjectModel = await QualityInspectSubjectModel.findOne({
        _id: subjectInfo._id,
      });

      if (subjectInfo.name) {
        subjectModel.name = subjectInfo.name;
      }
      if (subjectInfo.method) {
        subjectModel.method = subjectInfo.method;
      }
      if (subjectInfo.frequency) {
        subjectModel.frequency = subjectInfo.frequency;
      }
      if (subjectInfo.count) {
        subjectModel.count = subjectInfo.count;
      }
      if (subjectInfo.type) {
        subjectModel.type = subjectInfo.type;
      }
      if (subjectInfo.allocateObjects) {
        subjectModel.allocateObjects = subjectInfo.allocateObjects;
      }
      if (subjectInfo.startTime) {
        subjectModel.startTime = new Date(subjectInfo.startTime);
      }
      if (subjectInfo.endTime) {
        subjectModel.endTime = new Date(subjectInfo.endTime);
      }
      if (subjectInfo.distributionState) {
        subjectModel.distributionState = subjectInfo.distributionState;
      }
      if (subjectInfo.progress) {
        subjectModel.progress = subjectInfo.progress;
      }
      if (subjectInfo.pos) {
        subjectModel.pos = subjectInfo.pos;
      }

      // 有新上传文件
      if (subjectInfo.createFiles) {
        subjectModel.files.push(...subjectInfo.createFiles);
      }

      // 有删除文件
      if (subjectInfo.deleteFiles) {
        subjectInfo.deleteFiles.forEach((deleteFile) => {
          mongodbGridfsService.deleteFile(deleteFile._id).catch(() => false);
          subjectModel.files.pull({ _id: deleteFile._id });
        });
      }

      let data = await subjectModel.save();
      res.json(data);

      notifyActionService
        .createAction({
          type: 'update_quality_inspect_subject',
          data: subjectInfo,
          idCreatedBy: req.user._id,
          idEntity: subjectInfo._id,
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

      let subjectData = await QualityInspectSubjectModel.findOne({
        _id,
      });
      if (subjectData === null) {
        res.status(500).json({ msg: '主题不存在' });
        return;
      }

      subjectData.deleted = true;
      subjectData.files.pull({});
      await subjectData.save();

      // 删除 Subject 中的附件
      subjectData.files.map((file) => {
        mongodbGridfsService.deleteFile(file._id).catch((e) => false);
      });

      res.json({});

      notifyActionService
        .createAction({
          type: 'delete_quality_inspect_subject',
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

const qualityInspectSubjectController = new QualityInspectSubjectController();

router.post(
  '/api/quality/inspect_subject/create',
  qualityInspectSubjectController.create
);

router.get(
  '/api/quality/inspect_subject/search',
  qualityInspectSubjectController.search
);

router.post(
  '/api/quality/inspect_subject/update',
  qualityInspectSubjectController.update
);

router.delete(
  '/api/quality/inspect_subject/delete',
  qualityInspectSubjectController.delete
);
export default router;
