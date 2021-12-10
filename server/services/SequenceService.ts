import { Collection, Db, MongoClient } from 'mongodb';
import { CONFIG_MONGO } from '../config';

class MongodbService {
  db!: Db;
  config = CONFIG_MONGO;
  client: MongoClient = null;

  collection<T>(name: string): Collection<T> {
    return this.db.collection<T>(name);
  }

  async connect() {
    const { host, database, port } = this.config;
    const url = `mongodb://${host}:${port}/${database}`;
    this.client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await this.client.connect();
    this.db = this.client.db(database);
    console.log(`mongodb connected at ${url}.`);
  }
}

const mongodbService = new MongodbService();

class SequenceService {
  name = 'sequence';

  get collection() {
    return mongodbService.collection<any>(this.name);
  }

  getDayString() {
    let x = new Date();
    let y = x.getFullYear().toString();
    let m = (x.getMonth() + 1).toString();
    let d = x.getDate().toString();
    if (d.length === 1) {
      d = '0' + d;
    }
    if (m.length === 1) {
      m = '0' + m;
    }
    const yymmdd = `${y}${m}${d}`;
    return yymmdd;
  }

  changeSeqNumber(seq) {
    if (seq < 10) {
      return '000' + seq;
    } else if (seq >= 10 && seq < 100) {
      return '00' + seq;
    } else if (seq >= 100 && seq < 1000) {
      return '0' + seq;
    }
    return seq;
  }

  async getNextSequence(name: string, type?: string) {
    const model = mongodbService.collection<any>(this.name);
    await model.deleteMany({ name: { $ne: name } });
    const result = await model.findOneAndUpdate(
      { type, name },
      { $inc: { seq: 1 }, $setOnInsert: { createTime: new Date() } },
      { upsert: true }
    );
    const d = result.value || { name, seq: 0 };
    let day = this.getDayString();
    let seq = this.changeSeqNumber(d.seq + 1);
    return { ...d, seq: day + seq };
  }
}

const sequenceService = new SequenceService();
export default sequenceService;
