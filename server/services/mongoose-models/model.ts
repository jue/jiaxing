import { Schema, model, Model, Document, Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import { DBModelI, UploadFile } from '../../../typings/model';
import mongoose_delete from 'mongoose-delete';

type ModelDocI = Omit<DBModelI, 'files'> & {
  files: Types.Subdocument & UploadFile;
} & Document;

type ModelSchemaI = Model<ModelDocI> & {};

const FileSchema = new Schema({
  _id: String,
  contentType: String,
  originalname: String,
  status: String,
  idFile: String,
});
const ModelSchema = new Schema<ModelSchemaI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    idEngineering: {
      type: String,
      required: true,
    },
    idContract: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'model',
    },
    size: {
      type: Number,
      required: true,
    },
    files: FileSchema,
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

ModelSchema.plugin(mongoose_delete, { overrideMethods: true });

ModelSchema.virtual('engineering', {
  ref: 'EngineeringModel', // The model to use
  localField: 'idEngineering', // Find people where `localField`
  foreignField: '_id', // is equal to `foreignField`
  justOne: true,
});
ModelSchema.virtual('contract', {
  ref: 'ContractModel', // The model to use
  localField: 'idContract', // Find people where `localField`
  foreignField: '_id', // is equal to `foreignField`
  justOne: true,
});
ModelSchema.virtual('account', {
  ref: 'AccountModel', // The model to use
  localField: 'idCreatedBy', // Find people where `localField`
  foreignField: '_id', // is equal to `foreignField`
  justOne: true,
});
export const ModelModel = model<ModelDocI, ModelSchemaI>(
  'ModelModel',
  ModelSchema,
  'model'
);
