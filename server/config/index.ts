export const {
  NODE_ENV,
  PORT,
  INTERNAL_PORT,
  NAMESPACE,
  WORD_TO_PDF_URI,
  FORGE_MODEL_SERVER_URI,
  FORGE_MODEL_EXTENAL_SERVER_URI,
  RLG_CLIENT_ID,
  RLG_CLIENT_SECRET,
  AUDITING_SERVER_URI,
  JX_DATABASE,
  WX_BIND_DN,
  WX_APPID,
  WX_APPSECRET,
} = process.env;

export const dev = NODE_ENV !== 'production';

export const ONE_HOUR_IN_SECONDS = 3600;
export const ONE_HOUR_IN_MS = 3.6e6;
export const ONE_MONTH_IN_MS = 30 * 24 * ONE_HOUR_IN_MS;

// console.log('NODE_ENV',NODE_ENV)

export const CONFIG_MONGO = {
  host: dev ? '127.0.0.1' : 'mongodb',
  database: dev ? 'test-jx-tram' : JX_DATABASE,
  port: dev ? '27099' : '27017',
};

export const APPROVAL_SERVER_URL =
  NODE_ENV !== 'production' ? 'http://127.0.0.1:7001/t' : AUDITING_SERVER_URI;

export const CONFIG_REDIS = {
  host: dev ? 'localhost' : 'redis',
  port: 6379,
};

export const CONFIG_JWT = {
  secret: 'jx-tram',
  enabled: true,
  unlessPath: [
    '/_next',
    '/static',
    '/login',
    '/wx/bind',
    '/api/account/login',
    '/wx/checkBindAccount',
    '/api/wx/bindAccount',
  ],
};

export const CONFIG_FORGE = {
  clientId: dev ? 'S1qt8ExazBke9YINxaz' : RLG_CLIENT_ID,
  clientSecret: dev ? 'rkb9tU4l6MSkGqt8Ee6f' : RLG_CLIENT_SECRET,
};

export const CONFIG_WX = {
  url: 'http://wx.x.com', //域名url
  appid: dev ? 'wxbc9101e3881fef78' : WX_APPID,
  appsecret: dev ? '55b485f0cb77c5c5dca92a2c22b081fc' : WX_APPSECRET,
  access_token: '1234',
  nonce_str: 'ASDFASDF242134', // 密钥，字符串任意，可以随机生成
  bind_url: `${dev ? 'http://qncr45.natappfree.cc' : WX_BIND_DN}/wx/bind`,
  bind_check_url: `${
    dev ? 'http://qncr45.natappfree.cc' : WX_BIND_DN
    }/wx/checkBindAccount`,
};
