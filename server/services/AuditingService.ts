import { dev, AUDITING_SERVER_URI } from '../config';
import BaseSvc from '../../client/services/BaseSvc';
import rp from 'request-promise';
import { Readable } from 'stream';
import FormData from 'form-data';

let domain = '';
class AuditingService extends BaseSvc {
  private getReadable(buffer: Buffer) {
    let readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    return readable;
  }
  constructor() {
    super();
    domain = AUDITING_SERVER_URI || `http://auditing-model-server/t`;
    if (dev) {
      domain = AUDITING_SERVER_URI || `http://localhost:7001/t`;
    }

    this.apiUrl = domain;
  }

  //根据流程设置id获取主信息
  async getApprovalSettingById(approvalSettingId: Partial<String>) {
    let options = {
      method: 'GET',
      uri: domain + `/approvalsetting/${approvalSettingId}`,
      json: true,
    };
    let data = await rp(options);
    return data;
  }

  //根据流程设置id获取流程中所有节点
  async getApprovalSettingAll(
    approvalSettingId: Partial<String>,
    original: Partial<String>,
    approvalId?: string
  ) {
    let options = {
      method: 'GET',
      uri: domain + `/approvalsetting/${approvalSettingId}/nodes`,
      qs: {
        original,
        approvalId,
      },
      json: true,
    };
    let data = await rp(options);
    return data;
  }

  //根据流程id获取流程
  async getApprovalById(approvalId: String, operatorId: String) {
    let options = {
      method: 'GET',
      uri: domain + `/approval/${approvalId}`,
      qs: {
        operatorId: operatorId,
      },
      json: true,
    };
    let data = await rp(options);
    return data;
  }

  //根据流程id批量获取流程列表（不分页）
  async getApprovalByIds(approvalIds: String[], operatorId: String) {
    let options = {
      method: 'POST',
      uri: domain + `/approval/list`,
      body: {
        approvalIds,
        operatorId,
      },
      json: true,
    };

    let data = await rp(options);
    return data;
  }

  //根据流程id获取当前节点或下一节点数据
  async getFlowing(approvalId: String, queryType: String, operatorId: String) {
    let options = {
      method: 'GET',
      uri: domain + `/flow/${approvalId}/node`,
      qs: {
        queryType,
        operatorId,
      },
      json: true,
    };

    let data = await rp(options);
    return data;
  }

  //根据流程id获取已流过的节点及状态
  async getFlowed(approvalId: String, operatorId: String) {
    let options = {
      method: 'GET',
      uri: domain + `/flow/${approvalId}/nodes`,
      qs: {
        operatorId: operatorId,
      },
      json: true,
    };
    let data = await rp(options);
    return data;
  }

  // 发起审核流
  async addFlow(flowInfo: any) {
    let options = {
      method: 'POST',
      uri: domain + `/flow`,
      body: flowInfo,
      json: true,
    };
    let data = await rp(options);
    return data;
  }

  //更新流程（审批通过/审批退回/审批驳回/审批转移/审批取消）
  async updateFlow(approvalId: String, updateData: any) {
    let options = {
      method: 'PUT',
      uri: domain + `/flow/${approvalId}`,
      body: updateData,
      json: true,
    };
    let data = await rp(options);
    return data;
  }

  // 上传指定资源
  async uploadResource(request: any) {
    let file = request.files.file[0];
    let resourceType = request.body.resourceType;
    let filename = file.originalname;
    let contentType = file.mimetype;
    let operatorId = request.user._id;
    let operatorName = request.user.userName;

    let readable = this.getReadable(file.buffer);
    const formData = new FormData();
    formData.append('file', readable, {
      contentType,
      filename,
    });

    formData.append('resourceType', resourceType);
    formData.append('operatorId', operatorId);
    formData.append('operatorName', operatorName);

    let data: any;

    data = await this.api.post(`/resource`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return data.data;
  }

  //删除指定资源
  async deleteResource(resourceId: String) {
    let options = {
      method: 'DELETE',
      uri: domain + `/resource/${resourceId}`,
      json: true,
    };
    let data = await rp(options);
    return data;
  }

  //根据资源id获取资源详细信息
  async getResource(resourceId: String) {
    let options = {
      method: 'GET',
      uri: domain + `/resource/${resourceId}`,
      json: true,
    };
    let data = await rp(options);
    return data;
  }

  //根据资源id下载资源
  async downloadResource(resourceId: String, isPreview?: boolean) {
    const { data } = await this.api.get(
      domain + `/resource/${resourceId}/download?isPreview=${isPreview || ''}`,
      {
        responseType: 'stream',
      }
    );
    return data;
  }

  //获取所有任务列表
  async getTasks(pageIndex: String, taskName: String) {
    let options = {
      method: 'GET',
      uri: domain + '/tasks',
      qs: {
        pageIndex: pageIndex,
        taskName: taskName,
      },
      json: true,
    };
    let data = await rp(options);
    return data;
  }

  //根据任务id获取任务信息
  async getTaskById(taskId: String) {
    let options = {
      method: 'GET',
      uri: domain + `/task/${taskId}`,
      json: true,
    };
    let data = await rp(options);
    return data;
  }

  //根据任务id获取任务信息
  async getTodos(
    pageIndex: String,
    bizName: String,
    operatorBizId: String,
    todoType: String,
    status: String
  ) {
    let options = {
      method: 'GET',
      uri: domain + '/todos',
      qs: {
        pageIndex: pageIndex,
        bizName: bizName,
        operatorBizId: operatorBizId,
        todoType: todoType,
        status: status,
      },
      json: true,
    };
    let data = await rp(options);
    return data;
  }

  //根据任务id获取任务信息
  async getTodo(todoId: String) {
    let options = {
      method: 'GET',
      uri: domain + `/todo/${todoId}`,
      json: true,
    };
    let data = await rp(options);
    return data;
  }

  //获取消息列表
  async getMessages(
    read: String,
    title: String,
    operatorId: String,
    pageIndex: String
  ) {
    let options = {
      method: 'GET',
      uri: domain + '/messages',
      qs: {
        read,
        title,
        operatorId,
        pageIndex,
      },
      json: true,
    };

    let data = await rp(options);
    return data;
  }

  //根据消息id获消息详细
  async getMessage(
    messageId: String,
    operatorId: String,
    operatorName: String
  ) {
    let options = {
      method: 'GET',
      uri: domain + `/message/${messageId}`,
      qs: {
        operatorId,
        operatorName,
      },
      json: true,
    };
    let data = await rp(options);
    return data;
  }

  //根据消息id更新消息
  async updateMessage(messageId: String, data: any) {
    let options = {
      method: 'PUT',
      uri: domain + `/message/${messageId}`,
      json: true,
      body: data,
    };
    let res = await rp(options);
    return res;
  }

  async sendMessages(data: any) {
    let options = {
      method: 'POST',
      uri: domain + `/message`,
      json: true,
      body: data,
    };

    let res = await rp(options);
    return res;
  }
}

const auditingService = new AuditingService();
export default auditingService;
