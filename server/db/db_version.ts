import { Schema, model, Document, Model } from 'mongoose';
import { ObjectId } from 'mongodb';

interface DBVersionI {
  _id: string;
  version: number;
  atCreated: Date;
  atUpdated: Date;
}

type DBVersionDocI = DBVersionI & Document;

const dbVersionSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    version: {
      type: Number,
      default: 0,
    },

    atCreated: {
      type: Date,
      default: () => new Date(),
    },

    atUpdated: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    versionKey: false,
  }
);

export const DbVersionModel = model<DBVersionDocI>(
  'DbVersion',
  dbVersionSchema,
  'db_version'
);
