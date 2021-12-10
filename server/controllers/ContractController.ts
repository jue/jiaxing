import { Router, Request, Response, NextFunction } from 'express';
import redisService from '../services/RedisService';
import {
  ContractModel,
  SGContractModel,
  JLContractModel,
  OtherContractModel,
} from '../services/mongoose-models/contract';
import {
  DBSGContractI,
  DBJLContractI,
  DBOtherContractI,
} from '../../typings/contract';
import { DictionariesModel } from '../services/mongoose-models/dictionaries';
import auditingService from '../services/AuditingService';
import { success, failed, BaseCode } from './CommonResult';

const router = Router();

class ContractController {
  async create(req: Request, res: Response, next: NextFunction) {
    const userId = req.user._id;
    const contractInfo = req.body;
    const usWd = req.user.company.type;
    try {
      switch (contractInfo.contractType) {
        case 'construction':
          await new SGContractModel(getSGContract(contractInfo, userId))
            .save()
            .then(async (contractModel) => {
              await queryDict(usWd)
                .then(async (approvalSettingId) => {
                  await approve(contractModel, approvalSettingId, userId)
                    .then(async (data) => {
                      await SGContractModel.findByIdAndUpdate(
                        contractModel._id,
                        data,
                        { new: true }
                      )
                        .then(async () => {
                          //删除redis草稿数据
                          let key = `${redisService.namespace}:contractHistory:${req.user._id}`;
                          await redisService.del(key);
                          return res.json(success(contractModel));
                        })
                        .catch((error) => {
                          remove(contractModel._id);
                          return res.json(
                            failed(
                              BaseCode.UPDATE_IDAUDITING_FAILED,
                              '更新审核流程ID失败,' + error.message
                            )
                          );
                        });
                    })
                    .catch((error) => {
                      remove(contractModel._id);
                      return res.json(
                        failed(
                          BaseCode.APPROVAL_FAILED,
                          '发起审核失败,' + error.message
                        )
                      );
                    });
                })
                .catch((error) => {
                  remove(contractModel._id);
                  return res.json(
                    failed(BaseCode.DICT_NOT_EXIST, error.message)
                  );
                });
            })
            .catch((error) => {
              return res.json(failed(null, '创建合同失败,' + error.message));
            });
          break;

        case 'supervision':
          await new JLContractModel(getJLContract(contractInfo, userId))
            .save()
            .then(async (contractModel) => {
              await queryDict(usWd)
                .then(async (approvalSettingId) => {
                  await approve(contractModel, approvalSettingId, userId)
                    .then(async (data) => {
                      await JLContractModel.findByIdAndUpdate(
                        contractModel._id,
                        data,
                        { new: true }
                      )
                        .then(async () => {
                          //删除redis草稿数据
                          let key = `${redisService.namespace}:contractHistory:${req.user._id}`;
                          await redisService.del(key);
                          return res.json(success(contractModel));
                        })
                        .catch((error) => {
                          remove(contractModel._id);
                          return res.json(
                            failed(
                              BaseCode.UPDATE_IDAUDITING_FAILED,
                              '更新审核流程ID失败,' + error.message
                            )
                          );
                        });
                    })
                    .catch((error) => {
                      remove(contractModel._id);
                      return res.json(
                        failed(
                          BaseCode.APPROVAL_FAILED,
                          '发起审核失败,' + error.message
                        )
                      );
                    });
                })
                .catch((error) => {
                  remove(contractModel._id);
                  return res.json(
                    failed(BaseCode.DICT_NOT_EXIST, error.message)
                  );
                });
            })
            .catch((error) => {
              return res.json(failed(null, '创建合同失败,' + error.message));
            });
          break;
        case 'other':
          await new OtherContractModel(getOtherContract(contractInfo, userId))
            .save()
            .then(async (contractModel) => {
              await queryDict(usWd)
                .then(async (approvalSettingId) => {
                  await approve(contractModel, approvalSettingId, userId)
                    .then(async (data) => {
                      await OtherContractModel.findByIdAndUpdate(
                        contractModel._id,
                        data,
                        { new: true }
                      )
                        .then(async () => {
                          //删除redis草稿数据
                          let key = `${redisService.namespace}:contractHistory:${req.user._id}`;
                          await redisService.del(key);
                          return res.json(success(contractModel));
                        })
                        .catch((error) => {
                          remove(contractModel._id);
                          return res.json(
                            failed(
                              BaseCode.UPDATE_IDAUDITING_FAILED,
                              '更新审核流程ID失败,' + error.message
                            )
                          );
                        });
                    })
                    .catch((error) => {
                      remove(contractModel._id);
                      return res.json(
                        failed(
                          BaseCode.APPROVAL_FAILED,
                          '发起审核失败,' + error.message
                        )
                      );
                    });
                })
                .catch((error) => {
                  remove(contractModel._id);
                  return res.json(
                    failed(BaseCode.DICT_NOT_EXIST, error.message)
                  );
                });
            })
            .catch((error) => {
              return res.json(failed(null, '创建合同失败,' + error.message));
            });
          break;
        default:
          return res.json(failed(BaseCode.DATA_NOT_EXIST, '合同类型不存在'));
      }
    } catch (error) {
      res.json(failed());
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    let data = [];
    let userId = req.user._id;
    try {
      const {
        _id,
        idEngineering,
        name,
        contractType,
        idCreatedBy,
        myself,
        status,
        limit,
        page,
      } = req.query;

      if (_id) {
        let data = await ContractModel.findById({
          _id,
        })
          .populate('engineering')
          .populate({
            path: 'account',
            select: ['username'],
          })
          .sort({ atCreated: -1 })
          .lean(true);

        // 判断审核权限
        await auditingService
          .getApprovalById(data.idAuditing, req.user._id)
          .then((approvalData) => {
            if (approvalData.code !== 0) {
              return res.json(
                failed(
                  BaseCode.APPROVAL_FAILED,
                  '获取流程信息失败,' + approvalData.msg
                )
              );
            }
            data.isAuth = false;
            if (data.idAuditing === approvalData.data.approvalId) {
              if (approvalData.data.canOperate) {
                data.isAuth = true;
              }
              data.status = approvalData.data.approvalStatus;
            }
            return res.json(success(data));
          })
          .catch(async (error) => {
            return res.json(
              failed(
                BaseCode.APPROVAL_FAILED,
                '获取流程信息失败,' + error.message
              )
            );
          });
        return;
      }

      let newLimit = +limit;
      let skip = +page * newLimit;
      let queryInfo: any = {};

      if (idEngineering) {
        queryInfo.idEngineering = idEngineering;
      }
      if (name) {
        queryInfo.name = new RegExp(name as string);
      }
      if (contractType) {
        queryInfo.contractType = contractType;
      }
      if (status) {
        queryInfo.status = status;
      }
      if (idCreatedBy) {
        queryInfo.idCreatedBy = userId;
      }
      data = await ContractModel.find(queryInfo)
        .populate('engineering')
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

      await auditingService
        .getApprovalByIds(approvalIds, req.user._id)
        .then(async (approvalData) => {
          if (approvalData.code !== 0) {
            return res.json(
              failed(
                BaseCode.APPROVAL_FAILED,
                '获取流程信息失败,' + approvalData.msg
              )
            );
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

          let count = await ContractModel.countDocuments(queryInfo);

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
          if (!(isNaN(skip) || isNaN(newLimit))) {
            // 分页
            data =
              skip + newLimit >= data.length
                ? data.slice(skip, data.length)
                : data.slice(skip, skip + newLimit);
          }
          return res.json(success({ data, count }));
        })
        .catch((error) => {
          return res.json(
            failed(
              BaseCode.APPROVAL_FAILED,
              '获取流程信息失败,' + error.message
            )
          );
        });
    } catch (error) {
      res.json(failed());
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const contractInfo = req.body;
      let updateInfo: any = {};
      if (contractInfo.contractEffectiveDate) {
        updateInfo.contractEffectiveDate = new Date(
          contractInfo.contractEffectiveDate
        );
      }
      if (contractInfo.nodeFiles) {
        updateInfo.nodeFiles = contractInfo.nodeFiles;
      }
      if (contractInfo.status) {
        updateInfo.status = contractInfo.status;
      }
      let data = await ContractModel.findByIdAndUpdate(
        contractInfo._id,
        updateInfo,
        { new: true }
      );
      return res.json(success(data));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      let { _id } = req.query;
      if (!_id) {
        return res.json(failed(BaseCode.PARAM_FAILED, 'ID为空'));
      }

      let contractDatas = await ContractModel.find({ _id: _id });
      if (contractDatas === null) {
        return res.json(failed(BaseCode.DATA_NOT_EXIST, '合同不存在'));
      }

      contractDatas.forEach((contractData) => {
        contractData.deleted = true;
        contractData.save();
      });
      return res.json(success(null));
    } catch (error) {
      res.json(failed());
      next(error);
    }
  }

  async historyCreate(req: Request, res: Response, next: NextFunction) {
    const hisInfo = req.body;
    let userId = req.user._id;
    try {
      let data = await redisService.setContractHistory(hisInfo, userId);
      return res.json(success(data));
    } catch (error) {
      res.json(failed());
      next(error);
    }
  }

  async historySearch(req: Request, res: Response, next: NextFunction) {
    let userId = req.user._id;
    try {
      let data = await redisService.getContractHistoryByUserId(userId);
      return res.json(success(data));
    } catch (error) {
      res.json(failed());
      next(error);
    }
  }
}

function getBaseContract(contractInfo: any) {
  let baseContract: any = {
    tendertype: contractInfo.tendertype,
    contractType: contractInfo.contractType,
    letterAcceptance: contractInfo.letterAcceptance,
    capitalSource: contractInfo.capitalSource,
    name: contractInfo.name,
    number: contractInfo.number,
    unitUnifiedNumber: contractInfo.unitUnifiedNumber,

    partyA: contractInfo.partyA,
    partyALegalPerson: contractInfo.partyALegalPerson,
    partyANumber: contractInfo.partyANumber,
    partyB: contractInfo.partyB,
    amount: contractInfo.amount,
    changedAmount: contractInfo.changedAmount,
    payTerms: contractInfo.payTerms,
    openAccountBank: contractInfo.openAccountBank,
    openAccountPerson: contractInfo.openAccountPerson,
    openAccount: contractInfo.openAccount,

    nodeFiles: contractInfo.nodeFiles,
  };

  return baseContract;
}

function getPublictender(contractInfo: any) {
  let publictender = {
    idEngineering: contractInfo.idEngineering,
    blockName: contractInfo.blockName,
    projectSite: contractInfo.projectSite,
    projectApprovalNumber: contractInfo.projectApprovalNumber,
    projectScale: contractInfo.projectScale,
    projectScope: contractInfo.projectScope,
    advancePaymentType: contractInfo.advancePaymentType,
    advancePaymentAmount: contractInfo.advancePaymentAmount,
    balancePaymentType: contractInfo.balancePaymentType,
    balancePaymentAmount: contractInfo.balancePaymentAmount,
    qualityMoneyType: contractInfo.qualityMoneyType,
    qualityMoneyAmount: contractInfo.qualityMoneyAmount,
    specialTerms: contractInfo.specialTerms,
  };

  return publictender;
}

function getSGContract(contractInfo: DBSGContractI, userId: string) {
  let baseContract = getBaseContract(contractInfo);
  let publictender = getPublictender(contractInfo);

  let SGContract: any = {};

  SGContract = {
    ...baseContract,
    ...publictender,
    contractTime: contractInfo.contractTime,
    tenderTime: contractInfo.tenderTime,
    matEngDesignEstAmount: contractInfo.matEngDesignEstAmount,
    safeCivilizedAmount: contractInfo.safeCivilizedAmount,
    proEngEstAmount: contractInfo.proEngEstAmount,
    provisionalAmount: contractInfo.provisionalAmount,
    changeableAmount: contractInfo.changeableAmount,
    idCreatedBy: userId,
  };

  if (contractInfo.planStartDate) {
    SGContract.planStartDate = new Date(contractInfo.planStartDate);
  }
  if (contractInfo.planEndDate) {
    SGContract.planEndDate = new Date(contractInfo.planEndDate);
  }

  return SGContract;
}

function getJLContract(contractInfo: DBJLContractI, userId: string) {
  let baseContract = getBaseContract(contractInfo);
  let publictender = getPublictender(contractInfo);

  let JLContract: any = {};

  JLContract = {
    ...baseContract,
    ...publictender,
    remunerationType: contractInfo.remunerationType,
    remunerationScope: contractInfo.remunerationScope,
    idCreatedBy: userId,
  };

  return JLContract;
}

function getOtherContract(contractInfo: DBOtherContractI, userId: string) {
  let baseContract = getBaseContract(contractInfo);
  let publictender = getPublictender(contractInfo);

  let OtherContract: any = {};

  OtherContract = {
    ...baseContract,
    ...publictender,
    contractDesc: contractInfo.contractDesc,
    idCreatedBy: userId,
  };

  return OtherContract;
}

async function queryDict(usWd: string) {
  // 查询字典数据
  let dictData = await DictionariesModel.findOne({
    dataType: 'CONTRACT_MANAGE',
    usWd: usWd,
  });

  if (!dictData) {
    throw new Error('字典数据为空');
  }
  return dictData.dataValue;
}

async function approve(
  contractModel: any,
  approvalSettingId: string,
  userId: string
) {
  // 发起审核流程
  let auditingInfo: any = {};
  auditingInfo.approvalName = contractModel.name;
  auditingInfo.approvalSettingId = approvalSettingId;
  auditingInfo.operatorId = userId;
  let attachments = [];
  contractModel.nodeFiles.forEach((element) => {
    attachments.push({
      typeId: element.attachmentType,
      attachmentId: element.resourceId,
    });
  });
  auditingInfo.attachments = attachments;
  auditingInfo.bizData = contractModel.bizData;
  let auditData = await auditingService.addFlow(auditingInfo).catch((error) => {
    throw new Error(error.message);
  });

  if (auditData.code !== 0) {
    throw new Error(auditData.msg);
  }

  // 获取流程配置信息
  let approvalSettingData = await auditingService
    .getApprovalSettingById(approvalSettingId)
    .catch((error) => {
      throw new Error(error.message);
    });

  if (approvalSettingData.code !== 0) {
    throw new Error(approvalSettingData.msg);
  }

  let updateData: any = {};
  updateData.idAuditing = auditData.data.approvalId;

  // 获取节点表单数据
  let bizForms = approvalSettingData.data.bizForms;
  if (bizForms.length > 0) {
    updateData.modelFile = bizForms;
  }

  return updateData;
}

async function remove(_id: string) {
  let contractDatas = await ContractModel.find({ _id: _id });
  if (contractDatas !== null) {
    await ContractModel.deleteOne({ _id });
  }
}
const contractController = new ContractController();

router.post('/api/contract', contractController.create);
router.get('/api/contract', contractController.search);
router.put('/api/contract', contractController.update);
router.delete('/api/contract', contractController.delete);
router.post('/api/contract/history', contractController.historyCreate);
router.get('/api/contract/history', contractController.historySearch);

export default router;
