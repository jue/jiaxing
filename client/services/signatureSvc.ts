import BaseSvc from './BaseSvc';
import qs from 'querystring';

class SignatureSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api';
  }

  async preview(params: any) {
    const queryString = qs.stringify(params);
    const { data } = await this.api.post(`/signature/preview`, queryString);
    return data;
  }

  async create(params: any) {
    const queryString = qs.stringify(params);
    const { data } = await this.api.post(`/signature`, queryString);
    return data;
  }
}

const signatureSvc = new SignatureSvc();

export default signatureSvc;