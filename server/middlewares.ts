import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import _ from 'lodash';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { CONFIG_JWT, APPROVAL_SERVER_URL } from './config';
import jwt from 'express-jwt';
import { JwtUserI } from '../typings/account';
import redisService from './services/RedisService';

declare global {
  namespace Express {
    export interface Request {
      user?: JwtUserI;
    }
  }
}

function getToken(req: Request) {
  let authorization = '';
  if (req.cookies.token) {
    authorization = req.cookies.token;
  } else if (req.headers.authorization) {
    authorization = req.headers.authorization;
  }

  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  }
  return null;
}

function calcShouldIgnorePath(reqUrl: string) {
  if (!CONFIG_JWT.enabled) {
    return true;
  }
  const jwtConfigUnlessPath = Array.isArray(CONFIG_JWT.unlessPath)
    ? CONFIG_JWT.unlessPath
    : [];

  const shouldIgnorePath: boolean = jwtConfigUnlessPath.some((url) =>
    reqUrl.startsWith(url)
  );

  return shouldIgnorePath;
}

export async function jwtVerifyPagesMiddleware(
  req: Request,
  res: Response,
  expressNextFunc: NextFunction
) {
  let reqUrl = req.url;
  let shouldIgnorePath = calcShouldIgnorePath(reqUrl);

  if (shouldIgnorePath) {
    expressNextFunc();
    return;
  }

  try {
    const jwtToken = getToken(req);
    let user = jsonwebtoken.verify(jwtToken, CONFIG_JWT.secret) as JwtUserI;

    req.user = user;

    expressNextFunc();
    return;
  } catch (error) {
    console.log(error);
    let redirect_to = `redirect_to=${encodeURIComponent(req.url)}`;
    let redirectUrl = `/login?${redirect_to}`;
    res.redirect(redirectUrl);
    return;
  }
}

export const jwtTokenVerifyMiddleware = jwt({
  secret: CONFIG_JWT.secret,
  getToken,
});

export async function cacheAccountMiddleware(
  req: Request,
  res: Response,
  expressNextFunc: NextFunction
) {
  const reqUrl = req.url;
  try {
    let shouldIgnorePath = calcShouldIgnorePath(reqUrl);
    if (shouldIgnorePath) {
      expressNextFunc();
      return;
    }
    const user = req.user;
    let accountId = user._id;
    let account = await redisService.getAccountCache(accountId);
    req.user = { ...user, ...account };
    expressNextFunc();
  } catch (error) {
    expressNextFunc(error);
  }
}

export function ignoreApprolRequests(middleware: any) {
  return async function (
    req: Request,
    res: Response,
    expressNextFunc: NextFunction
  ) {
    const reqUrl = req.url;
    if (
      _.startsWith(reqUrl, '/tylinsh/approval') ||
      _.startsWith(reqUrl, '/api/progress/mpp')
    ) {
      return expressNextFunc();
    }

    return middleware(req, res, expressNextFunc);
  };
}

export const proxyToApproval = createProxyMiddleware({
  target: APPROVAL_SERVER_URL,
  pathRewrite: { '^/tylinsh/approval': '' },
  changeOrigin: true,
  onProxyReq: (proxyReq, req) => {
    console.log(
      `middleware [proxyToApproval]req.user:${JSON.stringify(req.user)}`
    );

    proxyReq.setHeader('operatorId', req.user._id);
  },
});
