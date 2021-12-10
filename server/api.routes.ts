import { Application } from 'express';
import fs from 'fs';
import path from 'path';

export default function useApis(server: Application) {
  let apiPath = path.resolve(__dirname, './controllers');
  let files = fs.readdirSync(apiPath);

  files.forEach((file) => {
    let isController = file.toLowerCase().includes('controller');
    if (!isController) {
      return;
    }
    try {
      let filePath = path.resolve(apiPath, file.replace(/\.(t|j)s$/, ''));
      let router = require(filePath).default;
      server.use(router);
    } catch (error) {
      console.log(error);
    }
  });
}
