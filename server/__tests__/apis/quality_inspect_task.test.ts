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

describe('quality_inspect_task', () => {
  let idTask = '';
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

  describe('/api/quality/inspect_task/create', () => {
    it('should success', async (done) => {
      let clock = sinon.useFakeTimers({
        now: new Date(),
      });
      let content = {
        userId: 'userId',
        atCreated: new Date(),
        content: 'wds创建任务',
      };
      let createTaskInfo = {
        _id: 'test',
        idRectification: '111111',
        idReport: '111111',
        idSubject: '111111',
        content: content,
        files: createFiles,
      };
      let { body: taskBody } = await request(app)
        .post('/api/quality/inspect_task/create')
        .set('Authorization', tokenUser)
        .send(createTaskInfo)
        .expect(200);

      idTask = taskBody._id;
      expect(taskBody.files).toEqual(createFiles);

      clock.restore();
      done();
    });
  });

  describe('/api/quality/inspect_task/search', () => {
    it('should return Array', async (done) => {
      let { body } = await request(app)
        .get('/api/quality/inspect_task/search')
        .set('Authorization', tokenUser)
        .expect(200);

      expect(Array.isArray(body)).toEqual(true);
      done();
    });
    it('should return Array', async (done) => {
      let { body } = await request(app)
        .get('/api/quality/inspect_task/search')
        .set('Authorization', tokenUser)
        .query({ _id: '111' })
        .expect(200);

      expect(body).toEqual(null);
      done();
    });
  });

  describe('/api/quality/inspect_task/update', () => {
    it('should return success', async (done) => {
      let content = {
        userId: 'userId',
        userName: 'userName',
        atCreated: new Date(),
        content: '111修改进度20%',
      };
      let updateTaskInfo = {
        _id: idTask,
        progress: 20,
        content: content,
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_task/update')
        .set('Authorization', tokenUser)
        .send(updateTaskInfo)
        .expect(200);

      expect(body.progress).toEqual(20);
      expect(body.files.length).toEqual(2);
      done();
    });
    it('should return success', async (done) => {
      let content = {
        userId: 'userId',
        userName: 'userName',
        atCreated: new Date(),
        content: '222修改进度40%',
      };
      let updateTaskInfo = {
        _id: idTask,
        progress: 40,
        content: content,
        deleteFiles: deleteFiles,
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_task/update')
        .set('Authorization', tokenUser)
        .send(updateTaskInfo)
        .expect(200);
      expect(body.progress).toEqual(40);
      expect(body.files.length).toEqual(0);
      done();
    });
    it('should return success', async (done) => {
      let content = {
        userId: 'userId',
        userName: 'userName',
        atCreated: new Date(),
        content: '333修改进度80%',
      };
      let updateTaskInfo = {
        _id: idTask,
        progress: 80,
        content: content,
        createFiles: createFiles,
      };
      let { body } = await request(app)
        .post('/api/quality/inspect_task/update')
        .set('Authorization', tokenUser)
        .send(updateTaskInfo)
        .expect(200);
      expect(body.progress).toEqual(80);
      expect(body.files.length).toEqual(2);
      done();
    });
  });

  describe('/api/quality/inspect_task/delete', () => {
    it('should success', async (done) => {
      try {
        let { body } = await request(app)
          .delete('/api/quality/inspect_task/delete')
          .set('Authorization', tokenUser)
          .query({ _id: idTask });
        expect(body).toEqual({ msg: 'ID为空' });
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
