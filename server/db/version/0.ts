import bcrypt from 'bcrypt';
import { AccountModel } from '../../services/mongoose-models/account';
import { CompanyModel } from '../../services/mongoose-models/company';

async function beforeAccount() {
  let systemCompany = await beforeCompany();
  try {
    let preAccount = await AccountModel.findOne({
      userName: 'hantram123',
    });

    if (!preAccount) {
      preAccount = new AccountModel({
        userName: 'hantram123',
        nickName: 'hantram',
        password: await bcrypt.hash('hantram123', 10),
        idCompany: systemCompany._id,
        idDepartment: '1',
        idJob: '1',
        role: 'systemAdmin',
      });

      await preAccount.save();
    }
    return preAccount;

  } catch (error) {}
}

async function beforeCompany() {
  let company = await CompanyModel.findOne({
    name: 'tylinshanghai',
  });
  if (!company) {
    company = new CompanyModel({
      name: 'tylinshanghai',
      parentId: '0',
      path: '/',
      type: 'system',
    });

    await company.save();
  }
  return company;
}

export default async () => {
  await beforeAccount();
};
