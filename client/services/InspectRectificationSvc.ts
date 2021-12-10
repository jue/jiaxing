import BaseSvc from './BaseSvc';
import { DBQualityInspectRectificationI } from '../../typings/quality_inspect_rectification';
import qs from 'querystring';

class InspectRectificationSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/quality/inspect_rectification';
  }

  async create(
    createRectificationInfo: Partial<DBQualityInspectRectificationI>
  ) {
    const { data } = await this.api.post('/create', createRectificationInfo);
    return data;
  }
  async query(id?: string) {
    const { data } = await this.api.get(`/search?idReport=${id}`);
    return data;
  }
  async update(rectificationInfo: Partial<DBQualityInspectRectificationI>) {
    const { data } = await this.api.post('/update', rectificationInfo);

    return data;
  }
}

const inspectRectificationSvc = new InspectRectificationSvc();

export default inspectRectificationSvc;
