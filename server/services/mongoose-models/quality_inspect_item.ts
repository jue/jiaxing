import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { DBSecurityRisksProblemItemI } from '../../../typings/security_risks_problem_item';
import mongoose_delete from 'mongoose-delete';

type ItemDocI = DBSecurityRisksProblemItemI & Document;
type ItemSchemaI = Model<ItemDocI> & {};

const QualityInspectItemSchema = new Schema<ItemSchemaI>(
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
    modelFile: {
      type: Array,
      default: [],
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

QualityInspectItemSchema.plugin(mongoose_delete, {
  overrideMethods: true,
});

export const QualityInspectItemModel = model<ItemDocI, ItemSchemaI>(
  'QualityInspectItemModel',
  QualityInspectItemSchema,
  'quality_inspect_item'
);
