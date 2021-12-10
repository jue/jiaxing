import BaseSvc from './BaseSvc';
import { DBQualityInspectCheckItemI } from '../../typings/quality_inspect_checkItem';

class InspectCheckItemSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/quality/inspect_checkItem';
  }

  async create(list: DBQualityInspectCheckItemI[]) {
    list.forEach(async (item: any) => {
      const { data } = await this.api.post('/create', item);
      return data;
    });
  }

  async query(id?: string) {
    const { data } = await this.api.get(`/search?_id=${id}`);
    return data;
  }
}

const inspectCheckItemSvc = new InspectCheckItemSvc();

export default inspectCheckItemSvc;
