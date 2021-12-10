import request from 'supertest';
import app from '../../app';
import mongodbGridfsService from '../../services/MongodbGridfsService';
import beforeServerStart from '../../beforeServerStart';
import { tokenUser } from '../data/account';

beforeAll(async () => {
  await beforeServerStart();
  await mongodbGridfsService.db.dropDatabase();
});

describe('quality_inspect_subject', () => {
  let idPlan = '';
  let idSubject = '';
  let createFiles = [];
  let deleteFiles = [];
  describe('/api/file/upload', () => {
    it('should success', async (done) => {
      let { body } = await request(app)
        .post('/api/file/upload')
        .set('Authorization', tokenUser)
        .attach('files', Buffer.from('test'), {
          filename: 'test-1.txt',
          contentType: 'text/subject',
        })
        .attach('files', Buffer.from('test'), {
          filename: 'test-2.txt',
          contentType: 'text/subject',
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

  describe('/api/quality/inspect_subject/create', () => {
    it('should success', async (done) => {
      let createPlanInfo = {
        _id: 'test',
        name: '测试检查计划',
        startTime: new Date(),
        endTime: new Date(),
      };
      let { body: planBody } = await request(app)
        .post('/api/quality/inspect_plan/create')
        .set('Authorization', tokenUser)
        .send(createPlanInfo)
        .expect(200);

      idPlan = planBody._id;
      let subjectInfo = {
        _id: 'test',
        name: '测试检查主题',
        startTime: new Date(),
        endTime: new Date('2020-4-24'),
        idPlan: idPlan,
        progress: 50,
        files: createFiles,
      };
      let subjectInfo1 = {
        _id: 'test',
        name: '测试检查主题',
        startTime: new Date(),
        endTime: new Date('2020-4-24'),
        idPlan: idPlan,
        progress: 60,
        files: createFiles,
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_subject/create')
        .set('Authorization', tokenUser)
        .send(subjectInfo)
        .expect(200);
      idSubject = body._id;
      expect(body.name).toEqual(subjectInfo.name);
      expect(body.files.length).toEqual(2);
      expect(body.files).toEqual(createFiles);

      await request(app)
        .post('/api/quality/inspect_subject/create')
        .set('Authorization', tokenUser)
        .send(subjectInfo1)
        .expect(200);
      done();
    });
  });

  describe('/api/quality/inspect_subject/search', () => {
    it('should success', async (done) => {
      let { body } = await request(app)
        .get('/api/quality/inspect_subject/search')
        .set('Authorization', tokenUser)
        .query({ distributionState: 'false', delay: 'true' })
        .expect(200);

      expect(Array.isArray(body.data)).toEqual(true);
      done();
    });
    it('should success', async (done) => {
      let { body } = await request(app)
        .get('/api/quality/inspect_subject/search')
        .set('Authorization', tokenUser)
        .query({ _id: idSubject })
        .expect(200);

      expect(body._id).toEqual(idSubject);
      done();
    });
  });

  describe('/api/quality/inspect_subject/update', () => {
    it('should return success', async (done) => {
      let updateSubjectInfo = {
        _id: idSubject,
        name: '111',
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_subject/update')
        .set('Authorization', tokenUser)
        .send(updateSubjectInfo)
        .expect(200);
      expect(body.name).toEqual(updateSubjectInfo.name);
      expect(body.files.length).toEqual(2);
      expect(body.files[0].originalname).toEqual('test-1.txt');
      expect(body.files[1].originalname).toEqual('test-2.txt');
      done();
    });
    it('should return success', async (done) => {
      let updateSubjectInfo = {
        _id: idSubject,
        name: '222',
        deleteFiles: deleteFiles,
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_subject/update')
        .set('Authorization', tokenUser)
        .send(updateSubjectInfo)
        .expect(200);
      expect(body.name).toEqual(updateSubjectInfo.name);
      expect(body.files.length).toEqual(0);
      done();
    });
    it('should return success', async (done) => {
      let updateSubjectInfo = {
        _id: idSubject,
        name: '333',
        createFiles: createFiles,
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_subject/update')
        .set('Authorization', tokenUser)
        .send(updateSubjectInfo)
        .expect(200);
      expect(body.name).toEqual(updateSubjectInfo.name);
      expect(body.files.length).toEqual(2);
      expect(body.files[0].originalname).toEqual('test-1.txt');
      expect(body.files[1].originalname).toEqual('test-2.txt');
      done();
    });
  });

  describe('/api/quality/inspect_subject/delete', () => {
    it('should success', async (done) => {
      try {
        let { body } = await request(app)
          .delete('/api/quality/inspect_subject/delete')
          .set('Authorization', tokenUser)
          .query({ _id: idSubject });
        expect(body).toEqual({});
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
