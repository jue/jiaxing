import { Request, Response, NextFunction, Router } from 'express';
import catchErrors from 'async-error-catcher';
import _ from 'lodash';

import { BaseCode, failed, success } from '../controllers/CommonResult';
import { AccountModel } from '../services/mongoose-models/account';
import { CompanyModel } from '../services/mongoose-models/company';
import isEmpty from 'lodash/isEmpty';
import { DBEngineeringChangeModel } from '../services/mongoose-models/engineering_change';
import { ConstructionSchemeModel } from '../services/mongoose-models/construction_scheme';
import { ContractModel } from '../services/mongoose-models/contract';
import { QualityInspectThemeModel } from '../services/mongoose-models/quality_inspect_theme';
import { SecurityRisksHiddenPerilsModel } from '../services/mongoose-models/security_risks_hidden_perils';
import { DepartmentModel } from '../services/mongoose-models/department';

const router = Router();

class CallbackController {
  async getUser(req: Request, res: Response, next: NextFunction) {
    let { userId } = req.params;
    try {
      let data: any;
      data = await AccountModel.findById({ _id: userId })
        .populate({
          path: 'company',
        })
        .populate({
          path: 'dept',
        })
        .populate({
          path: 'job',
        })
        .lean(true);
      const company = await CompanyModel.findById({ _id: data.idCompany });

      res.json({
        userId: data._id,
        userName: data.userName,
        companyType: _.get(company, 'type') || '',
        companyId: _.get(data, 'idCompany') || '',
        company: _.get(data, 'company.name') || '',
        deptId: _.get(data, 'idDepartment'),
        dept: _.get(data, 'dept.name'),
        roleId: _.get(data, 'idJob') || '',
        role: _.get(data, 'job.name') || '',
        signId: _.get(data, 'signId') || '',
      });
    } catch (error) {
      next(error);
    }
  }

  async approvalData(req: Request, res: Response, next: NextFunction) {
    let approvalData = req.body;
    let { data, table, approvalId } = approvalData;

    if (isEmpty(data) || isEmpty(table) || isEmpty(approvalId)) {
      return res.json(failed(BaseCode.PARAM_FAILED, '参数不全'));
    }
    try {
      switch (table) {
        case 'engineering_change':
          await DBEngineeringChangeModel.findOneAndUpdate(
            { idAuditing: approvalId },
            data
          )
            .then(() => {
              return res.json(success(null));
            })
            .catch(() => {
              return res.json(failed());
            });
          break;
        case 'construction_schema':
          await ConstructionSchemeModel.findOneAndUpdate(
            { idAuditing: approvalId },
            data
          )
            .then(() => {
              return res.json(success(null));
            })
            .catch(() => {
              return res.json(failed());
            });
          break;
        case 'contract':
          await ContractModel.findOneAndUpdate({ idAuditing: approvalId }, data)
            .then(() => {
              return res.json(success(null));
            })
            .catch(() => {
              return res.json(failed());
            });
          break;
        case 'quality_inspect_theme':
          await QualityInspectThemeModel.findOneAndUpdate(
            { idAuditing: approvalId },
            data
          )
            .then(() => {
              return res.json(success(null));
            })
            .catch(() => {
              return res.json(failed());
            });
          break;
        case 'security_risks_hidden_perils':
          await SecurityRisksHiddenPerilsModel.findOneAndUpdate(
            { idAuditing: approvalId },
            data
          )
            .then(() => {
              return res.json(success(null));
            })
            .catch(() => {
              return res.json(failed());
            });
          break;
        default:
          return res.json(failed());
      }
    } catch (error) {
      next(error);
    }
  }

  async getCompanies(req: Request, res: Response) {
    const companies = (await CompanyModel.find({})) || [];
    const companiesRes: {
      companyId: string;
      companyName: string;
      parentId: string;
    }[] = _.map(companies, (company) => ({
      companyId: company._id,
      companyName: company.name,
      parentId: company.parentId,
    }));

    res.json(success(companiesRes));
  }

  async getDepartmentsByQuery(req: Request, res: Response) {
    const { companyId, all } = req.query;
    let query: {
      idCompany?: string;
    } = {};

    if (!companyId && !all) {
      throw new Error('companyId or all is required!');
    }

    if (companyId) {
      query.idCompany = companyId as string;
    }
    if (all) {
      query = {};
    }

    const departments = (await DepartmentModel.find(query)) || [];
    const departmentsRes: {
      departmentId: string;
      departmentName: string;
      // string is ok, but for compatible, we should use String
      companyId: String;
      parentId: string;
    }[] = _.map(departments, (department) => ({
      departmentId: department._id,
      departmentName: department.name,
      companyId: department.idCompany,
      parentId: department.parentId,
    }));

    res.json(success(departmentsRes));
  }

  async getUsersByQuery(req: Request, res: Response) {
    const { companyId, departmentId, jobId, name, userId, userIds } = req.body;
    const query: {
      userIds?: string[];
      idCompany?: string;
      idDepartment?: string;
      idJob?: string;
      username?: RegExp;
      _id?: string | object;
    } = {};

    if (!companyId && !departmentId && !jobId && !name && !userId && !userIds) {
      throw new Error('name or departmentId or userId or userIds is required!');
    }

    if (companyId) {
      query.idCompany = companyId;
    }
    if (departmentId) {
      query.idDepartment = departmentId;
    }
    if (jobId) {
      query.idJob = jobId;
    }
    if (name) {
      query.username = new RegExp(name, 'g');
    }
    if (userId) {
      query._id = userId;
    }
    if (userIds && userIds.length) {
      query._id = { $in: userIds };
    }

    const users: any[] =
      (await AccountModel.find(query)
        .populate({
          path: 'company',
          select: ['name'],
        })
        .populate({
          path: 'dept',
          select: ['name'],
        })) || [];
    const usersRes: {
      companyId: string;
      companyName: string;
      departmentId: string;
      departmentName: string;
      userId: string;
      name: string;
    }[] = _.map(users, (user) => ({
      companyId: user.idCompany,
      companyName: _.get(user, 'company.name') || '',
      departmentId: _.get(user, 'idDepartment') || '',
      departmentName: _.get(user, 'dept.name') || '',
      userId: user._id,
      name: user.username || user.userName,
    }));

    res.json(success(usersRes));
  }
}

const callbackController = new CallbackController();

router.get('/user/:userId', callbackController.getUser);

router.post('/approval/data', callbackController.approvalData);

router.get('/company', catchErrors(callbackController.getCompanies));

router.get(
  '/department',
  catchErrors(callbackController.getDepartmentsByQuery)
);

router.post('/user', catchErrors(callbackController.getUsersByQuery));

export default router;
