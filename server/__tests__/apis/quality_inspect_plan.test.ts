import request from 'supertest';
import sinon from 'sinon';
import app from '../../app';
import mongodbGridfsService from '../../services/MongodbGridfsService';
import beforeServerStart from '../../beforeServerStart';
import { tokenUser } from '../data/account';

beforeAll(async () => {
  await beforeServerStart();
  await mongodbGridfsService.db.dropDatabase();
});

describe('quality_inspect_plan', () => {
  let idPlan = '';
  let createFiles = [];
  let deleteFiles = [];
  describe('/api/file/upload', () => {
    it('should success', async (done) => {
      let { body } = await request(app)
        .post('/api/file/upload')
        .set('Authorization', tokenUser)
        .attach('files', Buffer.from('test'), {
          filename: 'test-1.txt',
          contentType: 'text/plain',
        })
        .attach('files', Buffer.from('test'), {
          filename: 'test-2.txt',
          contentType: 'text/plain',
        })
        .expect(200);

      createFiles = body;
      deleteFiles = body;
      expect(body.length).toEqual(2);
      expect(body[0].originalname).toEqual('test-1.txt');
      expect(body[1].originalname).toEqual('test-2.txt');

      done();
    });
  });

  describe('/api/quality/inspect_plan/create', () => {
    it('should success', async (done) => {
      let clock = sinon.useFakeTimers({
        now: new Date(),
      });
      let createPlanInfo = {
        _id: 'test',
        name: '测试检查计划',
        startTime: new Date(),
        endTime: new Date(),
        files: createFiles,
      };
      let { body: planBody } = await request(app)
        .post('/api/quality/inspect_plan/create')
        .set('Authorization', tokenUser)
        .send(createPlanInfo)
        .expect(200);

      idPlan = planBody._id;
      let createSubjectInfo = {
        _id: 'test',
        name: '测试检查主题',
        startTime: new Date(),
        endTime: new Date(),
        progress: '50',
        files: createFiles,
        idPlan: idPlan,
      };
      let createSubjectInfo1 = {
        _id: 'test',
        name: '测试检查主题',
        startTime: new Date(),
        endTime: new Date(),
        files: createFiles,
        progress: '55',
        idPlan: idPlan,
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_subject/create')
        .set('Authorization', tokenUser)
        .send(createSubjectInfo)
        .expect(200);
      await request(app)
        .post('/api/quality/inspect_subject/create')
        .set('Authorization', tokenUser)
        .send(createSubjectInfo1)
        .expect(200);
      expect(planBody.name).toEqual(createPlanInfo.name);
      expect(body.name).toEqual(createSubjectInfo.name);
      expect(planBody.files).toEqual(createFiles);

      clock.restore();
      done();
    });
  });

  describe('/api/quality/inspect_plan/search', () => {
    it('should return Array', async (done) => {
      let { body } = await request(app)
        .get('/api/quality/inspect_plan/search')
        .set('Authorization', tokenUser)
        .query({ page: 0, limit: 3 })
        .expect(200);

      expect(Array.isArray(body.data)).toEqual(true);
      done();
    });
    it('should return Array', async (done) => {
      let { body } = await request(app)
        .get('/api/quality/inspect_plan/search')
        .set('Authorization', tokenUser)
        .query({ _id: '111' })
        .expect(200);

      expect(body).toEqual(null);
      done();
    });
  });

  describe('/api/quality/inspect_plan/update', () => {
    it('should return success', async (done) => {
      let updatePlanInfo = {
        _id: idPlan,
        name: '111',
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_plan/update')
        .set('Authorization', tokenUser)
        .send(updatePlanInfo)
        .expect(200);

      expect(body.name).toEqual(updatePlanInfo.name);
      done();
    });
    it('should return success', async (done) => {
      let updatePlanInfo = {
        _id: idPlan,
        name: '222',
        deleteFiles: deleteFiles,
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_plan/update')
        .set('Authorization', tokenUser)
        .send(updatePlanInfo)
        .expect(200);
      expect(body.name).toEqual(updatePlanInfo.name);
      expect(body.files.length).toEqual(0);
      done();
    });
    it('should return success', async (done) => {
      let updatePlanInfo = {
        _id: idPlan,
        name: '333',
        createFiles: createFiles,
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_plan/update')
        .set('Authorization', tokenUser)
        .send(updatePlanInfo)
        .expect(200);
      expect(body.name).toEqual(updatePlanInfo.name);
      expect(body.files.length).toEqual(2);
      done();
    });
  });

  describe('/api/quality/inspect_plan/delete', () => {
    it('should success', async (done) => {
      try {
        let { body } = await request(app)
          .delete('/api/quality/inspect_plan/delete')
          .set('Authorization', tokenUser)
          .query({ _id: idPlan });
        expect(body).toEqual({});
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
