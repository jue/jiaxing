import BaseSvc from './BaseSvc';
import qs from 'querystring';

import { DBAccountI } from '../../typings/account';

class AccountSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/account';
  }

  async create(accountInfo: Partial<DBAccountI>) {
    const { data } = await this.api.post('/create', accountInfo);
    return data;
  }

  async search(params: any) {
    const queryString = qs.stringify(params);
    const { data } = await this.api.get(`/search?${queryString}`);
    return data;
  }

  async delete(id: string) {
    const { data } = await this.api.delete(`/delete?_id=${id}`);
    return data;
  }

  async update(accountInfo: Partial<DBAccountI>) {
    const { data } = await this.api.post('/update', accountInfo);
    return data;
  }

  async updatePassword(accountInfo: {
    _id: string;
    password: string;
    newPassword: string;
  }) {
    const { data } = await this.api.post('/updatePassword', accountInfo);
    return data;
  }

  async self() {
    const { data } = await this.api.get('/self');
    return data;
  }

  async logout() {
    const { data } = await this.api.post('/logout');
    return data;
  }
}

const accountSvc = new AccountSvc();

export default accountSvc;
