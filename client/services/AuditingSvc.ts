import BaseSvc from './BaseSvc';
import qs from 'querystring';

interface QueryI {
  status: 'todo' | 'done';
}

class AuditingSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/auditing/';
  }

  async search(query: QueryI) {
    let { data } = await this.api.get('/search', {
      params: query,
      paramsSerializer: qs.stringify,
    });

    return data;
  }

  async getNextAuditing(info) {
    let { data } = await this.api.post('/getNextAuditing', info);
    return data;
  }

  async getAutiting(info) {
    let { data } = await this.api.post('/getAuditing', info);
    return data;
  }

  //   async getNextContractAuditing(info) {
  //     let { data } = await this.api.post('/getNextContractAuditing', info);
  //     return data;
  //   }
}

const auditingSvc = new AuditingSvc();
export default auditingSvc;
