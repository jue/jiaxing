import { ActionModel } from '../services/mongoose-models/action';
import { NotificationModel } from '../services/mongoose-models/notification';
import { CreateActionI, DBActionI } from '../../typings/action';
import {
  CreateNotificationI,
  DBNotificationI,
} from '../../typings/notification';

import uniq from 'lodash/uniq';
import redisService from './RedisService';

interface GetNotificationFilters {
  idTo: string;
}

class NotifyActionService {
  async createAction<T>(action: CreateActionI<T>) {
    let newAction = new ActionModel(action);
    await newAction.validate();
    await newAction.save();
    return newAction;
  }

  async createNotification(notification: CreateNotificationI) {
    const newNotification = new NotificationModel(notification);
    await newNotification.validate();
    await newNotification.save();

    return newNotification;
  }

  async createActionNotification(params: {
    idTos: string[];
    idAction: string;
    idCreatedBy: string;
  }) {
    let idTos = uniq(params.idTos || []);
    for (const idTo of idTos) {
      await notifyActionService.createNotification({
        idAction: params.idAction,
        idTo,
        unread: true,
        atRead: null,

        atCreated: new Date(),
        idCreatedBy: params.idCreatedBy,
      });

      redisService.pubUserMessageBySocket(idTo, 'refreshNotification', {});
    }
  }

  async updateNotificaton(
    query: Partial<{ _id: string; idTo: string }>,
    params: { unread: boolean }
  ) {
    let newNotification = await NotificationModel.updateOne(query, {
      unread: params.unread,
      atRead: new Date(),
    });

    return newNotification;
  }

  async getNotifications(filter: GetNotificationFilters) {
    let notificationCursor = await NotificationModel.aggregate()
      .match({
        idTo: filter.idTo || '',
      })
      .lookup({
        from: 'action',
        localField: 'idAction',
        foreignField: '_id',
        as: 'action',
      })
      .addFields({
        action: {
          $arrayElemAt: ['$action', 0],
        },
      })
      .addFields({
        data: '$action.data',
        type: '$action.type',
      })
      .lookup({
        from: 'account',
        localField: 'idCreatedBy',
        foreignField: '_id',
        as: 'creatorTmp',
      })
      .addFields({
        creatorTmp: {
          $arrayElemAt: ['$creatorTmp', 0],
        },
      })
      .addFields({
        creator: {
          _id: '$creatorTmp._id',
          username: '$creatorTmp.username',
          idMajorGroup: '$creatorTmp.idMajorGroup',
        },
      })
      .project({
        action: 0,
        creatorTmp: 0,
      })
      .sort({
        atCreated: -1,
      });

    return notificationCursor;
  }

  async count(filter: GetNotificationFilters) {
    let mathIdTo = filter.idTo || '';
    let total = await NotificationModel.countDocuments({
      idTo: mathIdTo,
    });
    let unread = await NotificationModel.countDocuments({
      idTo: mathIdTo,
      unread: true,
    });

    return {
      total,
      unread,
    };
  }
}

const notifyActionService = new NotifyActionService();
export default notifyActionService;
