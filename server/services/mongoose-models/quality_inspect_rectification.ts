import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { DBQualityInspectRectificationI } from '../../../typings/quality_inspect_rectification';
import mongoose_delete from 'mongoose-delete';

type RectificationDocI = DBQualityInspectRectificationI & Document;
type SchemaI = Model<RectificationDocI> & {};

const QualityInspectRectificationSchema = new Schema<
  DBQualityInspectRectificationI
>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
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
    idReport: {
      type: String,
      index: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: String,
      default: '',
    },
    atCreated: {
      type: Date,
      default: () => new Date(),
    },
  },
  { versionKey: false, toJSON: { virtuals: true }, id: false }
);

QualityInspectRectificationSchema.plugin(mongoose_delete, {
  overrideMethods: true,
});

QualityInspectRectificationSchema.virtual('executive', {
  ref: 'AccountModel',
  localField: 'idExecutive',
  foreignField: '_id',
  justOne: true,
});

QualityInspectRectificationSchema.virtual('cc', {
  ref: 'AccountModel',
  localField: 'idsCC',
  foreignField: '_id',
});

QualityInspectRectificationSchema.virtual('task', {
  ref: 'QualityInspectTaskIModel',
  localField: '_id',
  foreignField: 'idRectification',
  justOne: true,
});

export const QualityInspectRectificationModel = model<
  RectificationDocI,
  SchemaI
>(
  'QualityInspectRectificationModel',
  QualityInspectRectificationSchema,
  'quality_inspect_rectification'
);
