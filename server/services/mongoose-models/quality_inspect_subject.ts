import { Schema, model, Model, Document, Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  DBQualityInspectSubjectI,
  UploadFile,
} from '../../../typings/quality_inspect_subject';
import mongoose_delete from 'mongoose-delete';

type SubjectDocI = Omit<DBQualityInspectSubjectI, 'files'> & {
  files: Types.Array<Types.Subdocument & UploadFile>;
} & Document;

type SubjectSchemaI = Model<SubjectDocI> & {};

const FileSchema = new Schema({
  _id: String,
  contentType: String,
  originalname: String,
});

const QualityInspectSubjectSchema = new Schema<SubjectSchemaI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    name: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      default: '',
    },
    frequency: {
      type: String,
      default: '',
    },
    count: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: '',
    },
    allocateObjects: {
      type: String,
      default: '',
    },
    startTime: {
      type: Date,
      default: null,
    },
    endTime: {
      type: Date,
      default: null,
    },
    distributionState: {
      type: String,
      default: 'false',
    },
    progress: {
      type: Number,
      default: 0,
    },
    atCreated: {
      type: Date,
      default: () => new Date(),
    },
    files: [FileSchema],
    idPlan: {
      type: String,
      index: true,
      required: true,
    },
    pos: {
      type: Number,
      default: 0,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, toJSON: { virtuals: true }, id: false }
);

QualityInspectSubjectSchema.plugin(mongoose_delete, { overrideMethods: true });

export const QualityInspectSubjectModel = model<SubjectDocI, SubjectSchemaI>(
  'QualityInspectSubjectModel',
  QualityInspectSubjectSchema,
  'quality_inspect_subject'
);
