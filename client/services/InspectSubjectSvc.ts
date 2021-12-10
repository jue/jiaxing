import BaseSvc from './BaseSvc';
import { WebQualityInspectSubjectI } from '../../typings/quality_inspect_subject';
import qs from 'querystring';

class InspectSubjectSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/quality/inspect_subject';
  }

  async create(subjectInfo: Partial<WebQualityInspectSubjectI>) {
    const { data } = await this.api.post('/create', subjectInfo);
    return data;
  }

  async update(subjectInfo: Partial<WebQualityInspectSubjectI>) {
    const { data } = await this.api.post('/update', subjectInfo);
    return data;
  }

  async delete(_id: string) {
    const { data } = await this.api.delete(`/delete?_id=${_id}`);
    return data;
  }

  async query(params: any) {
    const queryString = qs.stringify(params);

    const { data } = await this.api.get(`/search?${queryString}`);
    return data;
  }
}

const inspectSubjectSvc = new InspectSubjectSvc();

export default inspectSubjectSvc;
