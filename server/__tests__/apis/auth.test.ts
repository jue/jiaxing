import request from 'supertest';
import sinon from 'sinon';
import app from '../../app';
import mongodbGridfsService from '../../services/MongodbGridfsService';
import beforeServerStart from '../../beforeServerStart';
import { tokenUser } from '../data/account';
import { AuthAction, AuthModuleType } from '../../../constants/enums';

beforeAll(async () => {
  await beforeServerStart();
  await mongodbGridfsService.db.dropDatabase();
});

describe('auth', () => {
  let idAuth = '';
  describe('/api/auth/create', () => {
    it('should success', async (done) => {
      let clock = sinon.useFakeTimers({
        now: new Date('2020-01-01'),
      });
      let createAuthInfo = {
        name: '风险管理',
        action: AuthAction.update,
        moduleType: AuthModuleType.riskManagement,
      };

      let { body } = await request(app)
        .post('/api/auth/create')
        .set('Authorization', tokenUser)
        .send(createAuthInfo)
        .expect(200);

      idAuth = body._id;
      expect(body.name).toEqual(createAuthInfo.name);

      clock.restore();
      done();
    });
  });

  describe('/api/auth/search', () => {
    it('should return Array', async (done) => {
      let { body } = await request(app)
        .get('/api/auth/search')
        .set('Authorization', tokenUser)
        .expect(200);

      expect(Array.isArray(body)).toEqual(true);
      done();
    });
    it('should return Array', async (done) => {
      let { body } = await request(app)
        .get('/api/auth/search')
        .set('Authorization', tokenUser)
        .query({ _id: '111' })
        .expect(200);

      expect(body).toEqual(null);
      done();
    });
  });

  describe('/api/auth/update', () => {
    it('should return success', async (done) => {
      let updateAuthInfo = {
        _id: idAuth,
        name: '测试-权限名称',
      };

      let { body } = await request(app)
        .post('/api/auth/update')
        .set('Authorization', tokenUser)
        .send(updateAuthInfo)
        .expect(200);

      expect(body.name).toEqual(updateAuthInfo.name);
      done();
    });
  });

  describe('/api/auth/delete', () => {
    it('should success', async (done) => {
      try {
        let { body } = await request(app)
          .delete('/api/auth/delete')
          .set('Authorization', tokenUser)
          .query({ _id: idAuth });

        expect(body).toEqual({});
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
