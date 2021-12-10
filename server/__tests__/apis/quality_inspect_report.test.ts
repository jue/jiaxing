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

describe('quality_inspect_report', () => {
  let idReport = '';
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

  describe('/api/quality/inspect_report/create', () => {
    it('should success', async (done) => {
      let clock = sinon.useFakeTimers({
        now: new Date('2020-01-01'),
      });
      let createReportInfo = {
        _id: 'test',
        idSubject: '11111111',
        name: '测试质量检查-检查报告名称',
        desc: '测试质量检查-检查报告描述',
        atCreated: new Date(),
        files: createFiles,
      };
      let { body: reportBody } = await request(app)
        .post('/api/quality/inspect_report/create')
        .set('Authorization', tokenUser)
        .send(createReportInfo)
        .expect(200);

      idReport = reportBody._id;
      let createInfo = {
        _id: 'test',
        name: '测试质量检查-检查项名称',
        idReport: idReport,
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_checkItem/create')
        .set('Authorization', tokenUser)
        .send(createInfo)
        .expect(200);
      expect(reportBody.name).toEqual(createReportInfo.name);
      expect(body.name).toEqual(createInfo.name);
      expect(reportBody.files).toEqual(createFiles);

      clock.restore();
      done();
    });
  });

  describe('/api/quality/inspect_report/search', () => {
    it('should return Array', async (done) => {
      let { body } = await request(app)
        .get('/api/quality/inspect_report/search')
        .set('Authorization', tokenUser)
        .query({ page: 0, limit: 3 })
        .expect(200);

      expect(Array.isArray(body.data)).toEqual(true);
      done();
    });
    it('should return Array', async (done) => {
      let { body } = await request(app)
        .get('/api/quality/inspect_report/search')
        .set('Authorization', tokenUser)
        .query({ _id: '111' })
        .expect(200);

      expect(body).toEqual(null);
      done();
    });
  });

  describe('/api/quality/inspect_report/update', () => {
    it('should return success', async (done) => {
      let createReportInfo = {
        _id: idReport,
        name: 'wds名称111',
        desc: 'wds描述',
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_report/update')
        .set('Authorization', tokenUser)
        .send(createReportInfo)
        .expect(200);
      expect(body.name).toEqual(createReportInfo.name);
      expect(body.desc).toEqual(createReportInfo.desc);
      done();
    });
    it('should return success', async (done) => {
      let createReportInfo = {
        _id: idReport,
        name: 'wds名称222',
        desc: 'wds描述',
        deleteFiles: deleteFiles,
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_report/update')
        .set('Authorization', tokenUser)
        .send(createReportInfo)
        .expect(200);
      expect(body.name).toEqual(createReportInfo.name);
      expect(body.desc).toEqual(createReportInfo.desc);
      expect(body.files.length).toEqual(0);
      done();
    });

    it('should return success', async (done) => {
      let createReportInfo = {
        _id: idReport,
        name: 'wds名称333',
        desc: 'wds描述',
        createFiles: createFiles,
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_report/update')
        .set('Authorization', tokenUser)
        .send(createReportInfo)
        .expect(200);
      expect(body.name).toEqual(createReportInfo.name);
      expect(body.desc).toEqual(createReportInfo.desc);
      expect(body.files.length).toEqual(2);
      expect(body.files[0].originalname).toEqual('test-1.txt');
      expect(body.files[1].originalname).toEqual('test-2.txt');
      done();
    });
  });

  describe('/api/quality/inspect_report/delete', () => {
    it('should success', async (done) => {
      try {
        let { body } = await request(app)
          .delete('/api/quality/inspect_report/delete')
          .set('Authorization', tokenUser)
          .query({ _id: idReport });
        expect(body).toEqual({});
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
