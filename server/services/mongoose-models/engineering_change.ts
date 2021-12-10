import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import mongoose_delete from 'mongoose-delete';
import { DBEngineeringChangeI } from '../../../typings/engineering_change';

type DBEngineeringChangeDocI = DBEngineeringChangeI & Document;
type DBEngineeringChangeSchemaI = Model<DBEngineeringChangeDocI> & {};

const CostStatementSchema = new Schema(
  {
    costProNumber: {
      type: Number,
      default: 0,
    },
    costProContent: {
      type: String,
      default: '',
    },
    costCompany: {
      type: String,
      default: '',
    },
    costBeforeCount: {
      type: Number,
      default: 0,
    },
    costBeforeUnit: {
      type: Number,
      default: 0,
    },
    costBeforePrice: {
      type: Number,
      default: 0,
    },
    costAfterCount: {
      type: Number,
      default: 0,
    },
    costAfterUnit: {
      type: Number,
      default: 0,
    },
    costAfterPrice: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const DBEngineeringChangeSchema = new Schema<DBEngineeringChangeSchemaI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },

    engineeringName: {
      type: String,
      default: '',
    },
    contractName: {
      type: String,
      default: '',
    },
    constructionUnit: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    head: {
      type: String,
      default: '',
    },
    initiator: {
      type: String,
      default: '',
    },

    changeName: {
      type: String,
      required: true,
    },
    changeLevel: {
      type: String,
      default: 'common',
    },
    changeInitiateUnit: {
      type: String,
      default: '',
    },
    estimateAmountChange: {
      type: Number,
      default: 0,
    },
    endTime: {
      type: Date,
    },
    changeOwner: {
      type: String,
      default: '',
    },
    changeReason: {
      type: String,
      default: '',
    },
    changeDesc: {
      type: String,
      default: '',
    },
    needsDesign: {
      type: Boolean,
      default: false,
    },

    changeDrawings: {
      type: Array,
      default: [],
    },
    changeAccordingFile: {
      type: Array,
      default: [],
    },

    costStatement: [CostStatementSchema],

    modelFile: {
      type: Array,
      default: [],
    },
    nodeFiles: {
      type: Array,
      default: [],
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

    status: {
      type: String,
      default: '1',
    },
    idEngineering: {
      type: String,
      index: true,
      required: true,
    },
    idContract: {
      type: String,
      index: true,
      required: true,
    },
    idAuditing: {
      type: String,
      default: '',
    },
    contractorUnit: {
      type: String,
      default: '',
    },
    constructionControlUnit: {
      type: String,
      default: '',
    },
    constructionExectionUnit: {
      type: String,
      default: '',
    },
    designUnit: {
      type: String,
      default: '',
    },
    desideAgree: {
      type: String,
      default: '',
    },
    investmentAmountDesc: {
      type: String,
      default: '',
    },
    investmentAmount: {
      type: Number,
      default: 0,
    },
    changeType: {
      type: String,
      default: '',
    },
    feePercent1: {
      type: Number,
      default: 0,
    },
    feePercent2: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false, toJSON: { virtuals: true }, id: false }
);

DBEngineeringChangeSchema.plugin(mongoose_delete, {
  overrideMethods: true,
});

DBEngineeringChangeSchema.virtual('engineering', {
  ref: 'EngineeringModel', // The model to use
  localField: 'idEngineering', // Find people where `localField`
  foreignField: '_id', // is equal to `foreignField`
  justOne: true,
});
DBEngineeringChangeSchema.virtual('contract', {
  ref: 'ContractModel', // The model to use
  localField: 'idEngineering', // Find people where `localField`
  foreignField: '_id', // is equal to `foreignField`
  justOne: true,
});
DBEngineeringChangeSchema.virtual('account', {
  ref: 'AccountModel', // The model to use
  localField: 'idCreatedBy', // Find people where `localField`
  foreignField: '_id', // is equal to `foreignField`
  justOne: true,
});

export const DBEngineeringChangeModel = model<
  DBEngineeringChangeDocI,
  DBEngineeringChangeSchemaI
>(
  'DBEngineeringChangeModel',
  DBEngineeringChangeSchema,
  'engineering_change_table'
);
