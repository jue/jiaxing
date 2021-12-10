import express, { Request, Response, NextFunction } from 'express';
import auditingService from '../services/AuditingService';
import { DictionariesModel } from '../services/mongoose-models/dictionaries';

const router = express.Router();

class AuditController {
  async getFlowing(req: Request, res: Response, nextFunction: NextFunction) {
    const { idAuditing, queryType } = req.query;

    try {
      let data = await auditingService.getFlowing(
        idAuditing as string,
        queryType as string,
        req.user._id
      );

      if (data.code === 0) {
        return res.json({
          code: 200,
          msg: 'SUCCESS',
          data: data.data,
        });
      } else {
        return res.json({
          code: 4001,
          msg: '获取节点信息失败',
          data: data.msg,
        });
      }
    } catch (error) {
      res.status(200).json({
        code: 4001,
        msg: '获取节点信息失败',
        data: error.message,
      });
      nextFunction(error);
    }
  }

  async getFlowed(req: Request, res: Response, nextFunction: NextFunction) {
    const { idAuditing } = req.query;

    try {
      let data = await auditingService.getFlowed(
        idAuditing as string,
        req.user._id
      );

      if (data.code === 0) {
        return res.json({
          code: 200,
          msg: 'SUCCESS',
          data: data.data,
        });
      } else {
        return res.json({
          code: 200,
          msg: '获取节点信息失败',
          data: data.msg,
        });
      }
    } catch (error) {
      res.status(200).json({
        code: 4001,
        msg: '获取节点信息失败',
        data: error.message,
      });
      nextFunction(error);
    }
  }

