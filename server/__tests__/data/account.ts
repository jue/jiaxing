import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { CONFIG_JWT } from '../../config';
import { AccountModel } from '../../services/mongoose-models/account';
import { DBAccountI } from '../../../typings/account';

let { secret } = CONFIG_JWT;

export const testUser: Partial<DBAccountI> = {
  _id: '5e9ffdb95296434b8cd2bd5c',
  role: 'systemAdmin',
  userName: 'hantram123',
  nickName: 'hantram',
  password: '$2b$10$dSUbZs1uNeDwLxLMYcHsw..0Cj6DxxR1EjlKDRTnMfdoKHl6RhGqe',
  atCreated: new Date('2020-04-22T08:18:01.235Z'),
  idCompany: '5ea560a0d122a727045344b4',
  idDepartment: '5ea6bacdea9e3f41c0afe96d',
  idJob: '5ea6c5a4dccb014ff03b5f41',
  deleted: false,
};

export const testUser2: Partial<DBAccountI> = {
  _id: '5e9ffdb95296434b8cd2bd5d',
  role: 'common',
  userName: 'account_common',
  nickName: 'common',
  password: '$2b$10$dSUbZs1uNeDwLxLMYcHsw..0Cj6DxxR1EjlKDRTnMfdoKHl6RhGqe',
  atCreated: new Date('2020-04-22T08:18:01.235Z'),
  idCompany: '5ea560a0d122a727045344b4',
  idDepartment: '5ea6bacdea9e3f41c0afe96d',
  idJob: '5ea6c5a4dccb014ff03b5f41',
  deleted: false,
};

export const tokenUser = `Bearer ${jwt.sign(
  {
    _id: testUser._id,
  },
  secret
)}`;

export async function insertAccountData() {
  await AccountModel.insertMany([testUser, testUser2]).catch((e) => {});
}
