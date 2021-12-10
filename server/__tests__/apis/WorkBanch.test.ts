import request from 'supertest';
import sinon from 'sinon';
import app from '../../app';
import { beforeServerStart } from '../beforeRunTest';
import { tokenUser } from '../data/account';

beforeAll(async () => {
  await beforeServerStart();
});
jest.setTimeout(10000);

describe('workbanch', () => {
  describe('/workbanch/api/search', () => {
    it('should success', async (done) => {
      let clock = sinon.useFakeTimers({
        now: new Date('2020-01-01'),
      });
      let content = {
        userId: 'userId',
        atCreated: new Date(),
        content: 'wds创建任务',
      };
      let createTaskInfo = {
        _id: 'test',
        idRectification: '111111',
        idReport: '11111',
        idSubject: '111111',
        content: content,
        name: '测试质量检查-整改名称',
        endTime: new Date(),
        idExecutive: '5e9ffdb95296434b8cd2bd5c',
        idsCC: ['5e9ffdb95296434b8cd2bd5c', '5e9ffdb95296434b8cd2bd5d'],
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_task/create')
        .set('Authorization', tokenUser)
        .send(createTaskInfo)
        .expect(200);

      clock.restore();
      done();
    });
  });

  describe('/api/workbench/search', () => {
    it('should return Array', async (done) => {
      let { body } = await request(app)
        .get('/api/workbench/search')
        .set('Authorization', tokenUser)
        .query({ page: 0, limit: 3, todo: true })
        .expect(200);

      expect(Array.isArray(body.data)).toEqual(true);
      done();
    });
  });
});
