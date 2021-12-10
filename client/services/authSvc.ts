import BaseSvc from './BaseSvc';

class AuthSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/auth';
  }

  async search(params) {
    const { data } = await this.api.get('/search');
    return data;
  }
}

const authSvc = new AuthSvc();

export default authSvc;
