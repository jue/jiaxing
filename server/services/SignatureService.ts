import request from 'request';
import { AxiosResponse } from 'axios';
import { Stream } from 'stream';

import { dev, AUDITING_SERVER_URI } from '../config';
import BaseSvc from '../../client/services/BaseSvc';

class UserInfo {
  operatorId: string;
  operatorName: string;
}

class SignatureService extends BaseSvc {
  domain = '';
  constructor() {
    super();
    this.domain = AUDITING_SERVER_URI || `http://auditing-model-server/t`;
    if (dev) {
      this.domain = AUDITING_SERVER_URI || `http://localhost:7001/t`;
    }

    this.apiUrl = this.domain;
  }

  async doSignature(
    fileStream: AxiosResponse<Stream>,
    fileName: string,
    auditId: string,
    formId: string,
    userInfo: UserInfo
  ) {
    const options = {
      method: 'POST',
      uri: `${this.apiUrl}/signature/sign`,
      formData: {
        approvalId: auditId,
        formId,
        ...userInfo,
        file: {
          value: fileStream.data,
          options: {
            filename: fileName,
            contentType: 'application/pdf',
          },
        },
      },
    };
    const res = await request(options);

    return res;
  }
}

const signatureService = new SignatureService();
export default signatureService;
