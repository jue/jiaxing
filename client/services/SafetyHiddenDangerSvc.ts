import BaseSvc from './BaseSvc';
import { WebSecurityRisksHiddenPerils } from '../../typings/security_risks_hidden_perils';
import { WebSecurityRisksProblemItem } from '../../typings/security_risks_problem_item';

import qs from 'querystring';

class SafetyHiddenDangerSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/security/hidden_perils';
  }

  async create(dataInfo: {
    perilsInfo: Partial<WebSecurityRisksHiddenPerils>;
    itemInfos: WebSecurityRisksProblemItem[];
  }) {
    const { data } = await this.api.post('/create', dataInfo);
    return data;
  }

  async query(params: any) {
    const queryString = qs.stringify(params);
    const { data } = await this.api.get(`/search?${queryString}`);
    return data;
  }
  async update(reportInfo: Partial<WebSecurityRisksHiddenPerils>) {
    const { data } = await this.api.post('/update', reportInfo);

    return data;
  }
  async reply(checkInfo: any) {
    const { data } = await this.api.post('/reply', checkInfo);
    return data;
  }
  async qualityStatistical() {
    const { data } = await this.api.post('/qualityStatistical');
    return data;
  }
  async qualityCompletionCase(params: any) {
    const query = qs.stringify(params);
    const { data } = await this.api.post('/qualityCompletionCase', query);
    return data;
  }
  async qualityProblem(params: any) {
    const query = qs.stringify(params);
    const { data } = await this.api.post(`/awaitRectifyStatistical?${query}`);
    return data;
  }
}

const safetyHiddenDangerSvc = new SafetyHiddenDangerSvc();

export default safetyHiddenDangerSvc;
