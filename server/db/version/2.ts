import { CompanyModel } from '../../services/mongoose-models/company';

export default async () => {
  await CompanyModel.deleteOne({
    name: 'tylinshanghai',
  });
};
