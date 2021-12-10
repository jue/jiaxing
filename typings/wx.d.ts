export interface DBTokenI {
  _id: string; // id
  access_token: String;
  expires_in: Number;
  refresh_token: String;
  openid: String;
  scope: String;
}

export interface DBBindI {
  _id: string; // id
  openid: string;
  accountid: string;
}
