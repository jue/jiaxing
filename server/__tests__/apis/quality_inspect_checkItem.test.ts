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

describe('quality_inspect_checkItem', () => {
  let idReport = '';
  let idCheckItem = '';
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

  describe('/api/quality/inspect_checkItem/create', () => {
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
        files: createFiles,
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_checkItem/create')
        .set('Authorization', tokenUser)
        .send(createInfo)
        .expect(200);
      idCheckItem = body._id;
      expect(body.name).toEqual(createInfo.name);
      expect(body.files.length).toEqual(2);
      expect(body.files).toEqual(createFiles);

      clock.restore();
      done();
    });
  });

  describe('/api/quality/inspect_checkItem/search', () => {
    it('should success', async (done) => {
      let { body } = await request(app)
        .get('/api/quality/inspect_checkItem/search')
        .set('Authorization', tokenUser)
        .expect(200);

      expect(Array.isArray(body)).toEqual(true);
      done();
    });
    it('should return Array', async (done) => {
      let { body } = await request(app)
        .get('/api/quality/inspect_checkItem/search')
        .set('Authorization', tokenUser)
        .query({ _id: '111' })
        .expect(200);

      expect(body).toEqual(null);
      done();
    });
  });

  describe('/api/quality/inspect_checkItem/update', () => {
    it('should return success', async (done) => {
      let createCheckItemInfo = {
        _id: idCheckItem,
        name: 'wds名称111',
        remark: 'wds备注',
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_checkItem/update')
        .set('Authorization', tokenUser)
        .send(createCheckItemInfo)
        .expect(200);
      expect(body.name).toEqual(createCheckItemInfo.name);
      expect(body.remark).toEqual(createCheckItemInfo.remark);
      expect(body.files.length).toEqual(2);
      expect(body.files[0].originalname).toEqual('test-1.txt');
      expect(body.files[1].originalname).toEqual('test-2.txt');
      done();
    });
    it('should return success', async (done) => {
      let createCheckItemInfo = {
        _id: idCheckItem,
        name: 'wds名称222',
        remark: 'wds备注',
        deleteFiles: deleteFiles,
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_checkItem/update')
        .set('Authorization', tokenUser)
        .send(createCheckItemInfo)
        .expect(200);
      expect(body.name).toEqual(createCheckItemInfo.name);
      expect(body.remark).toEqual(createCheckItemInfo.remark);
      expect(body.files.length).toEqual(0);
      done();
    });
    it('should return success', async (done) => {
      let createCheckItemInfo = {
        _id: idCheckItem,
        name: 'wds名称333',
        remark: 'wds备注',
        createFiles: createFiles,
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_checkItem/update')
        .set('Authorization', tokenUser)
        .send(createCheckItemInfo)
        .expect(200);
      expect(body.name).toEqual(createCheckItemInfo.name);
      expect(body.remark).toEqual(createCheckItemInfo.remark);
      expect(body.files.length).toEqual(2);
      expect(body.files[0].originalname).toEqual('test-1.txt');
      expect(body.files[1].originalname).toEqual('test-2.txt');
      done();
    });
  });

  describe('/api/quality/inspect_checkItem/delete', () => {
    it('should success', async (done) => {
      try {
        let { body } = await request(app)
          .delete('/api/quality/inspect_checkItem/delete')
          .set('Authorization', tokenUser)
          .query({ _id: idCheckItem });
        expect(body).toEqual({});
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
