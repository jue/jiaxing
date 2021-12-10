import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { DBConstructionSchemeI } from '../../../typings/construction_scheme';
import mongoose_delete from 'mongoose-delete';

type SchemeDocI = DBConstructionSchemeI & Document;
type SchemeSchemaI = Model<SchemeDocI> & {};

const ConstructionSchema = new Schema<SchemeSchemaI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },

    modelFile: {
      type: Array,
      default: [],
    },
    nodeFiles: {
      type: Array,
      default: [],
    },

    status: {
      type: String,
      default: '1',
    },
    idAuditing: {
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
  { versionKey: false, toJSON: { virtuals: true }, id: false }
);

ConstructionSchema.plugin(mongoose_delete, {
  overrideMethods: true,
});

ConstructionSchema.virtual('account', {
  ref: 'AccountModel', // The model to use
  localField: 'idCreatedBy', // Find people where `localField`
  foreignField: '_id', // is equal to `foreignField`
  justOne: true,
});

export const ConstructionSchemeModel = model<SchemeDocI, SchemeSchemaI>(
  'ConstructionSchemeModel',
  ConstructionSchema,
  'construction_schema'
);
