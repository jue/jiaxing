import BaseSvc from './BaseSvc';
import qs from 'querystring';

import { DBDepartmentI } from '../../typings/department';

class DepartSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/department';
  }

  async create(departInfo: Partial<DBDepartmentI>) {
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

  async update(departInfo: Partial<DBDepartmentI>) {
    const { data } = await this.api.post('/update', departInfo);
    return data;
  }
}

const departSvc = new DepartSvc();

export default departSvc;
