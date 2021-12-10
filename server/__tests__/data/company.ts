import { CompanyModel } from '../../services/mongoose-models/company';
import { DBCompanyI } from '../../../typings/company';

export const company_system: DBCompanyI = {
  _id: '5ea560a0d122a727045344b4',
  path: '/',
  type: 'system',
  name: 'tylinshanghai',
  parentId: '0',
  atCreated: new Date('2020-04-26T10:21:20.682Z'),
  deleted: false,
};

export async function insertCompany() {
  await CompanyModel.insertMany([company_system]).catch((e) => {});
}
