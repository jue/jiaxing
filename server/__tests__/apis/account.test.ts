import request from 'supertest';
import sinon from 'sinon';
import app from '../../app';
import { beforeServerStart } from '../beforeRunTest';
import { tokenUser } from '../data/account';
import bcrypt from 'bcrypt';
import { StatusCode } from '../../../constants/enums';

beforeAll(async () => {
  await beforeServerStart();
});
jest.setTimeout(10000);

describe('account', () => {
  let idAccount = '';
  let idAccount1 = '';
  let idAccount2 = '';
  let idCompany = '';
  let createFiles = [];
  describe('/api/file/upload', () => {
    it('should success', async (done) => {
      let { body } = await request(app)
        .post('/api/file/upload')
        .set('Authorization', tokenUser)
        .attach('files', Buffer.from('test'), {
          filename: 'test-1.txt',
          contentType: 'text/plain',
        })
        .expect(200);

      createFiles = body;
      expect(body.length).toEqual(1);
      expect(body[0].originalname).toEqual('test-1.txt');

      done();
    });
  });

  describe('/api/account/create', () => {
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
      let createAccountInfo = {
        _id: 'test',
        userName: '王大胜',
        role: 'companyAdmin',
        idCompany: idCompany,
        idDepartment: '11111',
        idJob: '11111',
      };
      let createAccountInfo1 = {
        _id: 'test',
        userName: '王大胜1',
        idCompany: idCompany,
        idDepartment: '22222',
        idJob: '22222',
      };
      let createAccountInfo2 = {
        _id: 'test',
        userName: '王大胜2',
        idCompany: idCompany,
        idDepartment: '3333',
        idJob: '3333',
      };
      let { body } = await request(app)
        .post('/api/account/create')
        .set('Authorization', tokenUser)
        .send(createAccountInfo)
        .expect(200);

      idAccount = body._id;
      expect(body.userName).toEqual(createAccountInfo.userName);

      let { body: account } = await request(app)
        .post('/api/account/create')
        .set('Authorization', tokenUser)
        .send(createAccountInfo1)
        .expect(200);
      idAccount1 = account._id;

      let { body: account1 } = await request(app)
        .post('/api/account/create')
        .set('Authorization', tokenUser)
        .send(createAccountInfo2)
        .expect(200);
      idAccount2 = account1._id;
      clock.restore();
      done();
    });
  });

  describe.only('/api/account/search', () => {
    it('should return Array', async (done) => {
      let { body } = await request(app)
        .get('/api/account/search')
        .set('Authorization', tokenUser)
        .query({ page: 0, limit: 3 })
        .expect(200);

      console.log(body);
      expect(Array.isArray(body.data)).toEqual(true);
      done();
    });
    it('should return Array', async (done) => {
      let { body } = await request(app)
        .get('/api/account/search')
        .set('Authorization', tokenUser)
        .query({ _id: '111' })
        .expect(200);

      expect(body).toEqual(null);
      done();
    });
  });

  describe('/api/account/update', () => {
    it('should return success', async (done) => {
      let updateAccountInfo = {
        _id: idAccount,
        nickName: '测试-用户名称wds',
      };

      let { body } = await request(app)
        .post('/api/account/update')
        .set('Authorization', tokenUser)
        .send(updateAccountInfo)
        .expect(200);

      expect(body.nickName).toEqual(updateAccountInfo.nickName);
      done();
    });
    it('should return success', async (done) => {
      let updateAccountInfo = {
        _id: idAccount,
        files: createFiles[0],
      };

      let { body } = await request(app)
        .post('/api/account/update')
        .set('Authorization', tokenUser)
        .send(updateAccountInfo)
        .expect(200);

      expect(body.files).toEqual(updateAccountInfo.files);
      done();
    });
  });

  describe('/api/account/self', () => {
    it('should return Array', async (done) => {
      let { body } = await request(app)
        .get('/api/account/self')
        .set('Authorization', tokenUser)
        .expect(200);

      expect(body).toEqual(null);
      done();
    });
  });

  describe('/api/account/updatePassword', () => {
    it('should return success', async (done) => {
      let updateInfo = {
        _id: idAccount,
        password: '123456',
        newPassword: '666666',
      };

      let { body } = await request(app)
        .post('/api/account/updatePassword')
        .set('Authorization', tokenUser)
        .send(updateInfo)
        .expect(200);

      expect(true).toEqual(
        await bcrypt.compare(updateInfo.newPassword, body.password)
      );
      done();
    });
  });

  describe('/api/account/validPassword', () => {
    it('should return success', async (done) => {
      let updateInfo = {
        _id: idAccount,
        password: '666666',
      };

      let { body } = await request(app)
        .post('/api/account/validPassword')
        .set('Authorization', tokenUser)
        .send(updateInfo)
        .expect(200);

      expect(body.status).toEqual(StatusCode.password_valid_success);
      done();
    });
  });

  describe('/api/account/insertRole', () => {
    it('should return success', async (done) => {
      let updateInfo = {
        _id: idAccount,
        accountIds: [idAccount1],
      };

      let { body } = await request(app)
        .post('/api/account/insertRole')
        .set('Authorization', tokenUser)
        .send(updateInfo)
        .expect(200);

      expect(body.status).toEqual(StatusCode.role_insert_success);
      done();
    });
  });

  describe('/api/account/moveRole', () => {
    it('should return success', async (done) => {
      let updateInfo = {
        _id: idAccount,
        accountIds: [idAccount2],
      };

      let { body } = await request(app)
        .post('/api/account/moveRole')
        .set('Authorization', tokenUser)
        .send(updateInfo)
        .expect(200);

      expect(body.status).toEqual(StatusCode.role_move_success);
      done();
    });
  });

  describe('/api/account/delete', () => {
    it('should success', async (done) => {
      try {
        let { body } = await request(app)
          .delete('/api/account/delete')
          .set('Authorization', tokenUser)
          .query({ _id: idAccount });

        expect(body).toEqual({});
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
