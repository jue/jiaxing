import BaseSvc from './BaseSvc';
import qs from 'querystring';

import { DBCompanyI } from '../../typings/company';

class CompanySvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/company';
  }

  async create(companyInfo: Partial<DBCompanyI>) {
    const { data } = await this.api.post('/create', companyInfo);
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

  async update(companyInfo: Partial<DBCompanyI>) {
    const { data } = await this.api.post('/update', companyInfo);
    return data;
  }
}

const companySvc = new CompanySvc();

export default companySvc;
