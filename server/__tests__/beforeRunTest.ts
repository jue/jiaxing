import redisService from '../services/RedisService';
import mongoose from 'mongoose';
import { CONFIG_MONGO } from '../config';
import { insertAccountData } from './data/account';
import beforeServer from '../beforeServerStart';
import mongodbGridfsService from '../services/MongodbGridfsService';
import { insertDepartment } from './data/department';
import { insertJob } from './data/job';
import { insertCompany } from './data/company';

export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function beforeServerStart() {
  await beforeServer();
  await cleanDB();
  await insertCompany();
  await insertDepartment();
  await insertJob();
  await insertAccountData();
}

export async function cleanDB() {
  await mongodbGridfsService.db.dropDatabase();
}

export const matchObjectId = /^[0-9a-f]{24}/;

export async function insetDesignDocumentTemplateData() {}
