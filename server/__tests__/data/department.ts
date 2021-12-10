import { DepartmentModel } from '../../services/mongoose-models/department';
import { DBDepartmentI } from '../../../typings/department';

export const department1: DBDepartmentI = {
  _id: '5ea6bacdea9e3f41c0afe96d',
  path: '/0',
  idCompany: '5ea560a0d122a727045344b4',
  name: 'department_1',
  parentId: '0',
  atCreated: new Date('2020-04-27T10:58:21.754Z'),
  deleted: false,
};

export async function insertDepartment() {
  await DepartmentModel.insertMany([department1]).catch((e) => {});
}