  async getAuditingMap(req: Request, res: Response, next: NextFunction) {
    let { dataType, dictKey, original, approvalId } = req.query;

    try {
      // 查询字典数据
      let searchInfo: any = {};
      if (dataType) {
        searchInfo.dataType = dataType;
      }
      if (dictKey) {
        searchInfo.usWd = dictKey;
      }
      let dictData = await DictionariesModel.findOne(searchInfo);

      if (!dictData) {
        return res.status(200).json({
          code: 4001,
          msg: '字典数据为空',
          data: null,
        });
      }

      if (!original) {
        original = '';
      }

      let data = await auditingService.getApprovalSettingAll(
        dictData.dataValue,
        original as string,
        approvalId as string
      );

      if (data.code === 0) {
        return res.json({
          code: 200,
          msg: 'SUCCESS',
          data: data.data,
        });
      } else {
        return res.json({
          code: 4001,
          msg: '获取审批地图失败',
          data: data.msg,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async updateFlow(req: Request, res: Response, next: NextFunction) {
    let { approvalId, flowData } = req.body;
    try {
      let data = await auditingService.updateFlow(approvalId, {
        ...flowData,
        operatorId: req.user._id,
      });

      if (data.code === 0) {
        return res.json({
          code: 200,
          msg: 'SUCCESS',
          data: data.data,
        });
      } else {
        return res.json({
          code: 4001,
          msg: '审核失败',
          data: data.msg,
        });
      }
    } catch (error) {
      res.status(200).json({
        code: 4001,
        msg: '审核失败',
        data: error.message,
      });
      next(error);
    }
  }

  async getTaskById(req: Request, res: Response, next: NextFunction) {
    const { dataType, dictKey } = req.query;
    try {
      // 查询字典数据
      let searchInfo: any = {};
      if (dataType) {
        searchInfo.dataType = dataType;
      }
      if (dictKey) {
        searchInfo.usWd = dictKey;
      }
      let dictData = await DictionariesModel.findOne(searchInfo);

      if (!dictData) {
        res.status(200).json({
          code: 4001,
          msg: '字典数据为空',
          data: null,
        });
        return;
      }

      let approvalSettingData = await auditingService.getApprovalSettingById(
        dictData.dataValue
      );

      if (approvalSettingData.code !== 0) {
        res.json({
          code: 4001,
          msg: '获取流程配置信息失败',
          data: approvalSettingData.msg,
        });
        return;
      }

      let taskId = approvalSettingData.data.taskId;

      let taskData = await auditingService.getTaskById(taskId);

      if (taskData.code !== 0) {
        res.json({
          code: 4001,
          msg: '获取任务信息失败',
          data: taskData.msg,
        });
        return;
      }

      res.json({
        code: 200,
        msg: 'SUCCESS',
        data: taskData.data,
      });
    } catch (error) {
      res.status(200).json({
        code: 4001,
        msg: '获取任务信息失败',
        data: error.message,
      });
      next(error);
    }
  }

  async getTasks(req: Request, res: Response, next: NextFunction) {
    const { pageIndex, taskName } = req.query;
    try {
      let taskData = await auditingService.getTasks(
        pageIndex as string,
        taskName as string
      );

      if (taskData.code !== 0) {
        res.json({
          code: 4001,
          msg: '获取任务列表信息失败',
          data: taskData.msg,
        });
        return;
      }

      res.json({
        code: 200,
        msg: 'SUCCESS',
        data: taskData.data,
      });
    } catch (error) {
      res.status(200).json({
        code: 4001,
        msg: '获取任务列表信息失败',
        data: error.message,
      });
      next(error);
    }
  }

  async getTodos(req: Request, res: Response, next: NextFunction) {
    const { pageIndex, bizName, operatorBizId, todoType, status } = req.query;
    try {
      let todoData = await auditingService.getTodos(
        pageIndex as string,
        bizName as string,
        operatorBizId as string,
        todoType as string,
        status as string
      );

      if (todoData.code !== 0) {
        res.json({
          code: 4001,
          msg: '获取代办列表信息失败',
          data: todoData.msg,
        });
        return;
      }

      res.json({
        code: 200,
        msg: 'SUCCESS',
        data: todoData.data,
      });
    } catch (error) {
      res.status(200).json({
        code: 4001,
        msg: '获取代办列表信息失败',
        data: error.message,
      });
      next(error);
    }
  }

  async getTodoById(req: Request, res: Response, next: NextFunction) {
    const { todoId } = req.query;
    try {
      let todoData = await auditingService.getTodo(todoId as string);

      if (todoData.code !== 0) {
        res.json({
          code: 4001,
          msg: '获取代办信息失败',
          data: todoData.msg,
        });
        return;
      }

      res.json({
        code: 200,
        msg: 'SUCCESS',
        data: todoData.data,
      });
    } catch (error) {
      res.status(200).json({
        code: 4001,
        msg: '获取代办信息失败',
        data: error.message,
      });
      next(error);
    }
  }

  async getMessages(req: Request, res: Response, next: NextFunction) {
    const { read, title, pageIndex = 1 } = req.query;
    try {
      let messageData = await auditingService.getMessages(
        read as string,
        title as string,
        req.user._id as string,
        pageIndex as string
      );

      if (messageData.code !== 0) {
        res.json({
          code: 4001,
          msg: '获取消息列表信息失败',
          data: messageData.msg,
        });
        return;
      }

      res.json({
        code: 200,
        msg: 'SUCCESS',
        data: messageData.data,
      });
    } catch (error) {
      res.status(200).json({
        code: 4001,
        msg: '获取消息列表信息失败',
        data: error.message,
      });
      next(error);
    }
  }

  async getMessageById(req: Request, res: Response, next: NextFunction) {
    const { messageId } = req.query;
    try {
      let messageData = await auditingService.getMessage(
        messageId as string,
        req.user._id as string,
        req.user.nickName as string
      );

      if (messageData.code !== 0) {
        res.json({
          code: 4001,
          msg: '获取消息信息失败',
          data: messageData.msg,
        });
        return;
      }

      res.json({
        code: 200,
        msg: 'SUCCESS',
        data: messageData.data,
      });
    } catch (error) {
      res.status(200).json({
        code: 4001,
        msg: '获取消息信息失败',
        data: error.message,
      });
      next(error);
    }
  }

  async updateMessageById(req: Request, res: Response, next: NextFunction) {
    const { messageId } = req.query;

    try {
      let messageData = await auditingService.updateMessage(
        messageId as string,
        {
          ...req.body,
          operatorId: req.user._id,
          operatorName: req.user.nickName as string,
        }
      );

      if (messageData.code !== 0) {
        res.json({
          code: 4001,
          msg: '修改消息信息失败',
          data: messageData.msg,
        });
        return;
      }

      res.json({
        code: 200,
        msg: 'SUCCESS',
      });
    } catch (error) {
      res.status(200).json({
        code: 4001,
        msg: '修改消息信息出错',
        data: error.message,
      });
      next(error);
    }
  }
}

const auditController = new AuditController();

// 查询当前、下一节点信息
router.get('/api/flow/node', auditController.getFlowing);

// 审核信息流
router.get('/api/flow/nodes', auditController.getFlowed);

// 审核地图
router.get('/api/flow/getAuditingMap', auditController.getAuditingMap);

// 审核操作
router.put('/api/flow', auditController.updateFlow);

// 获取所有任务列表
router.get('/api/tasks', auditController.getTasks);

// 根据任务id获取任务详细信息
router.get('/api/task', auditController.getTaskById);

// 获取分页待办列表
router.get('/api/todos', auditController.getTodos);

// 根据待办id获取待办详细信息
router.get('/api/todo', auditController.getTodoById);

// 获取消息列表（分页）
router.get('/api/messages', auditController.getMessages);

// 根据消息id获消息详细
router.get('/api/message', auditController.getMessageById);

// 更新消息
router.put('/api/message', auditController.updateMessageById);

export default router;
