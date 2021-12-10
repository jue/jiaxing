import { Schema, model, Model, Document, Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  DBQualityInspectCheckItemI,
  UploadFile,
} from '../../../typings/quality_inspect_checkItem';
import mongoose_delete from 'mongoose-delete';

type CheckItemDocI = Omit<DBQualityInspectCheckItemI, 'files'> & {
  files: Types.Array<Types.Subdocument & UploadFile>;
} & Document;

type CheckItemSchemaI = Model<CheckItemDocI> & {};

const FileSchema = new Schema({
  _id: String,
  contentType: String,
  originalname: String,
});

const QualityInspectCheckItemSchema = new Schema<CheckItemDocI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    name: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    remark: {
      type: String,
      default: '',
    },
    atCreated: {
      type: Date,
      default: () => new Date(),
    },
    files: [FileSchema],
    idReport: {
      type: String,
      index: true,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, toJSON: { virtuals: true }, id: false }
);

QualityInspectCheckItemSchema.plugin(mongoose_delete, {
  overrideMethods: true,
});

export const QualityInspectCheckItemModel = model<
  CheckItemDocI,
  CheckItemSchemaI
>(
  'QualityInspectCheckItemModel',
  QualityInspectCheckItemSchema,
  'quality_inspect_checkItem'
);
