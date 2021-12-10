import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { DBBindI } from '../../../typings/wx';
import mongoose_delete from 'mongoose-delete';

type BindI = DBBindI & Document;
type BindSchemaI = Model<BindI> & {
  bindAccount: (openid: string, accountid: string) => Promise<boolean>;
};

const BindSchema = new Schema<BindSchemaI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    openid: {
      type: String,
      required: true,
    },
    accountid: {
      type: String,
      required: true,
    },
    create_at: {
      type: Date,
      default: () => new Date(),
    },
  },
  { versionKey: false, toJSON: { virtuals: true }, id: false }
);

/**
 * 绑定用户与openid
 * @param openid
 */
BindSchema.statics.bindAccount = async (openid: string, accountid: string) => {
  const result = await BindModel.findOneAndUpdate(
    { openid },
    { accountid },
    { upsert: true, new: true }
  ).exec();
  return !!result;
};

BindSchema.plugin(mongoose_delete, { overrideMethods: true });

export const BindModel = model<BindI, BindSchemaI>(
  'BindModel',
  BindSchema,
  'wx_bind'
);
