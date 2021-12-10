import BaseSvc from './BaseSvc';
import { DBQualityInspectTaskI } from '../../typings/quality_inspect_task';
import qs from 'querystring';

class InspectTaskSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/quality/inspect_task';
  }

  async create(taskInfo: Partial<DBQualityInspectTaskI>) {
    const { data } = await this.api.post('/create', taskInfo);
    return data;
  }

  async query(id: string) {
    const { data } = await this.api.get(`/search?idReport=${id}`);
    return data;
  }

  async update(taskInfo: Partial<DBQualityInspectTaskI>) {
    const { data } = await this.api.post('/update', taskInfo);

    return data;
  }
}

const inspectTaskSvc = new InspectTaskSvc();

export default inspectTaskSvc;
