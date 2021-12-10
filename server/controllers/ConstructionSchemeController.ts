import express, { NextFunction, Request, Response } from 'express';
import { ConstructionSchemeModel } from '../services/mongoose-models/construction_scheme';
import { DictionariesModel } from '../services/mongoose-models/dictionaries';
import auditingService from '../services/AuditingService';

const router = express.Router();

class ConstructionSchemeController {
  async create(req: Request, res: Response, next: NextFunction) {
    const constructionInfo = req.body;

    let constructionModel: any;
    try {
      constructionModel = new ConstructionSchemeModel({
        name: constructionInfo.name,
        type: constructionInfo.type,
        projectName: constructionInfo.projectName,
        nodeFiles: constructionInfo.nodeFiles,
        idCreatedBy: req.user._id,
      });

      //保存数据
      constructionModel = await constructionModel.save().catch((error) => {
        res.status(200).json({
          code: 4001,
          msg: '创建施工方案失败',
          data: error.message,
        });
        throw error.message;
      });
      console.log('创建施工方案成功');

      // 查询字典数据
      let dictData = await DictionariesModel.findOne({
        dataType: 'SG_SCHEME',
        usWd: constructionModel.type,
      });

      if (!dictData) {
        res.status(200).json({
          code: 4001,
          msg: '字典数据为空',
          data: null,
        });
        throw '字典数据为空';
      }

      // 发起审核流程
      let auditingInfo: any = {};
      auditingInfo.approvalName = constructionModel.name;
      auditingInfo.approvalSettingId = dictData.dataValue;
      auditingInfo.operatorId = req.user._id;
      let attachments = [];
      constructionInfo.nodeFiles.forEach((element) => {
        attachments.push({
          typeId: element.attachmentType,
          attachmentId: element.resourceId,
        });
      });
      auditingInfo.attachments = attachments;
      auditingInfo.bizData = constructionModel.bizData;

      let auditData = await auditingService
        .addFlow(auditingInfo)
        .catch(async (error) => {
          res.status(200).json({
            code: 4001,
            msg: '发起审核流程失败',
            data: error.message,
          });
          throw error.message;
        });

      if (auditData.code !== 0) {
        res.json({
          code: 4001,
          msg: '发起审核流程失败',
          data: auditData.msg,
        });
        throw auditData.msg;
      }

      //获取流程配置信息失败
      let approvalSettingData = await auditingService
        .getApprovalSettingById(dictData.dataValue)
        .catch(async (error) => {
          res.status(200).json({
            code: 4001,
            msg: '获取流程配置信息失败',
            data: error.message,
          });
          throw error.message;
        });

      if (approvalSettingData.code !== 0) {
        res.json({
          code: 4001,
          msg: '获取流程配置信息失败',
          data: approvalSettingData.msg,
        });
        throw approvalSettingData.msg;
      }

      let updateData: any = {};
      updateData.idAuditing = auditData.data.approvalId;

      // 获取节点表单数据
      let bizForms = approvalSettingData.data.bizForms;
      if (bizForms.length > 0) {
        updateData.modelFile = bizForms;
      }

      constructionModel = await ConstructionSchemeModel.findByIdAndUpdate(
        constructionModel._id,
        updateData,
        { new: true }
      ).catch((error) => {
        res.status(200).json({
          code: 4001,
          msg: '更新施工方案审核ID失败',
          data: error.message,
        });
        throw error.message;
      });

      res.status(200).json({
        code: 200,
        msg: 'SUCCESS',
        data: constructionModel,
      });
    } catch (error) {
      if (constructionModel) {
        await ConstructionSchemeModel.deleteOne({ _id: constructionModel._id });
      }
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    let data = [];
    const { _id, name, status, idCreatedBy, myself, limit, page } = req.query;
    const userId = req.user._id;
    try {
      if (_id) {
        let data = await ConstructionSchemeModel.findById({
          _id,
        })
          .populate({
            path: 'account',
            select: ['userName'],
          })
          .lean(true);

        // 判断审核权限
        let approvalData = await auditingService
          .getApprovalById(data.idAuditing, req.user._id)
          .catch(async (error) => {
            res.status(200).json({
              code: 4001,
              msg: '获取流程信息失败',
              data: error.message,
            });
            throw error.message;
          });

        if (approvalData.code !== 0) {
          res.json({
            code: 4001,
            msg: '获取流程信息失败',
            data: approvalData.msg,
          });
          return;
        }
        data.isAuth = false;
        if (data.idAuditing === approvalData.data.approvalId) {
          if (approvalData.data.canOperate) {
            data.isAuth = true;
          }
          data.status = approvalData.data.approvalStatus;
        }
        res.status(200).json({
          code: 200,
          msg: 'SUCCESS',
          data: data,
        });
        return;
      }

      let newLimit = +limit || 10;
      let skip = +page * newLimit;

      let searchInfo: any = {};

      // 名称搜索
      if (name) {
        searchInfo.name = new RegExp(name as string);
      }

      // 受理状态
      if (status) {
        searchInfo.status = status;
      }

      // 我发起的
      if (idCreatedBy) {
        searchInfo.idCreatedBy = userId;
      }

      data = await ConstructionSchemeModel.find(searchInfo)
        .populate({
          path: 'account',
          select: ['userName'],
        })
        .sort({ atCreated: -1 })
        .lean(true);

      // 判断审核权限
      let approvalIds = [];
      data.forEach((element) => {
        approvalIds.push(element.idAuditing);
        element.isAuth = false;
      });

      let approvalData = await auditingService
        .getApprovalByIds(approvalIds, req.user._id)
        .catch(async (error) => {
          res.status(200).json({
            code: 4001,
            msg: '获取流程信息失败',
            data: error.message,
          });
          throw error.message;
        });

      if (approvalData.code !== 0) {
        res.json({
          code: 4001,
          msg: '获取流程信息失败',
          data: approvalData.msg,
        });
        return;
      }

      data.forEach((item) => {
        approvalData.data.forEach((element) => {
          if (item.idAuditing === element.approvalId) {
            if (element.canOperate) {
              item.isAuth = true;
            }
            item.status = element.approvalStatus;
          }
        });
      });
      let count = await ConstructionSchemeModel.countDocuments(searchInfo);
      if (myself) {
        let retData = [];
        data.forEach((item) => {
          if (item.isAuth) {
            retData.push(item);
          }
        });
        data = retData;
        count = retData.length;
      }

      // 分页
      data =
        skip + newLimit >= data.length
          ? data.slice(skip, data.length)
          : data.slice(skip, skip + newLimit);

      res.status(200).json({
        code: 200,
        msg: 'SUCCESS',
        data: { data, count },
      });
    } catch (error) {
      res.status(200).json({
        code: 4001,
        msg: '查询数据失败',
        data: error.message,
      });
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const constructionInfo = req.body;

      let updateData: any = {};

      if (constructionInfo.name) {
        updateData.name = constructionInfo.name;
      }
      if (constructionInfo.type) {
        updateData.type = constructionInfo.type;
      }
      if (constructionInfo.projectName) {
        updateData.projectName = constructionInfo.projectName;
      }
      if (constructionInfo.nodeFiles) {
        updateData.nodeFiles = constructionInfo.nodeFiles;
      }

      let data = await ConstructionSchemeModel.findByIdAndUpdate(
        constructionInfo._id,
        updateData,
        { new: true }
      );

      res.status(200).json({
        code: 200,
        msg: 'SUCCESS',
        data: data,
      });
    } catch (error) {
      res.status(200).json({
        code: 4001,
        msg: '修改失败',
        data: error.message,
      });
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      let { _id } = req.query as any;
      if (!_id) {
        res.status(200).json({
          code: 4001,
          msg: 'ID为空',
          data: null,
        });
        return;
      }

      let schemeData = await ConstructionSchemeModel.findOne({
        _id,
      });
      if (schemeData === null) {
        res.status(200).json({
          code: 4001,
          msg: '施工方案不存在',
          data: null,
        });
        return;
      }

      let deleteInfo: any = {};
      deleteInfo.deleted = true;
      deleteInfo.nodeFiles.pull({});
      await ConstructionSchemeModel.findByIdAndUpdate(_id, deleteInfo, {
        new: true,
      });

      res.status(200).json({
        code: 200,
        msg: '删除成功',
        data: null,
      });
    } catch (error) {
      res.status(200).json({
        code: 4001,
        msg: '删除失败',
        data: error.message,
      });
      next(error);
    }
  }
}

const constructionSchemeController = new ConstructionSchemeController();

router.post(
  '/api/constructionScheme/create',
  constructionSchemeController.create
);

router.get(
  '/api/constructionScheme/search',
  constructionSchemeController.search
);

router.post(
  '/api/constructionScheme/update',
  constructionSchemeController.update
);

router.delete(
  '/api/constructionScheme/update',
  constructionSchemeController.delete
);

export default router;
