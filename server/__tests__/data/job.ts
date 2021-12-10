import { JobModel } from '../../services/mongoose-models/job';
import { DBJobI } from '../../../typings/job';

export const job1: DBJobI = {
  _id: '5ea6c5a4dccb014ff03b5f41',
  path: '/',
  idCompany: '5ea560a0d122a727045344b4',
  idDepartment: '5ea6bacdea9e3f41c0afe96d',
  name: 'job_1',
  parentId: '0',
  atCreated: new Date('2020-04-22T08:18:01.235Z'),
  deleted: false,
};

export async function insertJob() {
  await JobModel.insertMany([job1]).catch((e) => {});
}
