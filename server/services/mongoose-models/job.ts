import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { DBJobI } from '../../../typings/job';
import mongoose_delete from 'mongoose-delete';

type JobDocI = DBJobI & Document;
type JobSchemaI = Model<JobDocI> & {};

const JobSchema = new Schema<JobSchemaI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    name: {
      type: String,
      required: true,
    },
    parentId: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      default: '',
      index: true,
    },
    idCompany: {
      type: String,
      default: '',
      index: true,
    },
    idDepartment: {
      type: String,
      default: '',
      index: true,
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

JobSchema.plugin(mongoose_delete, { overrideMethods: true });

JobSchema.virtual('account', {
  ref: 'AccountModel', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'idJob', // is equal to `foreignField`
  justOne: false,
});

JobSchema.virtual('dept', {
  ref: 'DepartmentModel', // The model to use
  localField: 'idDepartment', // Find people where `localField`
  foreignField: '_id', // is equal to `foreignField`
  justOne: true,
});

export const JobModel = model<JobDocI, JobSchemaI>(
  'JobModel',
  JobSchema,
  'job'
);
