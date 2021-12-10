import { Schema, model, Model, Document, Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import { DBAccountI, UploadFile } from '../../../typings/account';
import jwt from 'jsonwebtoken';
import { CONFIG_JWT, ONE_HOUR_IN_MS, ONE_MONTH_IN_MS } from '../../config';
import mongoose_delete from 'mongoose-delete';

type AccountDocI = Omit<DBAccountI, 'files'> & {
  files: Types.Subdocument & UploadFile;
} & Document;

type AccountSchemaI = Model<AccountDocI> & {
  sign: (accountId: string) => Promise<{ account: any; token: string }>;
};

const FileSchema = new Schema({
  _id: String,
  contentType: String,
  originalname: String,
});

const AccountSchema = new Schema<AccountSchemaI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    userName: {
      type: String,
      required: true,
    },
    nickName: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      default: '',
      select: false,
    },
    idCompany: {
      type: String,
      required: true,
      index: true,
    },
    idDepartment: {
      type: String,
      required: true,
      index: true,
    },
    idJob: {
      type: String,
      required: true,
      index: true,
    },
    idsAuth: {
      type: Array,
      default: [],
    },
    phone: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    atCreated: {
      type: Date,
      default: () => new Date(),
    },
    role: {
      type: String,
      default: 'common',
    },
    files: FileSchema,
    deleted: {
      type: Boolean,
      default: false,
    },
    signId: {
      type: String,
      default: '',
    },
  },
  { versionKey: false, toJSON: { virtuals: true }, id: false }
);

AccountSchema.plugin(mongoose_delete, { overrideMethods: true });

AccountSchema.virtual('bind', {
  ref: 'BindModel',
  localField: '_id',
  foreignField: 'accountid',
  justOne: true,
});

AccountSchema.virtual('company', {
  ref: 'CompanyModel',
  localField: 'idCompany',
  foreignField: '_id',
  justOne: true,
});

AccountSchema.virtual('dept', {
  ref: 'DepartmentModel',
  localField: 'idDepartment',
  foreignField: '_id',
  justOne: true,
});

AccountSchema.virtual('job', {
  ref: 'JobModel',
  localField: 'idJob',
  foreignField: '_id',
  justOne: true,
});

AccountSchema.virtual('auth', {
  ref: 'AuthModel',
  localField: 'idsAuth',
  foreignField: '_id',
  justOne: false,
});

AccountSchema.statics.sign = async (_id: string) => {
  let aggregate = AccountModel.aggregate([]).match({
    _id,
  });
  let acconts = await aggregate;

  let accountData = acconts[0];
  let token = jwt.sign(
    {
      _id: accountData._id,
    },
    CONFIG_JWT.secret,
    { expiresIn: `${ONE_MONTH_IN_MS}ms` }
  );

  token = `Bearer ${token}`;
  return {
    account: accountData,
    token,
  };
};

export const AccountModel = model<AccountDocI, AccountSchemaI>(
  'AccountModel',
  AccountSchema,
  'account'
);
