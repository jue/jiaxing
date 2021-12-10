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
  let idDepartment = '';
  let idCompany = '';
  let idJob = '';
  describe('/api/department/create', () => {
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

  describe('/api/department/search', () => {
    it('should return Array', async (done) => {
      let { body } = await request(app)
        .get('/api/department/search')
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

  describe('/api/department/update', () => {
    it('should return success', async (done) => {
      let updateDepartmentInfo = {
        _id: idDepartment,
        name: '测试-部门名称wds',
      };

      let { body } = await request(app)
        .post('/api/department/update')
        .set('Authorization', tokenUser)
        .send(updateDepartmentInfo)
        .expect(200);

      expect(body.name).toEqual(updateDepartmentInfo.name);
      done();
    });
  });

  describe('/api/department/delete', () => {
    it('should success', async (done) => {
      try {
        let { body } = await request(app)
          .delete('/api/department/delete')
          .set('Authorization', tokenUser)
          .query({ _id: idDepartment });

        expect(body).toEqual({});
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
