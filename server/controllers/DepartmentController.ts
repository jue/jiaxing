import { Request, Response, NextFunction, Router } from 'express';

import { DepartmentModel } from '../services/mongoose-models/department';
import { JobModel } from '../services/mongoose-models/job';
import notifyActionService from '../services/NotifyActionService';

const router = Router();

class DepartmentController {
  async create(req: Request, res: Response, next: NextFunction) {
    const departmentInfo = req.body;

    try {
      let departmentModel = new DepartmentModel({
        name: departmentInfo.name,
        parentId: departmentInfo.parentId,
        path: departmentInfo.path,
        idCompany: departmentInfo.idCompany,
      });

      departmentModel = await departmentModel.save();
      res.json(departmentModel);

      notifyActionService
        .createAction({
          type: 'create_department',
          data: departmentModel,
          idCreatedBy: req.user._id,
          idEntity: departmentInfo._id,
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
        let data = await DepartmentModel.findOne({
          _id: _id,
        }).populate({
          path: 'job',
        });
        res.json(data);
        return;
      }
      data = await DepartmentModel.find({}).populate({
        path: 'job',
      });
    } catch (error) {}
    res.json(data);
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const departmentInfo = req.body;

      let departmentModel = await DepartmentModel.findOne({
        _id: departmentInfo._id,
      });

      if (departmentInfo.name) {
        departmentModel.name = departmentInfo.name;
      }
      if (departmentInfo.parentId) {
        departmentModel.parentId = departmentInfo.parentId;
      }
      if (departmentInfo.path) {
        departmentModel.path = departmentInfo.path;
      }
      if (departmentInfo.idCompany) {
        departmentModel.idCompany = departmentInfo.idCompany;
      }

      let data = await departmentModel.save();
      res.json(data);

      notifyActionService
        .createAction({
          type: 'update_department',
          data: departmentInfo,
          idCreatedBy: req.user._id,
          idEntity: departmentInfo._id,
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

      let departmentData = DepartmentModel.find({
        _id: _id,
      });
      if (departmentData === null) {
        res.status(500).json({ msg: '部门不存在' });
        return;
      }

      // 获取所有被删除部门id
      let departmentDatas = await DepartmentModel.find({
        $or: [{ _id: _id }, { parentId: _id as string }],
      });
      let departmentIds = [];
      departmentDatas.forEach((departmentData) => {
        departmentIds.push(departmentData._id);
        departmentData.deleted = true;
        departmentData.save();
      });

      // 获取所有被删除职务
      let jobDatas = await JobModel.find({
        idDepartment: { $in: departmentIds },
      });

      jobDatas.forEach((jobData) => {
        jobData.deleted = true;
        jobData.save();
      });

      res.json({});

      notifyActionService
        .createAction({
          type: 'delete_department',
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

const departmentController = new DepartmentController();

// 组织架构关管理-部门创建
router.post('/api/department/create', departmentController.create);

// 组织架构关管理-部门查询
router.get('/api/department/search', departmentController.search);

// 组织架构关管理-部门修改
router.post('/api/department/update', departmentController.update);

// 组织架构关管理-部门删除
router.delete('/api/department/delete', departmentController.delete);

export default router;
