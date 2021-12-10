import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express, { Express, NextFunction, Request, Response } from 'express';
import compression from 'compression';
import cors from 'cors';
import useApis from './api.routes';

import { swagger } from './swagger/swagger';

import {
  jwtVerifyPagesMiddleware,
  cacheAccountMiddleware,
  proxyToApproval,
  ignoreApprolRequests,
} from './middlewares';

import accountRouter from './api/AccountController';
import wxRouter from './api/WxController';

const server: Express = express();
const server1: Express = express();

server.use(cors());
server.use(cookieParser());
server.use([jwtVerifyPagesMiddleware, cacheAccountMiddleware]);
server.use(['/tylinsh/approval'], proxyToApproval);
server.use(ignoreApprolRequests(bodyParser.urlencoded({ extended: false })));
server.use(ignoreApprolRequests(bodyParser.json({ limit: '50mb' })));
server.use(compression());

useApis(server);

server1.use(ignoreApprolRequests(bodyParser.urlencoded({ extended: false })));
server1.use(ignoreApprolRequests(bodyParser.json({ limit: '50mb' })));

server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('error', err);
  }
  if (res.headersSent) {
    return;
  }
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token');
  } else {
    res.status(500).json({ msg: err.message });
  }
});

server1.use(accountRouter);
server1.use(wxRouter);
swagger(server);

export default server;
export { server1 };
