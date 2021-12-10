import express, { NextFunction, Request, Response } from 'express';
import { DBEngineeringChangeModel } from '../services/mongoose-models/engineering_change';
import { DictionariesModel } from '../services/mongoose-models/dictionaries';
import { success, failed, BaseCode } from './CommonResult';
import auditingService from '../services/AuditingService';
import moment from 'antd/node_modules/moment';
const router = express.Router();

class EngineeringChangeController {
  async create(req: Request, res: Response, next: NextFunction) {
    const applyTableInfo = req.body;

    let applyTableModel: any;
    try {
      applyTableModel = new DBEngineeringChangeModel({
        engineeringName: applyTableInfo.engineeringName,
        contractName: applyTableInfo.contractName,
        constructionUnit: applyTableInfo.constructionUnit,
        head: applyTableInfo.head,
        phone: applyTableInfo.phone,
        initiator: applyTableInfo.initiator,

        changeName: applyTableInfo.changeName,
        changeLevel: applyTableInfo.changeLevel,
        changeInitiateUnit: applyTableInfo.changeInitiateUnit,
        estimateAmountChange: applyTableInfo.estimateAmountChange,
        endTime: new Date(applyTableInfo.endTime),
        changeOwner: applyTableInfo.changeOwner,
        changeReason: applyTableInfo.changeReason,
        changeDesc: applyTableInfo.changeDesc,
        needsDesign: applyTableInfo.needsDesign,
        changeDrawings: applyTableInfo.changeDrawings,
        changeAccordingFile: applyTableInfo.changeAccordingFile,
        costStatement: applyTableInfo.costStatement,

        nodeFiles: applyTableInfo.nodeFiles,

        idCreatedBy: req.user._id,
        idEngineering: applyTableInfo.idEngineering,
        idContract: applyTableInfo.idContract,

        contractorUnit: applyTableInfo.contractorUnit || '',
        constructionControlUnit: applyTableInfo.constructionControlUnit || '',
        constructionExectionUnit: applyTableInfo.constructionExectionUnit || '',
        designUnit: applyTableInfo.designUnit || '',
        desideAgree: applyTableInfo.desideAgree || '',
        investmentAmountDesc: applyTableInfo.investmentAmountDesc || '',
        investmentAmount: applyTableInfo.investmentAmount || 0,
        changeType: applyTableInfo.changeType || '',
        feePercent1: applyTableInfo.feePercent1 || 0,
        feePercent2: applyTableInfo.feePercent2 || '',
      });

      //保存数据
      applyTableModel = await applyTableModel.save().catch((error) => {
        res.status(200).json({
          code: 4001,
          msg: '创建工程变更失败',
          data: error.message,
        });
        throw error.message;
      });
      console.log('创建工程变更成功');
      // 查询字典数据
      let dictData = await DictionariesModel.findOne({
        dataType: 'GC_CHANGE',
        usWd: req.user.company.type,
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
      auditingInfo.approvalName = applyTableModel.changeName;
      auditingInfo.approvalSettingId = dictData.dataValue;
      auditingInfo.operatorId = req.user._id;
      let attachments = [];
      applyTableModel.nodeFiles.forEach((element) => {
        attachments.push({
          typeId: element.attachmentType,
          attachmentId: element.resourceId,
        });
      });
      auditingInfo.attachments = attachments;
      auditingInfo.bizData = applyTableInfo.bizData;

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

      //获取流程配置信息
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

      applyTableModel = await DBEngineeringChangeModel.findByIdAndUpdate(
        applyTableModel._id,
        updateData,
        { new: true }
      ).catch((error) => {
        res.status(200).json({
          code: 4001,
          msg: '更新工程变更审核ID失败',
          data: error.message,
        });
        throw error.message;
      });

      res.status(200).json({
        code: 200,
        msg: 'SUCCESS',
        data: applyTableModel,
      });
    } catch (error) {
      if (applyTableModel) {
        await DBEngineeringChangeModel.deleteOne({ _id: applyTableModel._id });
      }
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    let data = [];
    const {
      _id,
      changeLevel,
      changeName,
      status,
      myself,
      idCreatedBy,
      limit,
      page,
    } = req.query;
    const userId = req.user._id;
    try {
      if (_id) {
        let data = await DBEngineeringChangeModel.findById({
          _id,
        })
          .populate(['engineering'])
          .populate({
            path: 'account',
            select: ['username'],
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

      // 变更级别
      if (changeLevel) {
        searchInfo.changeLevel = changeLevel;
      }
      // 受理状态
      if (status) {
        searchInfo.status = status;
      }
      // 变更名称搜索
      if (changeName) {
        searchInfo.changeName = new RegExp(changeName as string);
      }
      // 我发起的
      if (idCreatedBy) {
        searchInfo.idCreatedBy = userId;
      }

      data = await DBEngineeringChangeModel.find(searchInfo)
        .populate(['engineering'])
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

      let count = await DBEngineeringChangeModel.countDocuments(searchInfo);

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
      const applyTableInfo = req.body;
      let updateData: any = {};
      if (applyTableInfo.engineeringName) {
        updateData.engineeringName = applyTableInfo.engineeringName;
      }
      if (applyTableInfo.contractName) {
        updateData.contractName = applyTableInfo.contractName;
      }
      if (applyTableInfo.constructionUnit) {
        updateData.constructionUnit = applyTableInfo.constructionUnit;
      }
      if (applyTableInfo.head) {
        updateData.head = applyTableInfo.head;
      }
      if (applyTableInfo.phone) {
        updateData.phone = applyTableInfo.phone;
      }
      if (applyTableInfo.initiator) {
        updateData.initiator = applyTableInfo.initiator;
      }
      if (applyTableInfo.changeName) {
        updateData.changeName = applyTableInfo.changeName;
      }
      if (applyTableInfo.changeLevel) {
        updateData.changeLevel = applyTableInfo.changeLevel;
      }
      if (applyTableInfo.changeInitiateUnit) {
        updateData.changeInitiateUnit = applyTableInfo.changeInitiateUnit;
      }
      if (applyTableInfo.estimateAmountChange) {
        updateData.estimateAmountChange = applyTableInfo.estimateAmountChange;
      }
      if (applyTableInfo.finalAuditChangeAmount) {
        updateData.finalAuditChangeAmount =
          applyTableInfo.finalAuditChangeAmount;
      }
      if (applyTableInfo.endTime) {
        updateData.endTime = new Date(applyTableInfo.endTime);
      }
      if (applyTableInfo.changeReason) {
        updateData.changeReason = applyTableInfo.changeReason;
      }
      if (applyTableInfo.changeDutyUnit) {
        updateData.changeDutyUnit = applyTableInfo.changeDutyUnit;
      }
      if (applyTableInfo.changeOwner) {
        updateData.changeOwner = applyTableInfo.changeOwner;
      }
      if (applyTableInfo.changeDesc) {
        updateData.changeDesc = applyTableInfo.changeDesc;
      }
      if (applyTableInfo.status) {
        updateData.status = applyTableInfo.status;
      }
      if (applyTableInfo.modelFile) {
        updateData.modelFile = applyTableInfo.modelFile;
      }
      if (applyTableInfo.nodeFiles) {
        updateData.nodeFiles = applyTableInfo.nodeFiles;
      }
      if (applyTableInfo.costStatement) {
        updateData.costStatement = applyTableInfo.costStatement;
      }
      if (applyTableInfo.changeDrawings) {
        updateData.changeDrawings = applyTableInfo.changeDrawings;
      }
      if (applyTableInfo.changeAccordingFile) {
        updateData.changeAccordingFile = applyTableInfo.changeAccordingFile;
      }

      let data = await DBEngineeringChangeModel.findByIdAndUpdate(
        applyTableInfo._id,
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

  //   柱状图：
  // 1）横坐标：月份，每个月份包含变更金额（单位：百万元）、变更次数；
  // 2）纵坐标：数量，包含变更次数、变更费用数据；

  // 说明：
  // 变更费用：即该月发起的总计变更费用；
  // 变更次数：即该月发起的总计变更次数；
  async statistical(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await DBEngineeringChangeModel.aggregate([{
        $project: {
          estimateAmountChange: 1,
          time: {
            $dateToString: { format: "%Y-%m", date: { $add: ["$atCreated", 8 * 3600000] } } // https://xuexiyuan.cn/article/detail/150.html
          },
        },
      },
      {
        $group: {
          _id: "$time",
          count: { $sum: 1 },
          amount: { $sum: '$estimateAmountChange' } // estimateAmountChange 
        },
      }
      ])

      res.json(success(result));
    } catch (error) {
      res.json(failed(null, error.message));
      next(error);
    }
  }

  //   时间维度：按30天、3个月、6个月、一年，即工程变更的创建时间；
  // 饼图：
  // 1）横坐标：“一般变更”涉及费用总计，“重大变更”涉及费用总计；
  // 2）纵坐标：占比，百分数；

  // 说明：
  // “一般变更”总计费用：即审批状态属于“已完成”且变更级别属于“一般变更”的所有变更，“核定变更金额”之和；
  // “重大变更”总计费用：即审批状态属于“已完成”且变更级别属于“一般变更”的所有变更，“核定变更金额”之和；
  // 总变更费用：即按时间维度，计算的该时间范围内总的变更费用；
  // 占比：即“一般变更”总计费用占“总变更费用”的百分比；
  // changeLevel = 'common' | 'great';
  async changeLevelPercent(req: Request, res: Response, next: NextFunction) {
    const { days } = req.body;

    try {
      let searchInfo: any = {};
      searchInfo.atCreated = {
        $gte: new Date(
          moment(new Date()).add(-days, 'days').format('YYYY-MM-DD')
        ),
        $lt: new Date(moment(new Date()).add(1, 'days').format('YYYY-MM-DD')),
      };
      // 总变更费用：即按时间维度，计算的该时间范围内总的变更费用；
      //  investmentAmount: number; // 核定变更金额（保留小数点后两位，例如100.23）
      // console.log('chargePercent',Object.assign({},searchInfo,{
      //   status:'4',
      //  //  changeLevel:'common'
      // }))
      const result = await DBEngineeringChangeModel.aggregate([{
        $match: Object.assign({}, searchInfo, {
          status: '4',
          //  changeLevel:'common'
        }),
      },
      {
        $project: {
          investmentAmount: 1,
          status: 1,
          changeLevel: 1
        },
      },
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: '$investmentAmount' },
          commonAmount: {
            "$sum": {
              "$cond": [{ "$eq": ["$changeLevel", "common"] }, '$investmentAmount', 0]
            }
          },
          greatAmount: {
            "$sum": {
              "$cond": [{ "$eq": ["$changeLevel", "great"] }, '$investmentAmount', 0]
            }
          }
        },
      }
      ]);

      if (!result.length) {
        return res.json(success({
          totalAmount: 0,
          commonAmount: 0,
          greatAmount: 0,
          commonPercent: 0,
          greatPercent: 0,
        }));
      }
      // console.log('result',result)
      const { totalAmount, commonAmount, greatAmount } = result[0]
      const commonPercent = parseInt((commonAmount / totalAmount) * 100 + '') // 一般变更
      const greatPercent = parseInt((greatAmount / totalAmount) * 100 + '') // 一般变更

      res.json(success({
        totalAmount,
        commonAmount,
        greatAmount,
        commonPercent,
        greatPercent
      }));
    } catch (error) {
      res.json(failed(null, error.message));
      next(error);
    }
  }


  //   时间维度：按30天、3个月、6个月、一年，即工程变更的创建时间；
  // 饼图：
  // 1）横坐标：按照变更类别，涉及“施工”变更费用总计，“设计”变更费用总计，“其它”变更费用总计；
  // 2）纵坐标：占比，百分数；

  // 说明：
  // “施工”总计费用：即审批状态属于“已完成”且变更类别属于“施工”的所有变更，“核定变更金额”之和；
  // 总变更费用：即按时间维度，计算的该时间范围内总的核定变更费用；
  // 占比：即“施工”总计费用占“总变更费用”的百分比；
  // changeType  = 'constructionUnit' | 'designUnit' | 'other';
  async changeTypePercent(req: Request, res: Response, next: NextFunction) {
    const { days } = req.body;

    try {
      let searchInfo: any = {};
      searchInfo.atCreated = {
        $gte: new Date(
          moment(new Date()).add(-days, 'days').format('YYYY-MM-DD')
        ),
        $lt: new Date(moment(new Date()).add(1, 'days').format('YYYY-MM-DD')),
      };
      const result = await DBEngineeringChangeModel.aggregate([{
        $match: Object.assign({}, searchInfo, {
          status: '4',
        }),
      },
      {
        $project: {
          investmentAmount: 1,
          status: 1,
          changeType: 1
        },
      },
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: '$investmentAmount' },
          constructionAmount: {
            "$sum": {
              "$cond": [{ "$eq": ["$changeType", "constructionUnit"] }, '$investmentAmount', 0]
            }
          },
          designAmount: {
            "$sum": {
              "$cond": [{ "$eq": ["$changeType", "designUnit"] }, '$investmentAmount', 0]
            }
          },
          otherAmount: {
            "$sum": {
              "$cond": [{ "$eq": ["$changeType", "other"] }, '$investmentAmount', 0]
            }
          }
        },
      }
      ]);

      if (!result.length) {
        return res.json(success({
          totalAmount: 0,
          constructionAmount: 0,
          designAmount: 0,
          otherAmount: 0,
          constructionAmountPercent: 0,
          designPercent: 0,
          otherPercent: 0,
        }));
      }


      const { totalAmount, constructionAmount, designAmount, otherAmount } = result[0]
      const constructionAmountPercent = parseInt((constructionAmount / totalAmount) * 100 + '') // 
      const designPercent = parseInt((designAmount / totalAmount) * 100 + '') // 
      const otherPercent = parseInt((otherAmount / totalAmount) * 100 + '') // 

      
      res.json(success({
        totalAmount,
        constructionAmount,
        designAmount,
        otherAmount,
        constructionAmountPercent,
        designPercent,
        otherPercent
      }));
    } catch (error) {
      res.json(failed(null, error.message));
      next(error);
    }
  }
}

const engineeringChangeController = new EngineeringChangeController();

router.post(
  '/api/engineeringChange/create',
  engineeringChangeController.create
);

router.get('/api/engineeringChange/search', engineeringChangeController.search);

router.post(
  '/api/engineeringChange/update',
  engineeringChangeController.update
);


// 变更费用与次数统计
router.post(
  '/api/engineeringChange/statistical',
  engineeringChangeController.statistical
);

// 变更级别及费用占比
router.post(
  '/api/engineeringChange/changeLevelPercent',
  engineeringChangeController.changeLevelPercent
);

// 变更类别及费用占比
router.post(
  '/api/engineeringChange/changeTypePercent',
  engineeringChangeController.changeTypePercent
);


export default router;
