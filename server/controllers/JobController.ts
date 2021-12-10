import { Request, Response, NextFunction, Router } from 'express';

import { JobModel } from '../services/mongoose-models/job';
import notifyActionService from '../services/NotifyActionService';

const router = Router();

class JobController {
  async create(req: Request, res: Response, next: NextFunction) {
    const jobInfo = req.body;

    try {
      let jobModel = new JobModel({
        name: jobInfo.name,
        parentId: jobInfo.parentId,
        path: jobInfo.path,
        idDepartment: jobInfo.idDepartment,
        idCompany: jobInfo.idCompany,
      });

      jobModel = await jobModel.save();
      res.json(jobModel);

      notifyActionService
        .createAction({
          type: 'create_job',
          data: jobModel,
          idCreatedBy: req.user._id,
          idEntity: jobInfo._id,
        })
        .catch((err) => console.log('error', err));
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    let data = [];
    let { _id } = req.query;
    try {
      if (_id) {
        let data = await JobModel.findOne({
          _id: _id,
        }).populate({
          path: 'account',
        });
        res.json(data);
        return;
      }
      data = await JobModel.find({}).populate({
        path: 'account',
      });
    } catch (error) {
      next(error);
      return;
    }
    res.json(data);
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const jobInfo = req.body;

      let jobModel = await JobModel.findOne({
        _id: jobInfo._id,
      });

      if (jobInfo.name) {
        jobModel.name = jobInfo.name;
      }
      if (jobInfo.parentId) {
        jobModel.parentId = jobInfo.parentId;
      }
      if (jobInfo.path) {
        jobModel.path = jobInfo.path;
      }
      if (jobInfo.idDepartment) {
        jobModel.idDepartment = jobInfo.idDepartment;
      }

      if (jobInfo.idCompany) {
        jobModel.idCompany = jobInfo.idCompany;
      }

      let data = await jobModel.save();
      res.json(data);

      notifyActionService
        .createAction({
          type: 'update_job',
          data: jobInfo,
          idCreatedBy: req.user._id,
          idEntity: jobInfo._id,
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

      let jobData = JobModel.find({ _id: _id });
      if (jobData === null) {
        res.status(500).json({ msg: '职务不存在' });
        return;
      }

      // 获取所有被删除职务
      let jobDatas = await JobModel.find({
        $or: [{ _id: _id }, { parentId: _id as string }],
      });

      jobDatas.forEach((jobData) => {
        jobData.deleted = true;
        jobData.save();
      });

      res.json({});

      notifyActionService
        .createAction({
          type: 'delete_job',
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

const jobController = new JobController();

// 组织架构关管理-职务创建
router.post('/api/job/create', jobController.create);

// 组织架构关管理-职务查询
router.get('/api/job/search', jobController.search);

// 组织架构关管理-职务修改
router.post('/api/job/update', jobController.update);

// 组织架构关管理-职务删除
router.delete('/api/job/delete', jobController.delete);

export default router;
