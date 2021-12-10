import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { DBTokenI } from '../../../typings/wx';
import mongoose_delete from 'mongoose-delete';

type TokenI = DBTokenI & Document;
type TokenSchemaI = Model<TokenI> & {
  getToken: (
    openid: string
  ) => Promise<{
    openid: string;
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
  }>;
  setToken: (openid: string, token: any) => Promise<boolean>;
};

const TokenSchema = new Schema<TokenSchemaI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    access_token: {
      type: String,
    },
    expires_in: {
      type: Number,
    },
    refresh_token: {
      type: String,
    },
    openid: {
      type: String,
    },
    scope: {
      type: String,
    },
  },
  { versionKey: false }
);

/**
 *
 * @param openid
 */
TokenSchema.statics.getToken = async (openid: string) => {
  const {
    access_token,
    expires_in,
    refresh_token,
    scope,
  } = await TokenModel.findOne({
    openid,
  }).exec();
  return { openid, access_token, expires_in, refresh_token, scope };
};

/**
 * 写入token
 * @param openid
 * @param token
 */

TokenSchema.statics.setToken = async (openid: string, token: any) => {
  const result = await TokenModel.findOneAndUpdate({ openid }, token, {
    upsert: true,
    new: true,
  }).exec();
  return !!result;
};

TokenSchema.plugin(mongoose_delete, { overrideMethods: true });

export const TokenModel = model<TokenI, TokenSchemaI>(
  'TokenModel',
  TokenSchema,
  'wx_token'
);
