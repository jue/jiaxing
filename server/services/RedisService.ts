import Redis from 'ioredis';
import dayjs from 'dayjs';
import { CONFIG_REDIS, NAMESPACE, ONE_HOUR_IN_SECONDS } from '../config';

// import socketService from './SocketService';
import { SocketEventsI } from '../../typings/notification';
import { AccountModel } from './mongoose-models/account';

interface ConfigI {
  host: string;
  port: number;
}

export const cTokenValidateSuccess = 'token.validate.success';

let oneHourInSeconds = 3600;
let onewDayInSechonds = 24 * oneHourInSeconds;

class RedisService {
  client: Redis.Redis = null;
  pubClient: Redis.Redis = null;
  subClient: Redis.Redis = null;
  config: ConfigI = null;
  namespace = NAMESPACE || 'jx-dwg';

  constructor(config: ConfigI) {
    this.config = config;
    this.client = new Redis(config);
    this.pubClient = new Redis(config);
    this.subClient = new Redis(config);
  }

  connect() {
    this.subClient.subscribe(cTokenValidateSuccess);
    this.subClient.on('message', this.onPubMessage);
  }

  onPubMessage = (channel: string, message: string) => {
    if (channel === cTokenValidateSuccess) {
      try {
        const msgBody = JSON.parse(message);
        // const socket = socketService.getConnection(msgBody.socketId);
        // if (socket) {
        //   socket.emit(cTokenValidateSuccess, msgBody.content);
        // }
      } catch (error) {}
    }
  };

  async pubUserMessageBySocket<T>(
    userId: string,
    event: SocketEventsI,
    message: T
  ) {
    let socketIds: string[] = await this.getUserIdSocketIds(userId);
    socketIds.forEach((socketId) => {
      // let socket = socketService.getConnection(socketId);
      // if (socket) {
      //   socket.emit(event, message);
      // }
    });
  }

  async del(key: string) {
    return await this.client.del(key);
  }

  pubTokenValidateSuccess(socketId: string, msg: string) {
    return this.pubClient.publish(
      cTokenValidateSuccess,
      JSON.stringify({ socketId, content: msg })
    );
  }

  private keyUserSocket(userId: string) {
    return `${this.namespace}:socket-connect:${userId || 'default'}`;
  }

  async addUserIdSocketId(userId: string, socketId: string) {
    let key = this.keyUserSocket(userId);
    try {
      await this.client.sadd(key, socketId);
      await this.client.expire(key, oneHourInSeconds);
    } catch (error) {}
  }

  async getUserIdSocketIds(userId: string) {
    let key = this.keyUserSocket(userId);
    try {
      return await this.client.smembers(key);
    } catch (error) {
      return [];
    }
  }

  async removeUserIdSocketId(userId: string, socketId: string) {
    let key = this.keyUserSocket(userId);
    try {
      await this.client.srem(key, socketId);
    } catch (error) {}
  }

  changeSeqNumber(seq: number, bit: number = 5) {
    if (bit === 2) {
      if (seq < 10) {
        return '0' + seq;
      } else {
        return seq;
      }
    }

    if (seq < 10) {
      return '0000' + seq;
    } else if (seq >= 10 && seq < 100) {
      return '000' + seq;
    } else if (seq >= 100 && seq < 1000) {
      return '00' + seq;
    } else {
      return '0' + seq;
    }
  }

  changeSeqNumber1(seq: number, bit: number = 5) {
    if (bit === 2) {
      if (seq < 10) {
        return '0' + seq;
      } else {
        return seq;
      }
    }

    if (seq < 10) {
      return '00' + seq;
    } else {
      return seq;
    }
  }

  async getSequenceNumber(seqPrefix: string) {
    let today = dayjs().format('YYYYMMDD');
    let key = `${this.namespace}:${seqPrefix}${today}`;

    let valueInRedis = await this.client.get(key);
    let num = (valueInRedis || 0) as number;
    num = await this.client.incr(key);
    await this.client.expire(key, onewDayInSechonds);

    return `${seqPrefix}${today}${this.changeSeqNumber(num)}`;
  }

  async getSequenceNumber1(seqPrefix: string) {
    let today = dayjs().format('YYMMDD');
    let key = `${this.namespace}:${seqPrefix}${today}`;

    let valueInRedis = await this.client.get(key);
    let num = (valueInRedis || 0) as number;
    num = await this.client.incr(key);
    await this.client.expire(key, onewDayInSechonds);

    return `${seqPrefix}${today}${this.changeSeqNumber1(num)}`;
  }

  async getAccountCache(accountId: string) {
    let key = `${this.namespace}:account:${accountId}`;
    let cacheAccount = await this.client.get(key);

    if (cacheAccount) {
      await this.client.expire(key, ONE_HOUR_IN_SECONDS * 24);
      return JSON.parse(cacheAccount);
    }
    let accountJSON = await this.setAccountCache(accountId);
    return accountJSON;
  }

  async setAccountCache(accountId: string) {
    let key = `${this.namespace}:account:${accountId}`;
    let account = await AccountModel.findOne({ _id: accountId })
      .populate('company', ['name', 'type'])
      .populate('dept', ['name'])
      .populate('job', ['name'])
      .select('userName nickName idsAuth idCompany idDepartment idJob');
    let accountJSON = account.toJSON();
    await this.client.set(key, JSON.stringify(accountJSON));
    await this.client.expire(key, ONE_HOUR_IN_SECONDS * 24);
    return accountJSON;
  }

  async setContractHistory(hisInfo: string, userId: string) {
    let key = `${this.namespace}:contractHistory:${userId}`;
    await this.client.set(key, JSON.stringify(hisInfo));
    return hisInfo;
  }

  async getContractHistoryByUserId(userId: string) {
    let key = `${this.namespace}:contractHistory:${userId}`;
    let data = await this.client.get(key);
    return JSON.parse(data);
  }

  async getPreviewData(key: string) {
    const data = await this.client.get(key);

    if (data) {
      return JSON.parse(data);
    }
  }
  async setPreviewData(key: string, data: object) {
    await this.client.set(key, JSON.stringify(data));
  }
}

const redisService = new RedisService({
  host: CONFIG_REDIS.host,
  port: CONFIG_REDIS.port,
});

export default redisService;
