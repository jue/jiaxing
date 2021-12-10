import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { DBDepartmentI } from '../../../typings/department';
import mongoose_delete from 'mongoose-delete';

type DepartmentDocI = DBDepartmentI & Document;
type DepartmentSchemaI = Model<DepartmentDocI> & {};

const DepartmentSchema = new Schema<DepartmentSchemaI>(
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

DepartmentSchema.plugin(mongoose_delete, { overrideMethods: true });

DepartmentSchema.virtual('job', {
  ref: 'JobModel', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'idDepartment', // is equal to `foreignField`
  justOne: false,
});

DepartmentSchema.virtual('account', {
  ref: 'AccountModel', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'idDepartment', // is equal to `foreignField`
  justOne: false,
});

export const DepartmentModel = model<DepartmentDocI, DepartmentSchemaI>(
  'DepartmentModel',
  DepartmentSchema,
  'department'
);
