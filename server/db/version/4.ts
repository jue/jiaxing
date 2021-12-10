import { JobModel } from '../../services/mongoose-models/job';

export default async () => {
  await JobModel.findOneAndUpdate(
    { name: '合同管理部长/组长' },
    { name: '合同管理部部长/组长' }
  );
};
