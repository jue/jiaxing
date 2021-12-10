import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Documents } from '../../../typings/document';
import mongoose_delete from 'mongoose-delete';

type DocumentDocI = Documents & Document;
type DocumentSchemaI = Model<DocumentDocI> & {};

const DocumentSchema = new Schema<DocumentSchemaI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    name: {
      type: String,
      required: true,
    },
    idCategory: {
      type: String,
      required: true,
    },
    idFile: {
      type: String,
      required: true,
    },
    documentNo: {
      type: String,
      required: false,
    },
    isFavorite: {
      type: Boolean,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    idCreatedBy: {
      type: String,
      default: '',
    },
    atCreated: {
      type: Date,
      default: () => new Date(),
    },
    dataStatus: {
      type: String,
      default: '',
    },
  },
  { versionKey: false, toJSON: { virtuals: true }, id: false }
);

DocumentSchema.plugin(mongoose_delete, { overrideMethods: true });

DocumentSchema.virtual('account', {
  ref: 'AccountModel', // The model to use
  localField: 'idCreatedBy', // Find people where `localField`
  foreignField: '_id', // is equal to `foreignField`
  justOne: false,
});

DocumentSchema.virtual('category', {
  ref: 'DocumentCategoryModel',
  localField: 'idCategory',
  foreignField: '_id',
  justOne: true,
});

export const DocumentModel = model<DocumentDocI, DocumentSchemaI>(
  'DocumentModel',
  DocumentSchema,
  'Document'
);
