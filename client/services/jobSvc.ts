import BaseSvc from './BaseSvc';
import qs from 'querystring';

import { DBJobI } from '../../typings/job';

class JobSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/job';
  }

  async create(jobInfo: Partial<DBJobI>) {
    const { data } = await this.api.post('/create', jobInfo);
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

  async update(jobInfo: Partial<DBJobI>) {
    const { data } = await this.api.post('/update', jobInfo);
    return data;
  }
}

const jobSvc = new JobSvc();

export default jobSvc;
