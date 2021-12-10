import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { DBAuthI } from '../../../typings/auth';
import { AuthAction } from '../../../constants/enums';
import mongoose_delete from 'mongoose-delete';

type AuthDocI = DBAuthI & Document;
type AuthSchemaI = Model<AuthDocI> & {
  sign: (authId: string) => Promise<{ auth: any; token: string }>;
};

const AuthSchema = new Schema<AuthSchemaI>(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    name: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      validate: {
        validator: function (value) {
          return [
            AuthAction.search,
            AuthAction.update,
            AuthAction.create,
            AuthAction.delete,
          ].includes(value);
        },
      },
    },
    moduleType: {
      type: String,
      required: true,
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

AuthSchema.plugin(mongoose_delete, { overrideMethods: true });

export const AuthModel = model<AuthDocI, AuthSchemaI>(
  'AuthModel',
  AuthSchema,
  'auth'
);
