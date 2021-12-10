import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { DBCompanyI } from '../../../typings/company';
import mongoose_delete from 'mongoose-delete';

type CompanyDocI = DBCompanyI & Document;
type CompanySchemaI = Model<CompanyDocI> & {};

const CompanySchema = new Schema<CompanySchemaI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    name: {
      type: String,
      required: true,
      unique: true,
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
    type: {
      type: String,
      default: '',
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

CompanySchema.plugin(mongoose_delete, { overrideMethods: true });

CompanySchema.virtual('dept', {
  ref: 'DepartmentModel', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'idCompany', // is equal to `foreignField`
  justOne: false,
});

CompanySchema.virtual('account', {
  ref: 'AccountModel', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'idCompany', // is equal to `foreignField`
  justOne: false,
});

export const CompanyModel = model<CompanyDocI, CompanySchemaI>(
  'CompanyModel',
  CompanySchema,
  'company'
);
