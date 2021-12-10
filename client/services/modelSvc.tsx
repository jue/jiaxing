import BaseSvc from './BaseSvc';
import { FRONT_END_DBModelI } from '../../typings/model';
import qs from 'querystring';

class ModelSvc extends BaseSvc {
  constructor() {
    super(), (this.apiUrl = '/api/model');
  }

  async create(modelInfo: Partial<FRONT_END_DBModelI>) {
    const { data } = await this.api.post('/create', modelInfo);
    return data;
  }

  async query(params: any) {
    const queryString = qs.stringify(params);
    const { data } = await this.api.get(`/search?${queryString}`);
    return data;
  }

  async delete(_id: string) {
    const { data } = await this.api.delete(`/delete?_id=${_id}`);
    return data;
  }
}

const modelSvc = new ModelSvc();

export default modelSvc;
