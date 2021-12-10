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

describe('quality_inspect_rectification', () => {
  let idReport = '';
  let idRectification = '';
  let createFiles = [];
  let deleteFiles = [];
  describe('/api/file/upload', () => {
    it('should success', async (done) => {
      let { body } = await request(app)
        .post('/api/file/upload')
        .set('Authorization', tokenUser)
        .attach('files', Buffer.from('test'), {
          filename: 'test-1.txt',
          contentType: 'text/report',
        })
        .attach('files', Buffer.from('test'), {
          filename: 'test-2.txt',
          contentType: 'text/report',
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

  describe('/api/quality/inspect_rectification/create', () => {
    it('should success', async (done) => {
      let clock = sinon.useFakeTimers({
        now: new Date('2020-01-01'),
      });
      let createReportInfo = {
        _id: 'test',
        idSubject: 'idSubject',
        name: '测试质量检查-检查报告名称',
        desc: '测试质量检查-检查报告描述',
        atCreated: new Date(),
        files: createFiles,
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_report/create')
        .set('Authorization', tokenUser)
        .send(createReportInfo)
        .expect(200);

      idReport = body._id;
      clock.restore();
      done();
    });
    it('should success', async (done) => {
      let clock = sinon.useFakeTimers({
        now: new Date('2020-01-01'),
      });
      let createRectificationInfo = {
        _id: 'test',
        name: '测试检查计划',
        endTime: new Date(),
        idExecutive: '测试执行人',
        idsCC: ['抄送对象'],
        idReport: idReport,
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_rectification/create')
        .set('Authorization', tokenUser)
        .send(createRectificationInfo)
        .expect(200);
      idRectification = body._id;
      expect(body.name).toEqual(createRectificationInfo.name);
      expect(body.idExecutive).toEqual(createRectificationInfo.idExecutive);
      expect(body.idsCC).toEqual(createRectificationInfo.idsCC);
      clock.restore();
      done();
    });
  });

  // describe('/api/quality/inspect_rectification/search', () => {
  //   it('should success', async (done) => {
  //     let { body } = await request(app)
  //       .get('/api/quality/inspect_rectification/search')
  //       .set('Authorization', tokenUser)
  //       .expect(200);

  //     expect(Array.isArray(body)).toEqual(true);
  //     done();
  //   });
  // });

  // describe('/api/quality/inspect_rectification/update', () => {
  //   it('should return success', async (done) => {
  //     let updateAccountInfo = {
  //       _id: idRectification,
  //       name: '测试-整改名称wds',
  //     };

  //     let { body } = await request(app)
  //       .post('/api/quality/inspect_rectification/update')
  //       .set('Authorization', tokenUser)
  //       .send(updateAccountInfo)
  //       .expect(200);

  //     expect(body.name).toEqual(updateAccountInfo.name);
  //     done();
  //   });
  // });
});
