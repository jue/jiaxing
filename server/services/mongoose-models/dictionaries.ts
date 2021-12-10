import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { DBDictionariesI } from '../../../typings/dictionaries';

type DictionariesDocI = DBDictionariesI & Document;
type DictionariesSchemaI = Model<DictionariesDocI> & {};

const DictionariesSchema = new Schema<DictionariesSchemaI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    dataType: {
      type: String,
      required: true,
    },
    chnWd: {
      type: String,
      required: true,
    },
    usWd: {
      type: String,
      required: true,
    },
    dataValue: {
      type: String,
      required: true,
    },
    remark: {
      type: String,
      default: '',
    },
    atCreated: {
      type: Date,
      default: () => new Date(),
    },
  },
  { versionKey: false, toJSON: { virtuals: true }, id: false }
);

export const DictionariesModel = model<DictionariesDocI, DictionariesSchemaI>(
  'DictionariesModel',
  DictionariesSchema,
  'dictionaries'
);
