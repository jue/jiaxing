import BaseSvc from './BaseSvc';
import qs from 'querystring';
import { CreateEngineeringInfoI } from '../../typings/engineering';

interface QueryI {}

class EngineeringSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/engineering';
  }

  async search(query: QueryI) {
    let { data } = await this.api.get('/search', {
      params: query,
      paramsSerializer: qs.stringify,
    });

    return data;
  }

  async create(info: CreateEngineeringInfoI) {
    let { data } = await this.api.post('/create', info);
    return data;
  }

  async delete(_id: string) {
    let { data } = await this.api.delete(`/delete?_id=${_id}`);
    return data;
  }

  async update(info: CreateEngineeringInfoI) {
    const { data } = await this.api.post('/update', info);
    return data;
  }
}

const engineeringSvc = new EngineeringSvc();
export default engineeringSvc;
