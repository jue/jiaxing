import redisSvc, { cTokenValidateSuccess } from '../../services/RedisService';

import sinon from 'sinon';
import Redis from 'ioredis';

import { sleep, beforeServerStart } from '../beforeRunTest';

beforeAll(async () => {
  await beforeServerStart();
});

afterAll(() => {
  sinon.restore();
});

beforeEach(() => {
  sinon.restore();
});

describe('RedisService', () => {
  it('has set config', () => {
    expect(redisSvc.config).toEqual({ host: 'localhost', port: 6379 });
    expect(redisSvc.client).toBeInstanceOf(Redis);
  });

  it('init()', async (done) => {
    let key = 'hello';
    let value = 'world';
    await redisSvc.client.set(key, value);
    await redisSvc.client.expire(key, 1);
    await sleep(900);
    let redisValue = await redisSvc.client.get(key);
    expect(redisValue).toEqual(value);
    await sleep(1100);
    redisValue = await redisSvc.client.get(key);
    expect(redisValue).toEqual(null);
    await redisSvc.client.set(key, value, 'EX', 1);
    await sleep(900);
    redisValue = await redisSvc.client.get(key);
    expect(redisValue).toEqual(value);
    await sleep(1100);
    redisValue = await redisSvc.client.get(key);
    expect(redisValue).toEqual(null);
    done();
  });

  it('del()', async (done) => {
    let key = 'hello';
    let deleteResult = await redisSvc.del(key);
    expect(deleteResult).toEqual(0);

    let value = 'world';
    await redisSvc.client.set(key, value);
    await redisSvc.client.expire(key, 1);

    let redisValue = await redisSvc.client.get(key);
    expect(redisValue).toEqual(value);
    deleteResult = await redisSvc.del(key);
    expect(deleteResult).toEqual(1);
    done();
  });

  it('addUserIdSocketId() / getUserIdSocketIds() / removeUserIdSocketId()', async (done) => {
    let userId = 'testUserId';
    let key = redisSvc['keyUserSocket'](userId);
    await redisSvc.client.del(key);

    let socketIds = await redisSvc.getUserIdSocketIds(userId);
    expect(socketIds).toEqual([]);

    await redisSvc.removeUserIdSocketId(userId, 'scoketId-test');
    socketIds = await redisSvc.getUserIdSocketIds(userId);
    expect(socketIds).toEqual([]);

    await redisSvc.addUserIdSocketId(userId, 'scoketId-test-1');
    socketIds = await redisSvc.getUserIdSocketIds(userId);
    expect(socketIds).toEqual(['scoketId-test-1']);

    await redisSvc.addUserIdSocketId(userId, 'scoketId-test-1');
    socketIds = await redisSvc.getUserIdSocketIds(userId);
    expect(socketIds).toEqual(['scoketId-test-1']);

    await redisSvc.addUserIdSocketId(userId, 'scoketId-test-2');
    socketIds = await redisSvc.getUserIdSocketIds(userId);
    expect(socketIds.sort()).toEqual(
      ['scoketId-test-1', 'scoketId-test-2'].sort()
    );

    await redisSvc.removeUserIdSocketId(userId, 'scoketId-test-2');
    socketIds = await redisSvc.getUserIdSocketIds(userId);
    expect(socketIds).toEqual(['scoketId-test-1']);
    done();
  });

  it('getSequenceNumber()', async (done) => {
    let clock = sinon.useFakeTimers({
      now: new Date('2020-04-08 09:10:00'),
    });

    await redisSvc.del('jx-dwg:JH20200408');
    await redisSvc.del('jx-dwg:ZT20200408');

    let seq = await redisSvc.getSequenceNumber('JH');
    expect(seq).toEqual('JH2020040800001');

    seq = await redisSvc.getSequenceNumber('JH');
    expect(seq).toEqual('JH2020040800002');

    seq = await redisSvc.getSequenceNumber('JH');
    expect(seq).toEqual('JH2020040800003');

    seq = await redisSvc.getSequenceNumber('ZT');
    expect(seq).toEqual('ZT2020040800001');
    clock.restore();
    done();
  });

  describe.only('getAccountCache()', () => {
    it('should get account', async (done) => {
      let account = await redisSvc.getAccountCache('5e9ffdb95296434b8cd2bd5c');
      console.log('account', account);
      done();
    });
  });
});
