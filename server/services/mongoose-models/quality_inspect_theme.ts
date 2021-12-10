import { Schema, model, Model, Document, Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import { DBSecurityRisksHiddenPerilsI } from '../../../typings/security_risks_hidden_perils';
import mongoose_delete from 'mongoose-delete';

type PerilsDocI = DBSecurityRisksHiddenPerilsI & Document;
type PerilsSchemaI = Model<PerilsDocI> & {};

const QualityInspectThemeSchema = new Schema<PerilsSchemaI>(
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
      required: true,
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
    idCreatedBy: {
      type: String,
      default: '',
    },
    idAuditing: {
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

QualityInspectThemeSchema.plugin(mongoose_delete, {
  overrideMethods: true,
});

QualityInspectThemeSchema.virtual('problemItem', {
  ref: 'QualityInspectItemModel',
  localField: '_id',
  foreignField: 'idPerils',
  justOne: false,
});

QualityInspectThemeSchema.virtual('account', {
  ref: 'AccountModel', // The model to use
  localField: 'idCreatedBy', // Find people where `localField`
  foreignField: '_id', // is equal to `foreignField`
  justOne: true,
});
QualityInspectThemeSchema.virtual('accountExecutor', {
  ref: 'AccountModel', // The model to use
  localField: 'executor', // Find people where `localField`
  foreignField: '_id', // is equal to `foreignField`
  justOne: true,
});

export const QualityInspectThemeModel = model<PerilsDocI, PerilsSchemaI>(
  'QualityInspectThemeModel',
  QualityInspectThemeSchema,
  'quality_inspect_theme'
);
