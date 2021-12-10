import BaseSvc from './BaseSvc';
import qs from 'querystring';

import { WebConstructionSchemeI } from '../../typings/construction_scheme';

class ProgressSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/progress';
  }
  //创建/编辑
  async create(constructionInfo: Partial<WebConstructionSchemeI>) {
    const { data } = await this.api.post('/audit', constructionInfo);
    return data;
  }

  async query(params: any) {
    const queryString = qs.stringify(params);
    const { data } = await this.api.get(`/search?${queryString}`);
    return data;
  }

  async delete(params: any) {
    const { data } = await this.api.post('/audit', params);
    return data;
  }

  async update(planInfo: any) {
    const { data } = await this.api.post('/audit', planInfo);
    return data;
  }
  async uploadMpp(uploadData: Object, projectId: string, fileName: string) {
    const { data } = await this.api.post(
      '/mpp?projectId=' + projectId + '&fileName=' + fileName,
      uploadData
    );
    return data;
  }
  async approveSearch(params: any) {
    const queryString = qs.stringify(params);
    const { data } = await this.api.get(`/search/audit?${queryString}`);
    return data;
  }
  //putAudit
  async putAudit(params: any) {
    const { data } = await this.api.put(`/audit`, params);
    return data;
  }
  async taskCompletionCase(params: any) {
    const queryString = qs.stringify(params);
    const { data } = await this.api.post('/taskCompletionCase', queryString);
    return data;
  }
  async taskDelayCase(params: any) {
    const queryString = qs.stringify(params);
    const { data } = await this.api.post('/taskDelayCase', queryString);
    return data;
  }
  async delayTop10(params: any) {
    const query = qs.stringify(params);
    const { data } = await this.api.post('/delayTop10', query);
    return data;
  }
  async taskCompletionRate() {
    const { data } = await this.api.post('/taskCompletionRate');
    return data;
  }
  async durationStatistical() {
    const { data } = await this.api.post('/durationStatistical');
    return data;
  }
}

const progressSvc = new ProgressSvc();

export default progressSvc;
