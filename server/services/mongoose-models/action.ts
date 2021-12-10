import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

import { DBActionI } from '../../../typings/action';

type DocI = DBActionI & Document;
type SchemaI = Model<DocI> & {};

const ActionSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    type: {
      type: String,
      required: true,
    },
    idEntity: {
      type: String,
      index: true,
    },
    idCreatedBy: {
      type: String,
      index: true,
      unique: false,
    },
    atCreated: {
      type: Date,
      default: () => new Date(),
    },
    data: {
      type: Object,
    },
  },
  { versionKey: false }
);

export const ActionModel = model<DocI, SchemaI>(
  'ActionModel',
  ActionSchema,
  'action'
);
