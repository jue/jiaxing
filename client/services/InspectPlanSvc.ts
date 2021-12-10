import BaseSvc from './BaseSvc';
import qs from 'querystring';

import { WebQualityInspectPlan } from '../../typings/quality_inspect_plan';

class InspectPlanSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/quality/inspect_plan';
  }

  async create(planInfo: Partial<WebQualityInspectPlan>) {
    const { data } = await this.api.post('/create', planInfo);
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

  async update(planInfo: Partial<WebQualityInspectPlan>) {
    const { data } = await this.api.post('/update', planInfo);
    return data;
  }
}

const inspectPlanSvc = new InspectPlanSvc();

export default inspectPlanSvc;
