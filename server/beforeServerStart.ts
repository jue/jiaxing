import mongoose from 'mongoose';

import { CONFIG_MONGO, dev } from './config';
// import redisService from './services/RedisService';

import updateMongoDB from './db/updateMongoDB';
import mongodbGridfsService from './services/MongodbGridfsService';

export default async function beforeServerStart() {
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  await mongoose.connect(
    `mongodb://${CONFIG_MONGO.host}:${CONFIG_MONGO.port}/${CONFIG_MONGO.database}`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  );

  mongoose.set('debug', !!dev);
  await mongodbGridfsService.connect();
  // redisService.connect();

  await updateMongoDB();
}
