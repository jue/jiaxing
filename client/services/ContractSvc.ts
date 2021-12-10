import BaseSvc from './BaseSvc';
import qs from 'querystring';
import { DBContractI } from '../../typings/contract';

type TenderType = 'public' | 'private';

export interface QueryI {
  idEngineering: string;
  page: number;
  limit: number;
  tendertype: TenderType;
  status: string;
  myself?: boolean;
}

class ContractSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api';
  }

  async search(query: Partial<QueryI>) {
    let { data } = await this.api.get('/contract', {
      params: query,
      paramsSerializer: qs.stringify,
    });

    return data;
  }

  async create(info: Partial<DBContractI>) {
    let { data } = await this.api.post('/contract', info);
    return data;
  }

  async update(info: Partial<DBContractI>) {
    const { data } = await this.api.put('/contract', info);
    return data;
  }

  async delete(_id: string) {
    let { data } = await this.api.delete(`/contract?_id=${_id}`);
    return data;
  }

  async historyCreate(hisInfo) {
    let { data } = await this.api.post('/contract/history', hisInfo);
    return data;
  }

  async historySearch() {
    let { data } = await this.api.get('/contract/history');
    return data;
  }
}

const contractSvc = new ContractSvc();
export default contractSvc;
