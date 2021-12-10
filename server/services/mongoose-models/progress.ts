import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { DBProgressI } from '../../../typings/progress';
import mongoose_delete from 'mongoose-delete';

type ProgressDocI = DBProgressI & Document;
type ProgressSchemaI = Model<ProgressDocI> & {};

const CustomData = new Schema(
  {
    priority: {
      type: String,
      default: '1',
    },
    BIMcoding: {
      type: String,
      default: '',
    },
    jlPrincipal: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const ProgressSchema = new Schema<ProgressSchemaI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    text: {
      type: String,
      required: false,
    },
    start_date: {
      type: Date,
      required: false,
    },
    end_date: {
      type: Date,
      default: null,
    },
    actual_start_date: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number,
      required: false,
    },
    progress: {
      type: Number,
      default: 0,
    },
    open: {
      type: Boolean,
      default: true,
    },
    parent: {
      type: String,
      required: false,
    },
    custom_data: {
      type: CustomData,
      required: false,
    },
    resource: {
      type: Array,
      required: false,
    },

    delay: {
      type: String,
      default: 'notstart',
    },

      // 延期天数
      delayDays:{
        type: Number,
      },
      
    importantNode: {
      type: Boolean,
      default: false,
    },
    taskTags: {
      type: String,
      default: '',
    },
    projectId: {
      type: String,
      required: false,
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
    detail: {
      type: String,
      ref: 'ProgressDetailModel',
      require: false,
    },
  },
  { versionKey: false, toJSON: { virtuals: true }, id: false }
);

// ProgressSchema.plugin(mongoose_delete, { overrideMethods: true });

ProgressSchema.virtual('account', {
  ref: 'AccountModel', // The model to use
  localField: 'idCreatedBy', // Find people where `localField`
  foreignField: '_id', // is equal to `foreignField`
  justOne: true,
});

ProgressSchema.virtual('resourcAccount', {
  ref: 'AccountModel', // The model to use
  localField: 'resource', // Find people where `localField`
  foreignField: '_id', // is equal to `foreignField`
  justOne: false,
});

export const ProgressModel = model<ProgressDocI, ProgressSchemaI>(
  'ProgressModel',
  ProgressSchema,
  'progress'
);
