import { Schema, model, Model, Document, Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  DBQualityInspectTaskI,
  UploadFile,
} from '../../../typings/quality_inspect_task';
import mongoose_delete from 'mongoose-delete';

type TaskDocI = Omit<DBQualityInspectTaskI, 'files'> & {
  files: Types.Array<Types.Subdocument & UploadFile>;
} & Document;

type TaskSchemaI = Model<TaskDocI> & {};

const FileSchema = new Schema({
  _id: String,
  contentType: String,
  originalname: String,
});

const DialogueContent = new Schema({
  userId: String,
  userName: String,
  atCreated: Date,
  content: String,
});

const QualityInspectTaskSchema = new Schema<TaskSchemaI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    idRectification: {
      type: String,
      required: true,
    },
    idReport: {
      type: String,
      required: true,
      index: true,
    },
    idSubject: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      default: 'common',
    },
    progress: {
      type: Number,
      default: 0,
    },
    content: {
      type: [DialogueContent],
    },
    status: {
      type: String,
      default: 'todo',
    },
    idCreator: {
      type: String,
      default: '',
    },
    idParticipate: {
      type: Array,
      default: [],
    },
    atCreated: {
      type: Date,
      default: () => new Date(),
    },
    files: [FileSchema],
    deleted: {
      type: Boolean,
      default: false,
    },

    name: {
      type: String,
      required: true,
    },
    idsCC: {
      type: Array,
      default: [],
      index: true,
    },
    idExecutive: {
      type: String,
      required: true,
      index: true,
    },
    endTime: {
      type: Date,
      default: null,
      required: true,
    },
  },
  { versionKey: false, toJSON: { virtuals: true }, id: false }
);

QualityInspectTaskSchema.plugin(mongoose_delete, { overrideMethods: true });

QualityInspectTaskSchema.virtual('account', {
  ref: 'AccountModel',
  localField: 'idCreator',
  foreignField: '_id',
  justOne: true,
});

QualityInspectTaskSchema.virtual('rectification', {
  ref: 'QualityInspectRectificationModel',
  localField: 'idRectification',
  foreignField: '_id',
  justOne: true,
});

export const QualityInspectTaskModel = model<TaskDocI, TaskSchemaI>(
  'QualityInspectTaskModel',
  QualityInspectTaskSchema,
  'quality_inspect_task'
);
