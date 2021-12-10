import express, { NextFunction, Request, Response, response } from 'express';
import request from 'request';
import _ from 'lodash';

import { ProgressModel } from '../services/mongoose-models/progress';
import { DictionariesModel } from '../services/mongoose-models/dictionaries';
import auditingService from '../services/AuditingService';
import { ProgressDetailModel } from '../services/mongoose-models/progress_detail';
import moment from 'antd/node_modules/moment';
import { success, failed, BaseCode } from './CommonResult';
import isEmpty from 'lodash/isEmpty';

const router = express.Router();

class ProgressController {
  async createAudit(req: Request, res: Response, next: NextFunction) {
    const progressInfo = req.body;

    let usWd = req.user.company.type;
    let userId = req.user._id;

    let actionType = progressInfo.actionType; //操作

    let data = progressInfo.data; // 数据
    let id = progressInfo._id; // id
    let ids: Array<string> = progressInfo.ids; // ids
    let approvalName = '';

    try {
      switch (actionType) {
        case 'create':
          approvalName = data.text;
          await approve(approvalName, usWd, userId)
            .then(async (auditingId) => {
              // 保存流程进度关系表
              await progressDetail(
                approvalName,
                auditingId,
                [],
                data,
                actionType,
                userId
              )
                .then(async () => {
                  return res.status(200).json({
                    code: 200,
                    msg: 'SUCCESS',
                    data: null,
                  });
                })
                .catch((error) => {
                  throw error;
                });
            })
            .catch((error) => {
              return res.status(200).json({
                code: 4001,
                msg: error,
                data: null,
              });
            });
          break;
        case 'update':
          if (!id) {
            return res.status(200).json({
              code: 4001,
              msg: 'id为空',
              data: null,
            });
          }
          await ProgressModel.findById({
            _id: id,
          })
            .then(async (progressModel) => {
              approvalName = progressModel.text;
              await approve(approvalName, usWd, userId)
                .then((auditingId) => {
                  // 保存流程进度关系表
                  progressDetail(
                    approvalName,
                    auditingId,
                    [id],
                    data,
                    actionType,
                    userId
                  )
                    .then(() => {
                      return res.status(200).json({
                        code: 200,
                        msg: 'SUCCESS',
                        data: null,
                      });
                    })
                    .catch((error) => {
                      throw error;
                    });
                })
                .catch((error) => {
                  throw error;
                });
            })
            .catch((error) => {
              return res.status(200).json({
                code: 4001,
                msg: error,
                data: null,
              });
            });

          break;
        case 'batchUpdate':
          if (ids.length <= 0) {
            return res.status(200).json({
              code: 4001,
              msg: 'ids为空',
              data: null,
            });
          }
          await ProgressModel.findById({
            _id: ids[0],
          })
            .then(async (progressModel) => {
              approvalName =
                progressModel.text + '等' + ids.length + '项任务更新';
              await approve(approvalName, usWd, userId)
                .then((auditingId) => {
                  // 保存流程进度关系表
                  progressDetail(
                    approvalName,
                    auditingId,
                    ids,
                    data,
                    actionType,
                    userId
                  )
                    .then(() => {
                      return res.status(200).json({
                        code: 200,
                        msg: 'SUCCESS',
                        data: null,
                      });
                    })
                    .catch((error) => {
                      throw error;
                    });
                })
                .catch((error) => {
                  throw error;
                });
            })
            .catch((error) => {
              return res.status(200).json({
                code: 4001,
                msg: error,
                data: null,
              });
            });
          break;
        case 'delete':
          if (!id) {
            return res.status(200).json({
              code: 4001,
              msg: 'id为空',
              data: null,
            });
          }
          await ProgressModel.findById({
            _id: id,
          })
            .then(async (progressModel) => {
              approvalName = progressModel.text;
              await approve(approvalName, usWd, userId)
                .then((auditingId) => {
                  // 保存流程进度关系表
                  progressDetail(
                    approvalName,
                    auditingId,
                    [id],
                    null,
                    actionType,
                    userId
                  )
                    .then(() => {
                      return res.status(200).json({
                        code: 200,
                        msg: 'SUCCESS',
                        data: null,
                      });
                    })
                    .catch((error) => {
                      throw error;
                    });
                })
                .catch((error) => {
                  throw error;
                });
            })
            .catch((error) => {
              return res.status(200).json({
                code: 4001,
                msg: error,
                data: null,
              });
            });

          break;
        case 'batchDelete':
          if (ids.length <= 0) {
            return res.status(200).json({
              code: 4001,
              msg: 'ids为空',
              data: null,
            });
          }
          await ProgressModel.findById({
            _id: ids[0],
          })
            .then(async (progressModel) => {
              approvalName =
                progressModel.text + '等' + ids.length + '项任务删除';
              await approve(approvalName, usWd, userId)
                .then((auditingId) => {
                  // 保存流程进度关系表
                  progressDetail(
                    approvalName,
                    auditingId,
                    ids,
                    null,
                    actionType,
                    userId
                  )
                    .then(() => {
                      return res.status(200).json({
                        code: 200,
                        msg: 'SUCCESS',
                        data: null,
                      });
                    })
                    .catch((error) => {
                      throw error;
                    });
                })
                .catch((error) => {
                  throw error;
                });
            })
            .catch((error) => {
              return res.status(200).json({
                code: 4001,
                msg: error,
                data: null,
              });
            });
          break;
        default:
          return res.status(200).json({
            code: 4001,
            msg: '操作类型不存在',
            data: null,
          });
      }
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    const { _id, text } = req.query;
    try {
      if (_id) {
        let progressModel: any = await ProgressModel.findById({
          _id,
        })
          .populate([
            {
              path: 'account resourcAccount',
              select: ['userName'],
            },
            { path: 'detail', select: 'links -_id' },
          ])
          .lean(true);

        if (progressModel && progressModel.custom_data) {
          progressModel.$custom_data = progressModel.custom_data;
        }

        res.status(200).json({
          code: 200,
          msg: 'SUCCESS',
          data: progressModel,
        });
        return;
      }

      let searchInfo: any = {};
      // 名称搜索
      if (text) {
        searchInfo.text = new RegExp(text as string);
      }
      let progressModels = await ProgressModel.find(searchInfo)
        .populate([
          {
            path: 'account resourcAccount',
            select: ['userName'],
          },
          { path: 'detail', select: 'links -_id' },
        ])
        .sort({ atCreated: -1 })
        .lean(true);

      let data = [];
      progressModels.forEach((progressModel: any) => {
        if (progressModel && progressModel.custom_data) {
          progressModel.$custom_data = progressModel.custom_data;
        }
        data.push(progressModel);
      });

      let count = await ProgressModel.countDocuments(searchInfo);
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

  async searchAudit(req: Request, res: Response, next: NextFunction) {
    const { _id, status, idCreatedBy, myself, limit, page } = req.query;
    try {
      if (_id) {
        let data: any = await ProgressDetailModel.findById({
          _id,
        })
          .populate({
            path: 'account resourcAccount',
            select: ['userName'],
          })
          .lean(true);

        if (data && data.data && data.data.custom_data) {
          data.data.$custom_data = data.data.custom_data;
        }

        let approvalData = await auditingService
          .getApprovalById(data.auditingId, req.user._id)
          .catch(async (error) => {
            res.status(200).json({
              code: 4001,
              msg: '获取流程信息失败',
              data: error.message,
            });
            throw error.message;
          });

        if (approvalData.code !== 0) {
          return res.json({
            code: 4001,
            msg: '获取流程信息失败',
            data: approvalData.msg,
          });
        }
        data.isAuth = false;
        if (data.auditingId === approvalData.data.approvalId) {
          if (approvalData.data.canOperate) {
            data.isAuth = true;
          }
          data.status = approvalData.data.approvalStatus;
        }

        return res.status(200).json({
          code: 200,
          msg: 'SUCCESS',
          data: data,
        });
      }

      let newLimit = +limit || 10;
      let skip = +page * newLimit;

      let searchInfo: any = {};

      // 受理状态
      if (status) {
        searchInfo.status = status;
      }
      // 我发起的
      if (idCreatedBy) {
        searchInfo.idCreatedBy = req.user._id;
      }

      let data = await ProgressDetailModel.find(searchInfo)
        .populate({
          path: 'account resourcAccount',
          select: ['userName'],
        })
        .sort({ atCreated: -1 })
        .lean(true);

      let approvalIds = [];
      data.forEach((element) => {
        approvalIds.push(element.auditingId);
        element.isAuth = false;
        if (element.data && element.data.custom_data) {
          element.data.$custom_data = element.data.custom_data;
        }
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
        return res.json({
          code: 4001,
          msg: '获取流程信息失败',
          data: approvalData.msg,
        });
      }

      data.forEach((item) => {
        approvalData.data.forEach((element) => {
          if (item.auditingId === element.approvalId) {
            if (element.canOperate) {
              item.isAuth = true;
            }
            item.status = element.approvalStatus;
          }
        });
      });

      let count = await ProgressDetailModel.countDocuments(searchInfo);

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

  async updateAudit(req: Request, res: Response, next: NextFunction) {
    try {
      let { _id, status, end } = req.body;

      if (isEmpty(_id) || isEmpty(status)) {
        return res.json(failed(BaseCode.PARAM_FAILED));
      }

      let progressDetailModel = await ProgressDetailModel.findById({
        _id: _id,
      });

      if (!progressDetailModel) {
        return res.json(failed(BaseCode.DATA_NOT_EXIST));
      }

      if (status) {
        await ProgressDetailModel.findByIdAndUpdate(
          _id,
          { $set: { status: status } },
          { new: true }
        );
      }

      if (end) {
        switch (progressDetailModel.actionType) {
          case 'create':
            create(progressDetailModel.data, req.user._id)
              .then(async (progressModel) => {
                let updateData: any = {};
                updateData.progressId = [progressModel._id];
                await ProgressDetailModel.findByIdAndUpdate(
                  progressDetailModel._id,
                  { $set: updateData },
                  { new: true }
                )
                  .catch((error) => {
                    throw error.message;
                  })
                  .then(() => {
                    return res.status(200).json({
                      code: 200,
                      msg: 'SUCCESS',
                      data: progressModel,
                    });
                  });
              })
              .catch((error) => {
                return res.status(200).json({
                  code: 4001,
                  msg: '创建失败',
                  data: error,
                });
              });
            break;
          case 'batchCreate':
            batchCreate(
              progressDetailModel.data,
              req.user._id,
              progressDetailModel.progressId[0],
              progressDetailModel._id
            )
              .then(() => {
                return res.status(200).json({
                  code: 200,
                  msg: 'SUCCESS',
                  data: null,
                });
              })
              .catch((error) => {
                return res.status(200).json({
                  code: 4001,
                  msg: '批量创建失败',
                  data: error.message,
                });
              });
            break;
          case 'update':
            update(progressDetailModel.data, progressDetailModel.progressId[0])
              .then((progressModel) => {
                return res.status(200).json({
                  code: 200,
                  msg: 'SUCCESS',
                  data: progressModel,
                });
              })
              .catch((error) => {
                return res.status(200).json({
                  code: 4001,
                  msg: '修改失败',
                  data: error.message,
                });
              });

            break;
          case 'batchUpdate':
            batchUpdate(
              progressDetailModel.data,
              progressDetailModel.progressId
            )
              .then(() => {
                return res.status(200).json({
                  code: 200,
                  msg: 'SUCCESS',
                  data: null,
                });
              })
              .catch((error) => {
                return res.status(200).json({
                  code: 4001,
                  msg: '批量修改失败',
                  data: error.message,
                });
              });

            break;
          case 'delete':
            batchDelete(progressDetailModel.progressId)
              .then(() => {
                return res.status(200).json({
                  code: 200,
                  msg: 'SUCCESS',
                  data: null,
                });
              })
              .catch((error) => {
                return res.status(200).json({
                  code: 4001,
                  msg: '删除失败',
                  data: error.message,
                });
              });

            break;
          case 'batchDelete':
            batchDelete(progressDetailModel.progressId)
              .then(() => {
                return res.status(200).json({
                  code: 200,
                  msg: 'SUCCESS',
                  data: null,
                });
              })
              .catch((error) => {
                return res.status(200).json({
                  code: 4001,
                  msg: '删除失败',
                  data: error.message,
                });
              });
            break;
          default:
            return res.status(200).json({
              code: 4001,
              msg: '操作类型不存在',
              data: null,
            });
        }
      } else {
        return res.json(success(null));
      }
    } catch (error) {
      next(error);
    }
  }

  async uploadMpp(req: Request, res: Response, next: NextFunction) {
    let { projectId, fileName } = req.query;
    let usWd = req.user.company.type;
    let userId = req.user._id;

    const options = {
      method: 'POST',
      uri: 'https://export.dhtmlx.com/gantt',
    };
    const resFromGantt = request(options);

    req.pipe(resFromGantt);
    resFromGantt.on('response', (response) => {
      let data = '';
      response.on('data', (chunk: Buffer) => {
        data += chunk.toString();
        console.log(chunk.toString());
      });
      response.on('end', async (chunk: Buffer) => {
        if (chunk) data += chunk.toString();

        try {
          console.log('save all data to db');

          data = data.replace(new RegExp('\\$', 'gm'), '');
          const resData = JSON.parse(data);

          // 发起流程;
          let approvalName = fileName as string;
          let auditingId = await approve(approvalName, usWd, userId);
          // 保存流程进度关系表
          await progressDetail(
            approvalName,
            auditingId,
            [projectId as string],
            resData.data.data,
            'batchCreate',
            userId,
            resData.data.links ? resData.data.links : []
          );
          console.log('all data has been saved to db');

          res.json({
            code: 200,
            msg: '上传计划成功！',
          });
        } catch (err) {
          console.log(err);
          res.json({
            code: 5001,
            msg: err.message,
          });
        }
      });
      response.on('error', (err) => {
        console.log(err);
        res.json({
          code: 5001,
          msg: err.message,
        });
      });
    });
    resFromGantt.on('error', (err) => {
      console.log(err);
      res.json({
        code: 5001,
        msg: err.message,
      });
    });
  }

  // JXTRAM-212：数据统计-进度管理-进度概况-项目工期统计接口；
  // 项目工期统计接口；
  //   1、项目开始时间：遍历计划中所有任务，取最早的任务开始时间作为项目开始时间，时间精确到年月日；
  // 2、项目结束时间：遍历计划中所有任务，取最晚的任务结束时间作为项目结束时间；精确到年月日
  // 3、当前时间：即系统当前时间，精确到日；
  // 4、工期占比=（当前时间-项目开始时间）/ （项目结束时间-项目开始时间）*100
  async durationStatistical(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('durationStatistical');
      let start = await ProgressModel.find({}).sort({ start_date: 1 });
      let end = await ProgressModel.find({}).sort({ end_date: -1 });

      // console.log('start',start)
      // console.log('end',end)
      if (isEmpty(start) || isEmpty(end)) {
        return res.json(failed(BaseCode.DATA_NOT_EXIST));
      }

      let startDate = moment(start[0].start_date).format('YYYY-MM-DD');
      let endDate = moment(end[0].end_date).format('YYYY-MM-DD');
      let currDate = moment(new Date()).format('YYYY-MM-DD');

      let proportion = parseInt(
        (moment(currDate).diff(moment(startDate), 'day') /
          moment(endDate).diff(moment(startDate), 'day')) *
          100 +
          ''
      )
        ? parseInt(
            (moment(currDate).diff(moment(startDate), 'day') /
              moment(endDate).diff(moment(startDate), 'day')) *
              100 +
              ''
          )
        : 0;

      return res.json(success({ startDate, endDate, currDate, proportion }));
    } catch (error) {
      console.log('error', error);
      res.json(failed(null, error.message));
      next(error);
    }
  }

  // JXTRAM-213：数据统计-进度管理-进度概况-总任务完成率接口；
  //   1、当前任务完成数：即任务完成度为100%的任务总数；
  // 2、总任务数：即该项目中包含的总任务数；
  // 3、总任务完成率=（当前任务完成数 / 总任务数）*100
  async taskCompletionRate(req: Request, res: Response, next: NextFunction) {
    try {
      let count = await ProgressModel.countDocuments({ progress: 100 });
      let sumCount = await ProgressModel.countDocuments({});
      let completion = parseInt((count / sumCount) * 100 + '')
        ? parseInt((count / sumCount) * 100 + '')
        : 0;

      return res.json(success({ sumCount, count, completion }));
    } catch (error) {
      res.json(failed(null, error.message));
      next(error);
    }
  }

  // JXTRAM-214：数据统计-进度管理-任务概况-任务完成情况接口；
  //   任务完成情况：
  // 时间维度：按30天、3个月、6个月、一年，即根据每个任务的“计划开始时间”取该时间范围内符合条件的任务集合；
  // 饼图：
  // 1）横坐标：未开始任务数占比（显示数量）、进行中任务数占比（数量）、已完成任务数占比（数量）；
  // 2）纵坐标：占比，百分数；

  // 1、未开始任务数：即任务完成度为0的任务数；
  // 2、进行中任务数：即任务完成度为大于0且小于100的任务数；
  // 3、已完成任务数：即任务完成度为100的任务数；
  // 4、未开始任务占比：未开始任务数 / 总任务数 * 100；
  // 5、进行中任务占比：进行中任务数 / 总任务数 * 100；
  // 6、已完成任务占比：已完成任务数/ 总任务数 * 100；
  async taskCompletionCase(req: Request, res: Response, next: NextFunction) {
    let { days } = req.body;

    try {
      let searchInfo: any = {};
      searchInfo.start_date = {
        $gte: new Date(
          moment(new Date()).add(-days, 'days').format('YYYY-MM-DD')
        ),
        $lt: new Date(moment(new Date()).add(1, 'days').format('YYYY-MM-DD')),
      };
      let totalCount = await ProgressModel.countDocuments(searchInfo);

      searchInfo.progress = 0;
      let todoCount = await ProgressModel.countDocuments(searchInfo);
      let todoCompletion = parseInt((todoCount / totalCount) * 100 + '')
        ? parseInt((todoCount / totalCount) * 100 + '')
        : 0;

      searchInfo.progress = {
        $gt: 0,
        $lt: 100,
      };
      let doingCount = await ProgressModel.countDocuments(searchInfo);
      let doingCompletion = parseInt((doingCount / totalCount) * 100 + '')
        ? parseInt((doingCount / totalCount) * 100 + '')
        : 0;

      searchInfo.progress = 100;
      let doneCount = await ProgressModel.countDocuments(searchInfo);
      let doneCompletion = parseInt((doneCount / totalCount) * 100 + '')
        ? parseInt((doneCount / totalCount) * 100 + '')
        : 0;

      res.json(
        success({
          todoCount, // 未开始任务数
          todoCompletion, // 未开始任务占比
          doingCount, // 进行中任务数
          doingCompletion, // 进行中任务占比
          doneCount, // 已完成任务数
          doneCompletion, // 已完成任务占比
        })
      );
    } catch (error) {
      res.json(failed(null, error.message));
      next(error);
    }
  }

  // JXTRAM-215：数据统计-进度管理-任务概况-任务延期情况接口；
  //   时间维度：按30天、3个月、6个月、一年，即根据每个任务的“计划开始时间”取该时间范围内符合条件的任务集合；

  // 任务完成情况：
  // 饼图：
  // 1）横坐标：未开始任务数占比（显示数量）、进行中任务数占比（数量）、已完成任务数占比（数量）；
  // 2）纵坐标：占比，百分数；
  // 1、未开始任务数：即任务完成度为0的任务数；
  // 2、进行中任务数：即任务完成度为大于0且小于100的任务数；
  // 3、已完成任务数：即任务完成度为100的任务数；
  // 4、未开始任务占比：未开始任务数 / 总任务数 * 100；
  // 5、进行中任务占比：进行中任务数 / 总任务数 * 100；
  // 6、已完成任务占比：已完成任务数/ 总任务数 * 100；

  // 任务延期情况（参考备注）：
  // 饼图：
  // 1）横坐标：未延期任务数占比（显示数量）、延期任务数占比（数量）、严重延期任务数占比（数量）；
  // 2）纵坐标：占比，百分数；

  // 1、截止目前计划开工任务数：即（当前时间-任务计划开始时间）>0 的任务数；
  // 2、延期任务数：“延期-未完成任务数” + “延期-已完成任务数”；
  // 3、严重延期任务数：“严重延期-未完成任务数” + “严重延期-已完成任务数”；
  // 4、未延期任务数：“截止目前计划开工任务数” - “延期任务数” - “严重延期任务数”；
  // 5、未延期任务数占比：（未延期任务数 / 截止目前计划开工任务数）* 100；
  // 6、延期任务占比：（延期任务数 / 截止目前计划开工任务数）* 100；
  // 7、严重延期任务数：（严重延期任务数 / 截止目前计划开工任务数）* 100；
  async taskDelayCase(req: Request, res: Response, next: NextFunction) {
    let { days } = req.body;
    try {
      let searchInfo: any = {};
      searchInfo.start_date = {
        $gte: new Date(
          moment(new Date()).add(-days, 'days').format('YYYY-MM-DD')
        ),
        $lt: new Date(moment(new Date()).add(1, 'days').format('YYYY-MM-DD')),
      };
      let startCount = await ProgressModel.countDocuments(searchInfo); //开工任务数

      searchInfo.taskTags = '0';
      searchInfo.delay = { $ne: 'notstart' };
      let delayCount = await ProgressModel.countDocuments(searchInfo);
      let delayCompletion = parseInt((delayCount / startCount) * 100 + '')
        ? parseInt((delayCount / startCount) * 100 + '')
        : 0;

      searchInfo.taskTags = '1';
      searchInfo.delay = { $ne: 'notstart' };
      let seriousDelayCount = await ProgressModel.countDocuments(searchInfo);
      let seriousDelayCompletion = parseInt(
        (seriousDelayCount / startCount) * 100 + ''
      )
        ? parseInt((seriousDelayCount / startCount) * 100 + '')
        : 0;

      let noDelayCount = startCount - delayCount - seriousDelayCount;
      let noDelayCompletion = parseInt((noDelayCount / startCount) * 100 + '')
        ? parseInt((noDelayCount / startCount) * 100 + '')
        : 0;

      return res.json(
        success({
          startCount, // 开工任务数
          noDelayCount, //未延期任务数
          noDelayCompletion, //未延期任务数占比
          delayCount, //延期任务数
          delayCompletion, // 延期任务占比
          seriousDelayCount, //严重延期任务数
          seriousDelayCompletion, // 严重延期任务数占比
        })
      );
    } catch (error) {
      res.json(failed(null, error.message));
      next(error);
    }
  }

  //数据统计-进度管理-任务延期Top10接口；
  // 时间维度：按30天、3个月、6个月、一年；
  // 延期任务列表：
  // 1、列表包含：时间维度、每条数据包含：
  // 任务名称、延期天数（1.已完成：更新完成度100的时间-计划截止时间；
  // 2.未完成：当前时间-计划截止时间）；
  // 2、每个时间维度，列表按照延期天数倒序排列；
  // 3、每个时间维度，仅显示10条；
  // 4、进度表每个任务新增“延期天数”字段，针对“延期天数”的更新逻辑：
  // 1.即时更新：针对“已完成”的任务，在更新状态时需要顺便更新“延期天数”字段，延期天数=任务完成时间-计划截止时间，若结果小于0按0存储，若大于0则按实际数字存储，单位：天，四舍五入取整；
  // 2.定时更新：扫描当前“未完成”任务，若“（当前时间-计划截止时间）>0”则按实际数字存储更新“延期天数”，单位：天，四舍五入取整；
  async delayTop10(req: Request, res: Response, next: NextFunction) {
    try {
      let { days } = req.body;

      let searchInfo: any = {};

      searchInfo.start_date = {
        $gte: new Date(
          moment(new Date()).add(-days, 'days').format('YYYY-MM-DD')
        ),
        $lt: new Date(moment(new Date()).add(1, 'days').format('YYYY-MM-DD')),
      };

      const reuslt = await ProgressModel.find(searchInfo, {
        text: 1,
        delayDays: 1,
      })
        .sort({ delayDays: -1 })
        .limit(10);

      return res.json(success(reuslt));
    } catch (error) {
      res.json(failed(null, error.message));
      next(error);
    }
  }
}

async function approve(approvalName: string, usWd: string, userId: string) {
  // 查询字典数据
  let dictData = await DictionariesModel.findOne({
    dataType: 'JD_MANAGE',
    usWd: usWd,
  });

  if (!dictData) {
    throw '字典数据为空';
  }

  // 发起审核流程
  let auditingInfo: any = {};
  auditingInfo.approvalName = approvalName;
  auditingInfo.approvalSettingId = dictData.dataValue;
  auditingInfo.operatorId = userId;
  auditingInfo.attachments = [];

  let auditData = await auditingService.addFlow(auditingInfo).catch((error) => {
    throw error.message;
  });

  if (auditData.code !== 0) {
    throw auditData.msg;
  }

  return auditData.data.approvalId;
}

async function progressDetail(
  name: string,
  auditingId: string,
  ids: Array<String>,
  data: any,
  actionType: string,
  userId: string,
  links: Array<any> = []
) {
  let progressDetailModel: any;
  progressDetailModel = new ProgressDetailModel({
    name: name,
    auditingId: auditingId,
    progressId: ids,
    data: data,
    links,
    actionType: actionType,
    idCreatedBy: userId,
  });

  // 保存数据
  progressDetailModel = await ProgressDetailModel.create(
    progressDetailModel
  ).catch((error) => {
    throw error.message;
  });
  return progressDetailModel;
}

async function create(data: any, userId: string) {
  let progressInfo = data;
  let progressModel: any;
  progressModel = new ProgressModel({
    text: progressInfo.text,
    start_date: new Date(progressInfo.start_date),
    end_date: new Date(progressInfo.end_date),
    duration: progressInfo.duration,
    progress: progressInfo.progress,
    parent: progressInfo.parent,
    custom_data: progressInfo.custom_data,
    resource: progressInfo.resource,
    delay: progressInfo.delay,
    importantNode: progressInfo.importantNode,
    taskTags: progressInfo.taskTags,
    projectId: progressInfo.projectId,
    idCreatedBy: userId,
  });

  // 保存数据
  progressModel = await ProgressModel.create(progressModel).catch((error) => {
    throw error.message;
  });

  return progressModel;
}

async function batchCreate(
  data: any,
  userId: string,
  projectId: string,
  detailId: string = ''
) {
  let saveList = [];

  for (let i = 0; i < data.length; i++) {
    const progressInfo = data[i];

    let findData = await ProgressModel.findById({ _id: progressInfo.id });
    if (findData) {
      return;
    }
    let customData = {};
    let custom_data = progressInfo.$custom_data;
    if (custom_data) {
      customData = {
        priority: custom_data.priority,
        BIMcoding: custom_data.BIMcoding,
        jlPrincipal: custom_data.jlPrincipal,
      };
    }

    let duration = progressInfo.duration;
    let endDate = moment(progressInfo.start_date).add(duration, 'days');

    let progressModel = new ProgressModel({
      _id: progressInfo.id,
      text: progressInfo.text,
      start_date: progressInfo.start_date,
      end_date: endDate,
      duration: progressInfo.duration,
      progress: progressInfo.progress,
      parent: progressInfo.parent,
      custom_data: customData,
      resource: progressInfo.resource,
      delay: progressInfo.delay,
      importantNode: progressInfo.importantNode,
      taskTags: progressInfo.taskTags,
      projectId: projectId,
      idCreatedBy: userId,
      detail: detailId,
    });

    saveList.push(progressModel);
  }

  // 保存数据
  await ProgressModel.insertMany(saveList).catch((error) => {
    throw error.message;
  });

  return;
}

async function update(progressInfo: any, id: string) {
  let data = await ProgressModel.findById({ _id: id });

  let updateData: any = {};

  if (progressInfo.text) {
    updateData.text = progressInfo.text;
  }
  if (progressInfo.start_date) {
    updateData.start_date = new Date(progressInfo.start_date);
  }
  if (progressInfo.end_date) {
    updateData.end_date = new Date(progressInfo.end_date);
  }
  if (progressInfo.duration) {
    updateData.duration = progressInfo.duration;
  }
  if (progressInfo.progress) {
    updateData.progress = progressInfo.progress;
    if (progressInfo.progress === 0) {
      updateData.delay = 'notstart';
      if (!data.actual_start_date) {
        updateData.actual_start_date = new Date();
      }
    }
    if (progressInfo.progress > 0 && progressInfo.progress < 100) {
      updateData.delay = 'doing';
      if (!data.actual_start_date) {
        updateData.actual_start_date = new Date();
      }
    }
    if (progressInfo.progress === 100) {
      updateData.delay = 'done';
      if (!data.actual_start_date) {
        updateData.actual_start_date = new Date();
      }

      //  1.即时更新：针对“已完成”的任务，在更新状态时需要顺便更新“延期天数”字段，
      // 延期天数=任务完成时间-计划截止时间，若结果小于0按0存储，若大于0则按实际数字存储，单位：天，四舍五入取整；
      const diffDays = moment(new Date()).diff(moment(data.end_date), 'days');
      updateData.delayDays = diffDays > 0 ? diffDays : 0;
    }
  }
  if (progressInfo.open) {
    updateData.open = progressInfo.open;
  }
  if (progressInfo.parent) {
    updateData.parent = progressInfo.parent;
  }
  if (progressInfo.custom_data) {
    if (progressInfo.custom_data.priority) {
      updateData['custom_data.priority'] = progressInfo.custom_data.priority;
    }
    if (progressInfo.custom_data.jlPrincipal) {
      updateData['custom_data.jlPrincipal'] =
        progressInfo.custom_data.jlPrincipal;
    }
  }
  if (progressInfo.resource.length > 0) {
    updateData.resource = progressInfo.resource;
  }
  if (progressInfo.importantNode) {
    updateData.importantNode = progressInfo.importantNode;
  }
  if (progressInfo.taskTags) {
    updateData.taskTags = progressInfo.taskTags;
  }
  if (progressInfo.projectId) {
    updateData.projectId = progressInfo.projectId;
  }

  let progressModel: any = await ProgressModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  ).lean(true);

  progressModel.$custom_data = progressModel.custom_data;

  return progressModel;
}

async function batchUpdate(progressInfo: any, ids: Array<string>) {
  let updateData: any = {};
  if (progressInfo.progress) {
    updateData.progress = progressInfo.progress;
    if (progressInfo.progress === 0) {
      updateData.delay = 'notstart';
    }
    if (progressInfo.progress > 0 && progressInfo.progress < 100) {
      updateData.delay = 'doing';
    }
    if (progressInfo.progress === 100) {
      updateData.delay = 'done';

      //  1.即时更新：针对“已完成”的任务，在更新状态时需要顺便更新“延期天数”字段，
      // 延期天数=任务完成时间-计划截止时间，若结果小于0按0存储，若大于0则按实际数字存储，单位：天，四舍五入取整；
      const data = await ProgressModel.find({ _id: { $in: ids } });

      const currDate = new Date(); // 当前时间 任务完成时间
      for (let i = 0; i++; i < data.length) {
        const diffDays = moment(currDate).diff(
          moment(data[i].end_date),
          'days'
        );
        await ProgressModel.updateOne(
          { _id: data[i]._id },
          {
            $set: {
              delayDays: diffDays > 0 ? diffDays : 0,
            },
          }
        );
      }
    }
  }
  if (progressInfo.resource.length > 0) {
    updateData.resource = progressInfo.resource;
  }
  if (progressInfo.custom_data) {
    if (progressInfo.custom_data.priority) {
      updateData['custom_data.priority'] = progressInfo.custom_data.priority;
    }
    if (progressInfo.custom_data.jlPrincipal) {
      updateData['custom_data.jlPrincipal'] =
        progressInfo.custom_data.jlPrincipal;
    }
  }

  await ProgressModel.updateMany(
    { _id: { $in: ids } },
    {
      $set: updateData,
    }
  );
  return;
}

async function batchDelete(ids: Array<string>) {
  let deleteInfo: any = {};
  deleteInfo.deleted = true;
  await ProgressModel.updateMany({ _id: { $in: ids } }, deleteInfo);
  return;
}

const progressController = new ProgressController();

router.get('/api/progress/search', progressController.search);

router.get('/api/progress/search/audit', progressController.searchAudit);

router.post('/api/progress/audit', progressController.createAudit);

router.put('/api/progress/audit', progressController.updateAudit);

router.post('/api/progress/mpp', progressController.uploadMpp);

// 数据统计-进度管理-进度概况-项目工期统计接口；
router.post(
  '/api/progress/durationStatistical',
  progressController.durationStatistical
);

// 数据统计-进度管理-进度概况-总任务完成率接口；
router.post(
  '/api/progress/taskCompletionRate',
  progressController.taskCompletionRate
);

// 数据统计-进度管理-任务概况-任务完成情况接口；
router.post(
  '/api/progress/taskCompletionCase',
  progressController.taskCompletionCase
);

// JXTRAM-215：数据统计-进度管理-任务概况-任务延期情况接口；
router.post('/api/progress/taskDelayCase', progressController.taskDelayCase);

// 数据统计-进度管理-任务延期Top10接口；
router.post('/api/progress/delayTop10', progressController.delayTop10);

export default router;
