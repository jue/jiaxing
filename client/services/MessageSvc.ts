import { statusInfo } from './../../constants/enums';
import BaseSvc from './BaseSvc';
import qs from 'querystring';

class MessageSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api';
  }

  async search(params: any) {
    const queryString = qs.stringify(params);
    const { data } = await this.api.get(`/messages?${queryString}`);
    return data;
  }

  async query(params: any) {
    const queryString = qs.stringify(params);
    const { data } = await this.api.get(`/message?${queryString}`);
    return data;
  }

  async update(id: string, params: any) {
    const queryString = qs.stringify(params);
    const { data } = await this.api.put(`/message?messageId=${id}`, queryString);
    return data;
  }
}

const messageSvc = new MessageSvc();

export default messageSvc;
