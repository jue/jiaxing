import BaseSvc from './BaseSvc';
import qs from 'querystring';

class Flow extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/flow';
  }

  async queryNode(params) {
    const queryString = qs.stringify(params);
    const { data } = await this.api.get(`/node?${queryString}`);
    return data;
  }

  async queryFlow(idAuditing) {
    const { data } = await this.api.get(`/nodes?idAuditing=${idAuditing}`);
    return data;
  }

  async update(params) {
    const { data } = await this.api.put('/', params);
    return data;
  }

  async getAuditingMap(params) {
    const queryString = qs.stringify(params);
    const { data } = await this.api.get(`/getAuditingMap?${queryString}`);
    return data;
  }
}

const flowSvc = new Flow();

export default flowSvc;
