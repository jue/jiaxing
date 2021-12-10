import mongodbGridfsService from '../../services/MongodbGridfsService';
import { ObjectId } from 'mongodb';

beforeAll(async (done) => {
  await mongodbGridfsService.connect();
  done();
});

describe('MongodbGridfsService', () => {
  it('can get connection url', async () => {
    let url = mongodbGridfsService.getConnectionURL();
    expect(url).toEqual('mongodb://localhost:27017/test-jx-tram');
  });

  describe('getFileInfo', () => {
    it('return null', async (done) => {
      let file = await mongodbGridfsService.getFileInfo(
        new ObjectId().toHexString()
      );
      expect(file).toEqual(undefined);
      done();
    });
  });

  describe('deleteFile', () => {
    it('throws error when id is not valid ObjectId', async (done) => {
      try {
        let result = await mongodbGridfsService.deleteFile('12asdad');
        expect(result).toEqual(undefined);
      } catch (error) {
        expect(error.message).toContain(
          'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'
        );
      }
      done();
    });

    it('throws error when file not exit', async (done) => {
      try {
        let result = await mongodbGridfsService.deleteFile(
          new ObjectId().toHexString()
        );
        expect(result).toEqual(undefined);
      } catch (error) {
        expect(error.message).toContain('FileNotFound: no file with id ');
      }
      done();
    });
  });
});
