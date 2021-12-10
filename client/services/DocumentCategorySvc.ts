import BaseSvc from './BaseSvc';
import { DocumentCategory } from '../../typings/document';
import qs from 'querystring';

class DocumentCategorySvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/documentCategory';
  }

  async create(departInfo: Partial<DocumentCategory>) {
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

  async update(departInfo: Partial<DocumentCategory>) {
    const { data } = await this.api.post('/update', departInfo);
    return data;
  }
}

const documentCategorySvc = new DocumentCategorySvc();
export default documentCategorySvc;
