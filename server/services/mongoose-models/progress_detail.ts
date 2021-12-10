import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { DBProgressDetailI } from '../../../typings/progress_detail';
import mongoose_delete from 'mongoose-delete';

type ProgressDetailDocI = DBProgressDetailI & Document;
type ProgressDetailSchemaI = Model<ProgressDetailDocI> & {};

const ProgressDetailSchema = new Schema<ProgressDetailSchemaI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    name: {
      type: String,
      required: true,
    },
    auditingId: {
      type: String,
      required: true,
    },
    progressId: {
      type: Array,
      default: [],
    },
    data: {
      type: Object,
      required: false,
    },
    links: {
      type: Array,
      required: false,
    },
    actionType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: '1',
    },
    atCreated: {
      type: Date,
      default: () => new Date(),
    },
    idCreatedBy: {
      type: String,
      default: '',
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, toJSON: { virtuals: true }, id: false }
);

ProgressDetailSchema.plugin(mongoose_delete, { overrideMethods: true });

ProgressDetailSchema.virtual('account', {
  ref: 'AccountModel', // The model to use
  localField: 'idCreatedBy', // Find people where `localField`
  foreignField: '_id', // is equal to `foreignField`
  justOne: true,
});

ProgressDetailSchema.virtual('resourcAccount', {
  ref: 'AccountModel', // The model to use
  localField: 'data.resource', // Find people where `localField`
  foreignField: '_id', // is equal to `foreignField`
  justOne: false,
});

export const ProgressDetailModel = model<
  ProgressDetailDocI,
  ProgressDetailSchemaI
>('ProgressDetailModel', ProgressDetailSchema, 'progressDetail');
