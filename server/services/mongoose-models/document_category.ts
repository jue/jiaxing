import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { DocumentCategory } from '../../../typings/document';
import mongoose_delete from 'mongoose-delete';

type DocumentCategoryDocI = DocumentCategory & Document;
type DocumentCategorySchemaI = Model<DocumentCategoryDocI> & {};

const DocumentCategorySchema = new Schema<DocumentCategorySchemaI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    name: {
      type: String,
      required: true,
    },
    idParent: {
      type: String,
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
  },
  { versionKey: false, toJSON: { virtuals: true }, id: false }
);

DocumentCategorySchema.plugin(mongoose_delete, { overrideMethods: true });

export const DocumentCategoryModel = model<
  DocumentCategoryDocI,
  DocumentCategorySchemaI
>('DocumentCategoryModel', DocumentCategorySchema, 'DocumentCategory');
