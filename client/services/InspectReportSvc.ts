import BaseSvc from './BaseSvc';
import { DBQualityInspectReportI } from '../../typings/quality_inspect_report';
import qs from 'querystring';

class InspectReportSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/quality/inspect_report';
  }

  async create(reportInfo: Partial<DBQualityInspectReportI>) {
    const { data } = await this.api.post('/create', reportInfo);
    return data;
  }

  async query(params: any) {
    const queryString = qs.stringify(params);
    const { data } = await this.api.get(`/search?${queryString}`);
    return data;
  }
  async update(reportInfo: Partial<DBQualityInspectReportI>) {
    const { data } = await this.api.post('/update', reportInfo);

    return data;
  }
}

const inspectReportSvc = new InspectReportSvc();

export default inspectReportSvc;
