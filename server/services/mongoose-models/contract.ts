import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import mongoose_delete from 'mongoose-delete';
import {
  DBSGContractI,
  DBJLContractI,
  DBOtherContractI,
  DBContractI,
  PartyB,
  PayTerms,
} from '../../../typings/contract';

type PartyBDocI = PartyB & Document;
type PartyBSchemaI = Model<PartyBDocI> & {};

type PayTermsDocI = PayTerms & Document;
type PayTermsSchemaI = Model<PayTermsDocI> & {};

type SGContractDocI = DBSGContractI & Document;
type SGContractSchemaI = Model<SGContractDocI> & {};

type JLContractDocI = DBJLContractI & Document;
type JLContractSchemaI = Model<JLContractDocI> & {};

type OtherContractDocI = DBOtherContractI & Document;
type OtherContractSchemaI = Model<OtherContractDocI> & {};

type ContractDocI = DBContractI & Document;
type ContractSchemaI = Model<ContractDocI> & {};

const PartyBSchema = new Schema<PartyBSchemaI>(
  {
    partyB: {
      type: String,
      required: true,
    },
    partyBLegalPerson: {
      type: String,
      required: true,
    },
    partyBNumber: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);
const PayTermsSchema = new Schema<PayTermsSchemaI>(
  {
    payContent: {
      type: String,
      default: '',
    },
    payAmount: {
      type: Number,
      default: 0,
    },
    payPercentage: {
      type: Number,
      default: 0,
    },
    payTerms: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const ContractBase = {
  _id: {
    type: String,
    default: () => new ObjectId().toHexString(),
  },
  tendertype: {
    type: String,
    index: true,
    required: true,
  },
  contractType: {
    type: String,
    required: true,
  },
  letterAcceptance: {
    type: String,
    default: '',
  },
  capitalSource: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    default: '',
  },
  unitUnifiedNumber: {
    type: String,
    default: '',
  },
  contractEffectiveDate: {
    type: Date,
    default: null,
  },
  partyA: {
    type: String,
    required: true,
  },
  partyALegalPerson: {
    type: String,
    required: true,
  },
  partyANumber: {
    type: String,
    default: '',
  },
  partyB: {
    type: [PartyBSchema],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  changedAmount: {
    type: Number,
    default: 0,
  },
  payTerms: {
    type: [PayTermsSchema],
    required: true,
  },
  openAccountBank: {
    type: String,
    default: '',
  },
  openAccountPerson: {
    type: String,
    default: '',
  },
  openAccount: {
    type: String,
    default: '',
  },
  modelFile: {
    type: Array,
    default: [],
  },
  nodeFiles: {
    type: Array,
    default: [],
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
};

const PublictenderSchema = {
  ...ContractBase,
  idEngineering: {
    type: String,
    required: true,
  },
  blockName: {
    type: String,
    default: '',
  },
  projectSite: {
    type: String,
    default: '',
  },
  projectApprovalNumber: {
    type: String,
    default: '',
  },
  projectScale: {
    type: String,
    required: true,
  },
  projectScope: {
    type: String,
    required: true,
  },
  advancePaymentType: {
    type: String,
    default: '',
  },
  advancePaymentAmount: {
    type: String,
    default: '',
  },
  balancePaymentType: {
    type: String,
    default: '',
  },
  balancePaymentAmount: {
    type: String,
    default: '',
  },
  qualityMoneyType: {
    type: String,
    default: '',
  },
  qualityMoneyAmount: {
    type: String,
    default: '',
  },
  specialTerms: {
    type: Array,
    default: [],
  },
};

const SGContractSchema = new Schema<SGContractSchemaI>(
  {
    ...PublictenderSchema,
    planStartDate: {
      type: Date,
      default: null,
    },
    planEndDate: {
      type: Date,
      default: null,
    },
    contractTime: {
      type: String,
      default: '',
    },
    tenderTime: {
      type: String,
      default: '',
    },
    matEngDesignEstAmount: {
      type: Number,
      default: 0,
    },
    safeCivilizedAmount: {
      type: Number,
      default: 0,
    },
    proEngEstAmount: {
      type: Number,
      default: 0,
    },
    provisionalAmount: {
      type: Number,
      default: 0,
    },
    changeableAmount: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false,
  }
);

const JLContractSchema = new Schema<JLContractSchemaI>(
  {
    ...PublictenderSchema,
    remunerationType: {
      type: String,
      required: true,
    },
    remunerationScope: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false,
  }
);

const OtherContractSchema = new Schema<OtherContractSchemaI>(
  {
    ...ContractBase,
    contractDesc: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false,
  }
);

const ContractSchema = new Schema<ContractSchemaI>(
  {
    ...PublictenderSchema,
    planStartDate: {
      type: Date,
      default: null,
    },
    planEndDate: {
      type: Date,
      default: null,
    },
    contractTime: {
      type: String,
      default: '',
    },
    tenderTime: {
      type: String,
      default: '',
    },
    matEngDesignEstAmount: {
      type: Number,
      default: 0,
    },
    safeCivilizedAmount: {
      type: Number,
      default: 0,
    },
    proEngEstAmount: {
      type: Number,
      default: 0,
    },
    provisionalAmount: {
      type: Number,
      default: 0,
    },
    changeableAmount: {
      type: Number,
      required: true,
    },
    remunerationType: {
      type: String,
      required: true,
    },
    remunerationScope: {
      type: String,
      required: true,
    },
    contractDesc: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false,
  }
);

ContractSchema.plugin(mongoose_delete, {
  overrideMethods: true,
});

ContractSchema.virtual('engineering', {
  ref: 'EngineeringModel', // The model to use
  localField: 'idEngineering', // Find people where `localField`
  foreignField: '_id', // is equal to `foreignField`
  justOne: true,
});

export const SGContractModel = model<SGContractDocI, SGContractSchemaI>(
  'SGContractModel',
  SGContractSchema,
  'contract'
);

export const JLContractModel = model<JLContractDocI, JLContractSchemaI>(
  'JLContractModel',
  JLContractSchema,
  'contract'
);

export const OtherContractModel = model<
  OtherContractDocI,
  OtherContractSchemaI
>('OtherContractModel', OtherContractSchema, 'contract');

export const ContractModel = model<ContractDocI, ContractSchemaI>(
  'ContractModel',
  ContractSchema,
  'contract'
);
