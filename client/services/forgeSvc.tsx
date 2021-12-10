import BaseSvc from './BaseSvc';
import qs from 'querystring';
class Forge extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/forge';
  }

  async create(files) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file);
    });
    const { data } = await this.api.post('/create', formData);
    return data;
  }

  async view(id) {
    const { data } = await this.api.get(`/view?modelId=${id}`);
    return data;
  }

  async search(id) {
    const { data } = await this.api.get(`/search?modelId=${id}`);
    return data;
  }
  async modelDiff(params: any) {
    const queryString = qs.stringify(params);
    const { data } = await this.api.get(`/modelDiff?${queryString}`);
    return data;
  }
}

const forgeSvc = new Forge();
export default forgeSvc;
