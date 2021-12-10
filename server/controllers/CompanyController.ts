import { Request, Response, NextFunction, Router } from 'express';

import { CompanyModel } from '../services/mongoose-models/company';
import { DepartmentModel } from '../services/mongoose-models/department';
import { JobModel } from '../services/mongoose-models/job';
import notifyActionService from '../services/NotifyActionService';

const router = Router();
class CompanyController {
  async create(req: Request, res: Response, next: NextFunction) {
    const companyInfo = req.body;

    try {
      let companyModel = new CompanyModel({
        name: companyInfo.name,
        parentId: companyInfo.parentId,
        path: companyInfo.path,
        type: companyInfo.type,
      });

      companyModel = await companyModel.save();
      res.json(companyModel);

      notifyActionService
        .createAction({
          type: 'create_company',
          data: companyModel,
          idCreatedBy: req.user._id,
          idEntity: companyInfo._id,
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
        let data = await CompanyModel.findOne({
          _id: _id,
        }).populate({
          path: 'dept account',
          select: ['userName', 'name'],
          populate: {
            path: 'account',
            select: ['userName'],
          },
        });
        res.json(data);
        return;
      }
      let searchInfo: any = {};
      data = await CompanyModel.find(searchInfo).populate({
        path: 'dept account',
        select: ['userName', 'name'],
        populate: {
          path: 'account',
          select: ['userName'],
        },
      });
    } catch (error) {
      next(error);
      return;
    }
    res.json(data);
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const companyInfo = req.body;

      let companyModel = await CompanyModel.findOne({
        _id: companyInfo._id,
      });

      if (companyInfo.name) {
        companyModel.name = companyInfo.name;
      }
      if (companyInfo.parentId) {
        companyModel.parentId = companyInfo.parentId;
      }
      if (companyInfo.path) {
        companyModel.path = companyInfo.path;
      }
      if (companyInfo.type) {
        companyModel.type = companyInfo.type;
      }

      let data = await companyModel.save();
      res.json(data);

      notifyActionService
        .createAction({
          type: 'update_company',
          data: companyInfo,
          idCreatedBy: req.user._id,
          idEntity: companyInfo._id,
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

      let companyData = CompanyModel.find({ _id: _id });
      if (companyData === null) {
        res.status(500).json({ msg: '单位不存在' });
        return;
      }

      // 获取所有被删除单位id
      let companyDatas = await CompanyModel.find({
        $or: [{ _id: _id }, { parentId: _id as string }],
      });
      let companyIds = [];
      companyDatas.forEach((companyData) => {
        companyIds.push(companyData._id);
        companyData.deleted = true;
        companyData.save();
      });

      // 获取所有被删除部门id
      let departmentDatas = await DepartmentModel.find({
        idCompany: { $in: companyIds },
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
          type: 'delete_company',
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

const companyController = new CompanyController();

// 组织架构关管理-单位创建
router.post('/api/company/create', companyController.create);

// 组织架构关管理-单位查询
router.get('/api/company/search', companyController.search);

// 组织架构关管理-单位修改
router.post('/api/company/update', companyController.update);

// 组织架构关管理-单位删除
router.delete('/api/company/delete', companyController.delete);

export default router;
