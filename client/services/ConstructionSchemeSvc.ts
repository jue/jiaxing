import BaseSvc from './BaseSvc';
import qs from 'querystring';

import { WebConstructionSchemeI } from '../../typings/construction_scheme';

class ConstructionSchemeSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/constructionScheme';
  }

  async create(constructionInfo: Partial<WebConstructionSchemeI>) {
    const { data } = await this.api.post('/create', constructionInfo);
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

  async update(planInfo: Partial<WebConstructionSchemeI>) {
    const { data } = await this.api.post('/update', planInfo);
    return data;
  }
}

const constructionSchemeSvc = new ConstructionSchemeSvc();

export default constructionSchemeSvc;
