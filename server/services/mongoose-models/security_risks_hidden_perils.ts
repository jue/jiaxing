import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { DBSecurityRisksHiddenPerilsI } from '../../../typings/security_risks_hidden_perils';
import mongoose_delete from 'mongoose-delete';

type PerilsDocI = DBSecurityRisksHiddenPerilsI & Document;
type PerilsSchemaI = Model<PerilsDocI> & {};

const SecurityRisksHiddenPerilsSchema = new Schema<PerilsSchemaI>(
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
    type: {
      type: String,
      required: true,
    },
    perilsTime: {
      type: Date,
      required: true,
    },
    partCompanys: {
      type: Array,
      default: [],
    },
    perilsResults: {
      type: String,
      required: true,
    },
    executor: {
      type: String,
      required: true,
    },
    endTime: {
      type: Date,
      default: null,
    },

    modelFile: {
      type: Array,
      default: [],
    },
    nodeFiles: {
      type: Array,
      default: [],
    },

    delayDays:{ // 延期天数 
      type: Number,
    },

    status: {
      type: String,
      default: '1',
    },
    idAuditing: {
      type: String,
      default: '',
    },
    idCreatedBy: {
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

SecurityRisksHiddenPerilsSchema.plugin(mongoose_delete, {
  overrideMethods: true,
});

SecurityRisksHiddenPerilsSchema.virtual('problemItem', {
  ref: 'SecurityRisksProblemItemModel',
  localField: '_id',
  foreignField: 'idPerils',
  justOne: false,
});

SecurityRisksHiddenPerilsSchema.virtual('account', {
  ref: 'AccountModel', // The model to use
  localField: 'idCreatedBy', // Find people where `localField`
  foreignField: '_id', // is equal to `foreignField`
  justOne: true,
});

SecurityRisksHiddenPerilsSchema.virtual('accountExecutor', {
  ref: 'AccountModel', // The model to use
  localField: 'executor', // Find people where `localField`
  foreignField: '_id', // is equal to `foreignField`
  justOne: true,
});

export const SecurityRisksHiddenPerilsModel = model<PerilsDocI, PerilsSchemaI>(
  'SecurityRisksHiddenPerilsModel',
  SecurityRisksHiddenPerilsSchema,
  'security_risks_hidden_perils'
);
