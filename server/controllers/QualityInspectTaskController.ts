import { Request, Response, NextFunction, Router } from 'express';

import { QualityInspectTaskModel } from '../services/mongoose-models/quality_inspect_task';
import { QualityInspectSubjectModel } from '../services/mongoose-models/quality_inspect_subject';
import mongodbGridfsService from '../services/MongodbGridfsService';
import notifyActionService from '../services/NotifyActionService';

const router = Router();
class QualityInspectTaskController {
  async create(req: Request, res: Response, next: NextFunction) {
    const taskInfo = req.body;
    try {
      let qInspectTaskModel = new QualityInspectTaskModel({
        idRectification: taskInfo.idRectification,
        idReport: taskInfo.idReport,
        idSubject: taskInfo.idSubject,
        files: taskInfo.files,
        level: taskInfo.level,
        progress: taskInfo.progress,
        content: taskInfo.content,
        status: taskInfo.status,
        idCreator: req.user._id,
        idParticipate: taskInfo.idParticipate,
        name: taskInfo.name,
        endTime: new Date(taskInfo.endTime),
        idExecutive: taskInfo.idExecutive,
        idsCC: taskInfo.idsCC,
      });

      qInspectTaskModel = await qInspectTaskModel.save();
      res.json(qInspectTaskModel);

      notifyActionService
        .createAction({
          type: 'create_quality_inspect_task',
          data: qInspectTaskModel,
          idCreatedBy: req.user._id,
          idEntity: taskInfo._id,
        })
        .catch((err) => console.log('error', err));
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    let data = [];
    let { _id, idRectification, idReport } = req.query;

    try {
      if (_id) {
        let data = await QualityInspectTaskModel.findOne({
          _id: _id,
        });
        res.json(data);
        return;
      }
      let searchInfo: any = {};
      if (idRectification) {
        searchInfo.idRectification = idRectification;
      }
      if (idReport) {
        searchInfo.idReport = idReport;
      }
      data = await QualityInspectTaskModel.find(searchInfo);

      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const taskInfo = req.body;

      let taskModel = await QualityInspectTaskModel.findOne({
        _id: taskInfo._id,
      });
      if (taskInfo.level) {
        taskModel.level = taskInfo.level;
      }
      if (taskInfo.progress) {
        taskModel.progress = taskInfo.progress;
      }
      if (taskInfo.content) {
        taskModel.content.push(taskInfo.content);
      }
      if (taskInfo.status) {
        taskModel.status = taskInfo.status;
      }
      if (taskInfo.idParticipate) {
        taskModel.idParticipate = taskInfo.idParticipate;
      }
      if (taskInfo.name) {
        taskModel.name = taskInfo.name;
      }
      if (taskInfo.idExecutive) {
        taskModel.idExecutive = taskInfo.idExecutive;
      }
      if (taskInfo.endTime) {
        taskModel.endTime = new Date(taskInfo.endTime);
      }
      if (taskInfo.idsCC) {
        taskModel.idsCC = taskInfo.idsCC;
      }

      // 有新上传文件
      if (taskInfo.createFiles) {
        taskModel.files.push(...taskInfo.createFiles);
      }

      // 有删除文件
      if (taskInfo.deleteFiles) {
        taskInfo.deleteFiles.forEach((deleteFile) => {
          mongodbGridfsService.deleteFile(deleteFile._id).catch(() => false);
          taskModel.files.pull({ _id: deleteFile._id });
        });
      }

      let data = await taskModel.save();

      res.json(data);

      notifyActionService
        .createAction({
          type: 'update_quality_inspect_task',
          data: taskInfo,
          idCreatedBy: req.user._id,
          idEntity: taskInfo._id,
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

      let taskData = await QualityInspectTaskModel.findOne({
        _id,
      });

      if (taskData === null) {
        res.status(500).json({ msg: '任务不存在' });
        return;
      }

      if (taskData.status !== 'todo') {
        res.status(500).json({ msg: '任务已开始' });
        return;
      }

      taskData.deleted = true;
      taskData.files.pull({});
      await taskData.save();

      // 删除 task 中的附件
      taskData.files.map((file) => {
        mongodbGridfsService.deleteFile(file._id).catch((e) => false);
      });

      res.json({});

      notifyActionService
        .createAction({
          type: 'delete_quality_inspect_task',
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

const qualityInspectTaskController = new QualityInspectTaskController();

// 质量检查-任务创建
router.post(
  '/api/quality/inspect_task/create',
  qualityInspectTaskController.create
);

// 质量检查-任务查询
router.get(
  '/api/quality/inspect_task/search',
  qualityInspectTaskController.search
);

// 质量检查-任务修改
router.post(
  '/api/quality/inspect_task/update',
  qualityInspectTaskController.update
);

// 质量检查-任务删除
router.delete(
  '/api/quality/inspect_task/delete',
  qualityInspectTaskController.delete
);

export default router;
