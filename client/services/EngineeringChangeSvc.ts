import BaseSvc from './BaseSvc';
import qs from 'querystring';
import { DBEngineeringChangeI } from '../../typings/engineering_change';

interface QueryI { }

class EngineeringChangeSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/engineeringChange';
  }

  async search(query: QueryI) {
    let { data } = await this.api.get('/search', {
      params: query,
      paramsSerializer: qs.stringify,
    });

    return data;
  }

  async create(info: DBEngineeringChangeI) {
    let { data } = await this.api.post('/create', info);
    return data;
  }

  async delete(_id: string) {
    let { data } = await this.api.delete(`/delete?_id=${_id}`);
    return data;
  }

  async update(info: DBEngineeringChangeI) {
    const { data } = await this.api.post('/update', info);
    return data;
  }
  async statistical() {
    let { data } = await this.api.post('/statistical');
    return data;
  }
  async changeLevelPercent(params: any) {
    const query = qs.stringify(params)
    const { data } = await this.api.post('/changeLevelPercent', query);
    return data;
  }
  async changeTypePercent(params: any) {
    const query = qs.stringify(params);
    const { data } = await this.api.post('/changeTypePercent', query);
    return data;
  }

}

const engineeringChangeSvc = new EngineeringChangeSvc();
export default engineeringChangeSvc;
