import { Schema, model, Model, Document, Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  DBQualityInspectPlanI,
  UploadFile,
} from '../../../typings/quality_inspect_plan';
import mongoose_delete from 'mongoose-delete';

type PlanDocI = Omit<DBQualityInspectPlanI, 'files'> & {
  files: Types.Array<Types.Subdocument & UploadFile>;
} & Document;

type PlanSchemaI = Model<PlanDocI> & {};

const FileSchema = new Schema({
  _id: String,
  contentType: String,
  originalname: String,
});

const QualityInspectPlanSchema = new Schema<PlanSchemaI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    name: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      index: true,
    },
    desc: {
      type: String,
      default: '',
    },
    startTime: {
      type: Date,
      required: true,
      default: null,
    },
    endTime: {
      type: Date,
      required: true,
      default: null,
    },
    schedule: {
      type: Number,
      default: 0,
    },
    state: {
      type: String,
      default: 'notstart',
    },
    files: [FileSchema],
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

QualityInspectPlanSchema.plugin(mongoose_delete, { overrideMethods: true });

QualityInspectPlanSchema.virtual('subjects', {
  ref: 'QualityInspectSubjectModel', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'idPlan', // is equal to `foreignField`
  justOne: false,
});

export const QualityInspectPlanModel = model<PlanDocI, PlanSchemaI>(
  'QualityInspectPlanModel',
  QualityInspectPlanSchema,
  'quality_inspect_plan'
);
