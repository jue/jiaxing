import { Request, Response, NextFunction, Router } from 'express';

import { QualityInspectPlanModel } from '../services/mongoose-models/quality_inspect_plan';
import { QualityInspectSubjectModel } from '../services/mongoose-models/quality_inspect_subject';
import mongodbGridfsService from '../services/MongodbGridfsService';
import redisService from '../services/RedisService';
import notifyActionService from '../services/NotifyActionService';
import moment from 'moment';

const router = Router();

class QualityInspectPlanController {
  async create(req: Request, res: Response, next: NextFunction) {
    const planInfo = req.body;
    try {
      let seq = await redisService.getSequenceNumber('JH');

      let qInspectPlanModel = new QualityInspectPlanModel({
        name: planInfo.name,
        files: planInfo.files,
        startTime: new Date(planInfo.startTime),
        endTime: new Date(planInfo.endTime),
        desc: planInfo.desc,
        number: `${seq}_00`,
      });

      qInspectPlanModel = await qInspectPlanModel.save();
      res.json(qInspectPlanModel);

      notifyActionService
        .createAction({
          type: 'create_quality_inspect_plan',
          data: qInspectPlanModel,
          idCreatedBy: req.user._id,
          idEntity: planInfo._id,
        })
        .catch((err) => console.log('error', err));
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    let { _id, page, limit, atCreated } = req.query as any;

    try {
      if (_id) {
        let data = await QualityInspectPlanModel.findOne({
          _id: _id,
        }).populate({
          path: 'subjects',
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
      let data = await QualityInspectPlanModel.find(searchInfo)
        .populate({
          path: 'subjects',
          options: { sort: { pos: 1 } },
        })
        .skip(skip)
        .limit(newLimit)
        .sort({ atCreated: -1 });

      let count = await QualityInspectPlanModel.countDocuments(searchInfo);

      data.map(async (plan) => {
        let planJSON = plan.toJSON();
        let subjectDatas = planJSON.subjects;
        let progressCount = 0;
        let progresslengh = 0;
        let progressAvg = 0;
        subjectDatas.map((subjectData) => {
          progressCount += Number(subjectData.progress);
          progresslengh++;
        });
        if (progresslengh !== 0) {
          progressAvg = progressCount / progresslengh;
        }
        plan.schedule = progressAvg;
      });
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
      const planInfo = req.body;

      let planModel = await QualityInspectPlanModel.findOne({
        _id: planInfo._id,
      });

      if (planInfo.name) {
        planModel.name = planInfo.name;
      }
      if (planInfo.desc) {
        planModel.desc = planInfo.desc;
      }
      if (planInfo.startTime) {
        planModel.startTime = new Date(planInfo.startTime);
      }
      if (planInfo.endTime) {
        planModel.endTime = new Date(planInfo.endTime);
      }
      if (planInfo.schedule) {
        planModel.schedule = planInfo.schedule;
      }
      if (planInfo.state) {
        planModel.state = planInfo.state;
      }

      // 有新上传文件
      if (planInfo.createFiles) {
        planModel.files.push(...planInfo.createFiles);
      }

      // 有删除文件
      if (planInfo.deleteFiles) {
        planInfo.deleteFiles.forEach((deleteFile) => {
          mongodbGridfsService.deleteFile(deleteFile._id).catch(() => false);
          planModel.files.pull({ _id: deleteFile._id });
        });
      }

      let data = await planModel.save();
      res.json(data);

      notifyActionService
        .createAction({
          type: 'update_quality_inspect_plan',
          data: planInfo,
          idCreatedBy: req.user._id,
          idEntity: planInfo._id,
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

      let planData = await QualityInspectPlanModel.findOne({
        _id,
      });
      if (planData === null) {
        res.status(500).json({ msg: '计划不存在' });
        return;
      }

      let subjectData = await QualityInspectSubjectModel.find({
        idPlan: _id,
      });

      subjectData.forEach((subject) => {
        subject.deleted = true;
        subject.files.pull({});
        subject.save();
      });

      planData.deleted = true;
      planData.files.pull({});
      await planData.save();

      // 删除 plan 和 Subject 中的附件
      let fileIds = planData.files.map((file) => file._id);
      subjectData.map((subject) => {
        subject.files.forEach((file) => fileIds.push(file._id));
      });

      await Promise.all(
        fileIds.map((fileId) =>
          mongodbGridfsService.deleteFile(fileId).catch((e) => false)
        )
      );

      res.json({});

      notifyActionService
        .createAction({
          type: 'delete_quality_inspect_plan',
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

const qualityInspectPlanController = new QualityInspectPlanController();

router.post(
  '/api/quality/inspect_plan/create',
  qualityInspectPlanController.create
);

router.get(
  '/api/quality/inspect_plan/search',
  qualityInspectPlanController.search
);

router.post(
  '/api/quality/inspect_plan/update',
  qualityInspectPlanController.update
);

router.delete(
  '/api/quality/inspect_plan/delete',
  qualityInspectPlanController.delete
);

export default router;
