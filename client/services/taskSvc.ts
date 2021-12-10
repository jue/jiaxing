import BaseSvc from './BaseSvc';
import qs from 'querystring';

class Flow extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/';
  }

  async query(params) {
    const queryString = qs.stringify(params);
    const { data } = await this.api.get(`task?${queryString}`);
    return data;
  }
}

const flowSvc = new Flow();

export default flowSvc;
