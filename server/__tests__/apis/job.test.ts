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

describe('department', () => {
  let idCompany = '';
  let idDepartment = '';
  let idJob = '';
  describe('/api/job/create', () => {
    it('should success', async (done) => {
      let clock = sinon.useFakeTimers({
        now: new Date('2020-01-01'),
      });
      let createCompanyInfo = {
        _id: 'test',
        name: '测试组织架构管理-单位1',
        parentId: '0',
        path: '/',
      };
      let { body } = await request(app)
        .post('/api/company/create')
        .set('Authorization', tokenUser)
        .send(createCompanyInfo)
        .expect(200);
      idCompany = body._id;
      expect(body.name).toEqual(createCompanyInfo.name);
      expect(body.parentId).toEqual(createCompanyInfo.parentId);

      clock.restore();
      done();
    });
    it('should success', async (done) => {
      let clock = sinon.useFakeTimers({
        now: new Date('2020-01-01'),
      });
      let createCompanyInfo = {
        _id: 'test',
        name: '测试组织架构管理-单位2',
        parentId: idCompany,
        path: '/' + idCompany,
      };
      let { body } = await request(app)
        .post('/api/company/create')
        .set('Authorization', tokenUser)
        .send(createCompanyInfo)
        .expect(200);

      expect(body.name).toEqual(createCompanyInfo.name);
      expect(body.parentId).toEqual(createCompanyInfo.parentId);

      clock.restore();
      done();
    });
    it('should success', async (done) => {
      let clock = sinon.useFakeTimers({
        now: new Date('2020-01-01'),
      });
      let createDepartmentInfo = {
        _id: 'test',
        name: '测试组织架构管理-部门1',
        parentId: '0',
        path: '/',
        idCompany: idCompany,
      };
      let { body } = await request(app)
        .post('/api/department/create')
        .set('Authorization', tokenUser)
        .send(createDepartmentInfo)
        .expect(200);
      idDepartment = body._id;
      expect(body.name).toEqual(createDepartmentInfo.name);
      expect(body.parentId).toEqual(createDepartmentInfo.parentId);

      clock.restore();
      done();
    });
    it('should success', async (done) => {
      let clock = sinon.useFakeTimers({
        now: new Date('2020-01-01'),
      });
      let createDepartmentInfo = {
        _id: 'test',
        name: '测试组织架构管理-部门1-2',
        parentId: idDepartment,
        path: '/' + idDepartment,
        idCompany: idCompany,
      };
      let { body } = await request(app)
        .post('/api/department/create')
        .set('Authorization', tokenUser)
        .send(createDepartmentInfo)
        .expect(200);

      expect(body.name).toEqual(createDepartmentInfo.name);
      expect(body.parentId).toEqual(createDepartmentInfo.parentId);

      clock.restore();
      done();
    });
    it('should success', async (done) => {
      let clock = sinon.useFakeTimers({
        now: new Date('2020-01-01'),
      });
      let createDepartmentInfo = {
        _id: 'test',
        name: '测试组织架构管理-职务1',
        parentId: '0',
        path: '/',
        idDepartment: idDepartment,
      };
      let { body } = await request(app)
        .post('/api/job/create')
        .set('Authorization', tokenUser)
        .send(createDepartmentInfo)
        .expect(200);
      idJob = body._id;
      expect(body.name).toEqual(createDepartmentInfo.name);
      expect(body.parentId).toEqual(createDepartmentInfo.parentId);

      clock.restore();
      done();
    });
    it('should success', async (done) => {
      let clock = sinon.useFakeTimers({
        now: new Date('2020-01-01'),
      });
      let createDepartmentInfo = {
        _id: 'test',
        name: '测试组织架构管理-职务1-2',
        parentId: idJob,
        path: '/' + idJob,
        idDepartment: idDepartment,
      };
      let { body } = await request(app)
        .post('/api/job/create')
        .set('Authorization', tokenUser)
        .send(createDepartmentInfo)
        .expect(200);

      expect(body.name).toEqual(createDepartmentInfo.name);
      expect(body.parentId).toEqual(createDepartmentInfo.parentId);

      clock.restore();
      done();
    });
  });

  describe('/api/job/search', () => {
    it('should return Array', async (done) => {
      let { body } = await request(app)
        .get('/api/job/search')
        .set('Authorization', tokenUser)
        .expect(200);

      expect(Array.isArray(body)).toEqual(true);
      done();
    });
    it('should return Array', async (done) => {
      let { body } = await request(app)
        .get('/api/department/search')
        .set('Authorization', tokenUser)
        .query({ _id: '111' })
        .expect(200);

      expect(body).toEqual(null);
      done();
    });
  });

  describe('/api/job/update', () => {
    it('should return success', async (done) => {
      let updateJobInfo = {
        _id: idJob,
        name: '测试-职务名称wds',
      };

      let { body } = await request(app)
        .post('/api/job/update')
        .set('Authorization', tokenUser)
        .send(updateJobInfo)
        .expect(200);

      expect(body.name).toEqual(updateJobInfo.name);
      done();
    });
  });

  describe('/api/job/delete', () => {
    it('should success', async (done) => {
      try {
        let { body } = await request(app)
          .delete('/api/job/delete')
          .set('Authorization', tokenUser)
          .query({ _id: idJob });

        expect(body).toEqual({});
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
