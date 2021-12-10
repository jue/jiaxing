import BaseSvc from './BaseSvc';
import qs from 'querystring';

class DocumentSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/document';
  }

  async create(departInfo) {
    const { data } = await this.api.post('/create', departInfo);
    return data;
  }

  async query(params: any) {
    const queryString = qs.stringify(params);
    const { data } = await this.api.get(`/search?${queryString}`);
    return data;
  }

  async delete(id: string) {
    const { data } = await this.api.delete(`/delete?_id=${id}`);
    return data;
  }

  async update(departInfo) {
    const { data } = await this.api.post('/update', departInfo);
    return data;
  }
}

const documentSvc = new DocumentSvc();
export default documentSvc;
