import { CompanyModel } from './../services/mongoose-models/company';
import { Request, Response, NextFunction, Router } from 'express';
import { success, failed, BaseCode } from './CommonResult';
import { QualityInspectThemeModel } from '../services/mongoose-models/quality_inspect_theme';
import { QualityInspectItemModel } from '../services/mongoose-models/quality_inspect_item';
import { DictionariesModel } from '../services/mongoose-models/dictionaries';
import moment from 'moment';
import redisService from '../services/RedisService';
import auditingService from '../services/AuditingService';
import isEmpty from 'lodash/isEmpty';
import { AccountModel } from '../services/mongoose-models/account';


const router = Router();

class QualityInspectThemeController {
  async create(req: Request, res: Response, next: NextFunction) {
    const dataInfo = req.body;
    let { perilsInfo, itemInfos } = dataInfo;

    if (isEmpty(perilsInfo) || isEmpty(itemInfos)) {
      res.status(200).json({
        code: 4001,
        msg: '参数不全',
        data: null,
      });
      return;
    }

    let perilsModel: any;
    let itemModels = [];
    try {
      let seq = await redisService.getSequenceNumber('PC');
      let endTime = null;
      if (perilsInfo.endTime) {
        endTime = new Date(perilsInfo.endTime);
      }
      perilsModel = new QualityInspectThemeModel({
        name: perilsInfo.name,
        number: `${seq}_00`,
        desc: perilsInfo.desc,
        type: perilsInfo.type,
        perilsTime: new Date(perilsInfo.perilsTime),
        partCompanys: perilsInfo.partCompanys,
        perilsResults: perilsInfo.perilsResults,
        executor: perilsInfo.executor,
        endTime: endTime,
        nodeFiles: perilsInfo.nodeFiles,
        idCreatedBy: req.user._id,
      });

      perilsModel = await perilsModel.save().catch((error) => {
        res.status(200).json({
          code: 4001,
          msg: '创建质量检查主题失败',
          data: error.message,
        });
        throw error.message;
      });
      console.log('创建质量检查主题成功');

      let itemModel: any;
      for (let i = 0; i < itemInfos.length; i++) {
        let itemInfo = itemInfos[i];
        itemModel = new QualityInspectItemModel({
          name: itemInfo.name,
          // type: itemInfo.type,
          remark: itemInfo.remark,
          idPerils: perilsModel._id,
          nodeFiles: itemInfo.nodeFiles,
          idCreatedBy: req.user._id,
        });

        itemModel = await itemModel.save().catch(async (error) => {
          res.status(200).json({
            code: 4001,
            msg: '创建问题项失败',
            data: error.message,
          });
          throw error.message;
        });
        itemModels.push(itemModel);
      }
      console.log('创建问题项成功');

      let executorInfo = await AccountModel.findById({
        _id: perilsModel.executor,
      }).populate({
        path: 'company',
      });

      // 查询字典数据
      let dictData = await DictionariesModel.findOne({
        dataType: 'QUALITY_INSPECT',
        usWd: req.user.company.type + '-' + executorInfo['company']['type'],
      });

      if (!dictData) {
        console.log(111);

        res.status(200).json({
          code: 4001,
          msg: '字典数据为空',
          data: null,
        });
        throw '字典数据为空';
      }

      // 发起审核流程
      let auditingInfo: any = {};
      auditingInfo.approvalName = perilsInfo.name;
      auditingInfo.approvalSettingId = dictData.dataValue;
      auditingInfo.operatorId = req.user._id;
      let attachments = [];
      perilsModel.nodeFiles.forEach((element) => {
        attachments.push({
          typeId: element.attachmentType,
          attachmentId: element.resourceId,
        });
      });
      itemModels.forEach((itemModel) => {
        itemModel.nodeFiles.forEach((element) => {
          attachments.push({
            typeId: element.attachmentType,
            attachmentId: element.resourceId,
          });
        });
      });
      auditingInfo.attachments = attachments;
      auditingInfo.bizData = perilsInfo.bizData;

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

      perilsModel = await QualityInspectThemeModel.findByIdAndUpdate(
        perilsModel._id,
        updateData,
        { new: true }
      ).catch((error) => {
        res.status(200).json({
          code: 4001,
          msg: '更新质量检查主题审核ID失败',
          data: error.message,
        });
        throw error.message;
      });

      res.status(200).json({
        code: 200,
        msg: 'SUCCESS',
        data: { perilsInfo: perilsModel, itemInfo: itemModels },
      });
    } catch (error) {
      // 删除质量检查主题
      if (perilsModel) {
        await QualityInspectThemeModel.deleteOne({
          _id: perilsModel._id,
        });
      }

      // 删除问题项
      for (let i = 0; i < itemModels.length; i++) {
        const itemModel = itemModels[i];
        if (itemModel) {
          await QualityInspectItemModel.deleteOne({
            _id: itemModel._id,
          });
        }
      }
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    let {
      _id,
      page,
      limit,
      name,
      type,
      perilsResults,
      myself,
      idCreatedBy,
    } = req.query as any;

    const userId = req.user._id;
    try {
      if (_id) {
        let data = await QualityInspectThemeModel.findOne({
          _id: _id,
        })
          .populate(['problemItem'])
          .populate({
            path: 'accountExecutor account',
            select: ['userName', 'idCompany', 'idDepartment', 'idJob'],
            populate: {
              path: 'company dept job',
              select: ['name', 'type'],
            },
          })
          .lean(true);

        // 判断审核权限
        let approvalData = await auditingService
          .getApprovalById(data.idAuditing, userId)
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
      // 排查类型
      if (type) {
        searchInfo.type = type;
      }
      // 排查结果
      if (perilsResults) {
        searchInfo.perilsResults = perilsResults;
      }
      // 我发起的
      if (idCreatedBy) {
        searchInfo.idCreatedBy = userId;
      }
      let data = await QualityInspectThemeModel.find(searchInfo)
        .populate(['problemItem'])
        .populate({
          path: 'accountExecutor account',
          select: ['userName', 'idCompany', 'idDepartment', 'idJob'],
          populate: {
            path: 'company dept job',
            select: ['name', 'type'],
          },
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
        .getApprovalByIds(approvalIds, userId)
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

      let count = await QualityInspectThemeModel.countDocuments(searchInfo);

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
      const perilsInfo = req.body;

      let updateInfo: any = {};

      if (perilsInfo.name) {
        updateInfo.name = perilsInfo.name;
      }
      if (perilsInfo.desc) {
        updateInfo.desc = perilsInfo.desc;
      }
      if (perilsInfo.type) {
        updateInfo.type = perilsInfo.type;
      }
      if (perilsInfo.perilsTime) {
        updateInfo.perilsTime = new Date(perilsInfo.perilsTime);
      }
      if (perilsInfo.partCompanys) {
        updateInfo.partCompanys = perilsInfo.partCompanys;
      }
      if (perilsInfo.perilsResults) {
        updateInfo.perilsResults = perilsInfo.perilsResults;
      }
      if (perilsInfo.executor) {
        updateInfo.executor = perilsInfo.executor;
      }
      if (perilsInfo.endTime) {
        updateInfo.endTime = new Date(perilsInfo.endTime);
      }
      if (perilsInfo.nodeFiles) {
        updateInfo.nodeFiles = perilsInfo.nodeFiles;
      }
      if (perilsInfo.status) {
        updateInfo.status = perilsInfo.status;
        // .即时更新：针对"已完成"的检查，在更新状态时需要顺便更新"延期天数"字段，
        // 延期天数= 检查完成时间-检查截止时间，若结果小于0按0存储，若大于0则按实际数字存储，单位：天，四舍五入取整；
        if(+perilsInfo.status === 4) {
          const quality = await QualityInspectThemeModel.findById(perilsInfo._id);

          const diffDays = moment(new Date()).diff(moment(quality.endTime), 'days');
          updateInfo.delayDays = diffDays > 0 ? diffDays : 0;
      
        }
      }

      let data = await QualityInspectThemeModel.findByIdAndUpdate(
        perilsInfo._id,
        updateInfo,
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

      let perilsData = await QualityInspectThemeModel.findOne({
        _id,
      });
      if (perilsData === null) {
        res.status(200).json({
          code: 4001,
          msg: '质量检查主题不存在',
          data: null,
        });
        return;
      }

      let deleteInfo: any = {};
      deleteInfo.deleted = true;
      deleteInfo.nodeFiles.pull({});
      await QualityInspectThemeModel.findByIdAndUpdate(_id, deleteInfo, {
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


  // 1）横坐标：月份，每个月份包含已检查、已整改、延期整改次数；
// 2）纵坐标：即整改或检查次数，单位“次”；
  async qualityStatistical(req: Request, res: Response, next: NextFunction){
    try {
      const result = await QualityInspectThemeModel.aggregate([{
        $project:{
          time:{
            $dateToString: { format: "%Y-%m", date: { $add: ["$atCreated", 8 * 3600000]}} // https://xuexiyuan.cn/article/detail/150.html
          },
          status:1,
          delayDays:1
        },
      },
      {
      $group :{
        _id: "$time",
        inspectCount:{$sum : 1},
        rectifyCount:{
          "$sum":{
            "$cond": [ { "$eq": [ "$status", "4" ] }, 1, 0 ]
          }
        },
         delayCount:{
          "$sum":{
            "$cond": [ { "$gt": [ "$delayDays", 0 ] }, 1, 0 ]
          } 
        },
      },
    }
    ])

      res.json(success(result));
    } catch (error) {
      res.json(failed(null, error.message));
      next(error);
    }
  }


//   时间维度：按30天、3个月、6个月、一年 （即该时间范围内创建的检查）
// 饼图：
// 1）横坐标：“已整改”次数占比（显示数量）、“整改中”次数占比（数量）、“已延期”数占比（数量）；
// 2）纵坐标：占比，百分数；

// 说明：
// 已整改：即已经完成整改检查数量，不含延期；
// 整改中：即处于“整改中” 的检查数量，不含延期；
// 已延期：即包含“延期已完成”+“延期未完成”的数量之和；
// 检查总数：即该时间范围内创建的检查总数；
// 已整改占比：（已整改 / 检查总数）*100；
// 整改中占比： （整改中 / 检查总数）*100；
// 已延期占比：（已延期 / 检查总数）*100；
  async qualityCompletionCase(req: Request, res: Response, next: NextFunction){
    try {
      
      const { days } = req.body;
      let searchInfo: any = {};
      searchInfo.atCreated = {
        $gte: new Date(
          moment(new Date()).add(-days, 'days').format('YYYY-MM-DD')
        ),
        $lt: new Date(moment(new Date()).add(1, 'days').format('YYYY-MM-DD')),
      };
      const totalCount = await QualityInspectThemeModel.countDocuments(searchInfo); // 检查总数）

      // searchInfo.status = 4 
      // searchInfo.delayDays = 0
     //已整改
     const  rectifyCount = await QualityInspectThemeModel.countDocuments(Object.assign({},searchInfo,{
      status:'4',
      delayDays:{$eq: 0} // 不延期
     }));
     const rectifyRate = parseInt((rectifyCount / totalCount) * 100 + '') // 已整改占比
     

      // 整改中
       // searchInfo.status = 1
      // searchInfo.delayDays = 0

      const  doingCount = await QualityInspectThemeModel.countDocuments(Object.assign({},searchInfo,{
        status:'1',
        delayDays:{$eq: 0} 
       }));
       const doingRate = parseInt((doingCount / totalCount) * 100 + '') // 已整改占比
       
       // 已延期
       // delayDays > 0
       const  delayCount = await QualityInspectThemeModel.countDocuments(Object.assign({},searchInfo,{
        delayDays:{$gt: 0} //
       }));

       const delayRate = parseInt((delayCount / totalCount) * 100 + '') // 已整改占比
      

      res.json(success({
        totalCount, // 检查总数）
        rectifyCount, //已整改
        rectifyRate , //已整改占比
        doingCount, //整改中
        doingRate, // 已整改占比
        delayCount, // 已延期
        delayRate // 已延期占比
      }));

    } catch (error) {
      res.json(failed(null, error.message));
    }
  }

  //// 个人工作台：数据统计-质量检查/隐患排查-待整改问题项统计
  //   即当月待整改的问题项统计，逻辑如下：
  // 1）取当月，整改状态为“整改中”的检查集合并获取对应的问题项集合；
  // 2）按照检查截止时间，升序排列问题项集合；
  // 3）若系统当前时间大于该问题项“整改截止时间”则返回“已延期”标识，否则返回“整改中”；
  async awaitRectifyStatistical(req: Request, res: Response, next: NextFunction){
    try {
      const { limit , page } = req.query
      const qualityInspectTheme = await QualityInspectThemeModel.find({
        status:'1',
        atCreated: {
         $gte: moment().startOf('month').toDate(),
         $lte: moment().endOf('month').toDate()
        // $gte: moment('2020-01-01').toDate(),
        // $lte: moment('2020-11-01').endOf('month').toDate()
        }
      }).sort({endTime:1})

      const arr = qualityInspectTheme.map(item => {
        return item._id;
      })

      let newLimit = +limit || 10;
      let skip = +page * newLimit;

      const query = {
        idPerils:{
          $in:arr
        }
      }
      const result = await QualityInspectItemModel.find(query).skip(skip)
                    .populate(
                      {
                        path:"idPerils",
                        select:{endTime:1},
                        model: 'QualityInspectThemeModel',
                      })

      const count = await QualityInspectItemModel.countDocuments(query);

      return res.json(success({
        data:result,
        count
      }));

      
    } catch (error) {
      res.json(failed(500, error.message || error));
      next(error);
    }
  }

  async reply(req: Request, res: Response, next: NextFunction) {
    try {
      const itemInfo = req.body;
      let newItem;

      if (itemInfo.length > 0) {
        for (let i = 0; i < itemInfo.length; i++) {
          const element = itemInfo[i];
          let updateInfo: any = {};

          if (element.replyContent) {
            updateInfo.replyContent = element.replyContent;
          }
          if (element.replyFile) {
            updateInfo.replyFile = element.replyFile;
          }
          newItem = await QualityInspectItemModel.findByIdAndUpdate(
            element._id,
            updateInfo,
            {
              new: true,
            }
          );
        }
      }
      return res.json(success(newItem));
    } catch (error) {
      res.json(failed(null, '回复失败,' + error.message));
      next(error);
    }
  }
}

const qualityInspectThemeController = new QualityInspectThemeController();

router.post('/api/quality/theme/create', qualityInspectThemeController.create);

router.get('/api/quality/theme/search', qualityInspectThemeController.search);

router.post('/api/quality/theme/update', qualityInspectThemeController.update);


// 个人工作台：数据统计-质量检查概况统计柱状图接口；
router.post('/api/quality/theme/qualityStatistical', qualityInspectThemeController.qualityStatistical);

// 个人工作台：数据统计-质量检查-整改完成度接口
router.post('/api/quality/theme/qualityCompletionCase', qualityInspectThemeController.qualityCompletionCase);

// 个人工作台：数据统计-质量检查-待整改问题项统计
router.post('/api/quality/theme/awaitRectifyStatistical', qualityInspectThemeController.awaitRectifyStatistical);


router.delete(
  '/api/quality/theme/delete',
  qualityInspectThemeController.delete
);

router.post('/api/quality/theme/reply', qualityInspectThemeController.reply);

export default router;
