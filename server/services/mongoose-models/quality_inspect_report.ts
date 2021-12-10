import { Schema, model, Model, Document, Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  DBQualityInspectReportI,
  UploadFile,
} from '../../../typings/quality_inspect_report';
import mongoose_delete from 'mongoose-delete';

type ReportDocI = DBQualityInspectReportI & {
  files: Types.Array<Types.Subdocument & UploadFile>;
} & Document;

type ReportSchemaI = Model<ReportDocI> & {};

const FileSchema = new Schema({
  _id: String,
  contentType: String,
  originalname: String,
});

const QualityInspectReportSchema = new Schema<ReportSchemaI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    idSubject: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      index: true,
    },
    way: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    frequency: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    result: {
      type: String,
      default: '',
    },
    creator: {
      type: String,
      default: '',
    },
    atCreated: {
      type: Date,
      default: () => new Date(),
    },
    files: [FileSchema],
    state: {
      type: String,
      default: '',
    },
    acceptResult: {
      type: String,
      default: '',
    },
    acceptOpinion: {
      type: String,
      default: '',
    },
    acceptEvaluation: {
      type: String,
      default: '0',
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, toJSON: { virtuals: true }, id: false }
);

QualityInspectReportSchema.plugin(mongoose_delete, { overrideMethods: true });

QualityInspectReportSchema.virtual('account', {
  ref: 'AccountModel',
  localField: 'creator',
  foreignField: '_id',
  justOne: false,
});

QualityInspectReportSchema.virtual('checkItems', {
  ref: 'QualityInspectCheckItemModel',
  localField: '_id',
  foreignField: 'idReport',
  justOne: false,
});

QualityInspectReportSchema.virtual('rectification', {
  ref: 'QualityInspectRectificationModel',
  localField: '_id',
  foreignField: 'idReport',
  justOne: true,
});

QualityInspectReportSchema.virtual('task', {
  ref: 'QualityInspectTaskModel',
  localField: '_id',
  foreignField: 'idReport',
  justOne: true,
});

export const QualityInspectReportModel = model<ReportDocI, ReportSchemaI>(
  'QualityInspectReportModel',
  QualityInspectReportSchema,
  'quality_inspect_report'
);
