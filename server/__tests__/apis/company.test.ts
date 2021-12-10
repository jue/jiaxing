import request from 'supertest';
import app from '../../app';
import { beforeServerStart } from '../beforeRunTest';
import { tokenUser } from '../data/account';

beforeAll(async () => {
  await beforeServerStart();
});
jest.setTimeout(10000);

describe('company', () => {
  let idCompany = '';
  describe('/api/company/search', () => {
    it('should return Array', async (done) => {
      let { body } = await request(app)
        .get('/api/company/search')
        .set('Authorization', tokenUser)
        .expect(200);

      idCompany = body[0]._id;
      done();
    });
    it('should return Array', async (done) => {
      let { body } = await request(app)
        .get('/api/company/search')
        .set('Authorization', tokenUser)
        .query({ _id: '111' })
        .expect(200);

      expect(body).toEqual(null);
      done();
    });
  });

  describe('/api/company/update', () => {
    it('should return success', async (done) => {
      let updateCompanyInfo = {
        _id: idCompany,
        name: '测试-单位名称wds',
      };

      let { body } = await request(app)
        .post('/api/company/update')
        .set('Authorization', tokenUser)
        .send(updateCompanyInfo)
        .expect(200);

      expect(body.name).toEqual(updateCompanyInfo.name);
      done();
    });
  });

  describe('/api/company/delete', () => {
    it('should success', async (done) => {
      try {
        let { body } = await request(app)
          .delete('/api/company/delete')
          .set('Authorization', tokenUser)
          .query({ _id: idCompany });

        expect(body).toEqual({});
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
