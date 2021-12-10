import { Schema, model, Model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

import { DBNotificationI } from '../../../typings/notification';

const NotificationSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => new ObjectId().toHexString(),
    },
    idAction: {
      type: String,
      required: true,
      index: true,
      unique: false,
    },

    idCreatedBy: {
      type: String,
      required: true,
      index: true,
      unique: false,
    },

    idTo: {
      type: String,
      required: true,
      index: true,
      unique: false,
    },

    atCreated: {
      type: Date,
      default: () => new Date(),
    },

    unread: {
      type: Boolean,
      default: true,
    },
    atRead: Date,
  },
  { versionKey: false }
);

export const NotificationModel = model<DBNotificationI & Document>(
  'NotificationModel',
  NotificationSchema,
  'notification'
);
