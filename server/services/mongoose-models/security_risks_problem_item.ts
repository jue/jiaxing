import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { DBSecurityRisksProblemItemI } from '../../../typings/security_risks_problem_item';
import mongoose_delete from 'mongoose-delete';

type ItemDocI = DBSecurityRisksProblemItemI & Document;
type ItemSchemaI = Model<ItemDocI> & {};

const FileSchema = new Schema({
  resourceId: String,
  resourceName: String,
  resourceType: String,
  resourceSize: Number,
  resourceDisplaySize: String,
  attachmentType: String,
});

const SecurityRisksProblemItemSchema = new Schema<ItemSchemaI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: '',
    },
    remark: {
      type: String,
      default: '',
    },
    idPerils: {
      type: String,
      required: true,
    },
    nodeFiles: {
      type: Array,
      default: [],
    },
    replyContent: {
      type: String,
      default: '',
    },
    replyFile: {
      type: Array,
      default: [],
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

SecurityRisksProblemItemSchema.plugin(mongoose_delete, {
  overrideMethods: true,
});

export const SecurityRisksProblemItemModel = model<ItemDocI, ItemSchemaI>(
  'SecurityRisksProblemItemModel',
  SecurityRisksProblemItemSchema,
  'security_risks_hidden_item'
);
