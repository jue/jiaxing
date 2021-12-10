import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import mongoose_delete from 'mongoose-delete';
import { DBEngineeringI } from '../../../typings/engineering';

type DocI = DBEngineeringI & Document;

type SchemaI = Model<DocI> & {
  getAmount: (
    idEngineering: string
  ) => Promise<{
    changedAmount: number;
    changingAmount: number;
  }>;
};

const EngineeringSchema = new Schema<SchemaI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    name: {
      type: String,
      required: true,
    },
    changeableAmount: {
      type: Number,
      default: 0,
    },
    changedAmount: {
      type: Number,
      default: 0,
    },
    changingAmount: {
      type: Number,
      default: 0,
    },
    changedCount: {
      type: Number,
      default: 0,
    },
    changingCount: {
      type: Number,
      default: 0,
    },
    head: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    constructionUnit: {
      type: String,
      default: '',
    },
    idCreatedBy: {
      type: String,
      default: '',
    },
    atCreated: {
      type: Date,
      default: () => new Date(),
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false,
  }
);

EngineeringSchema.plugin(mongoose_delete, {
  overrideMethods: true,
});

export const EngineeringModel = model<DocI, SchemaI>(
  'EngineeringModel',
  EngineeringSchema,
  'engineering'
);
