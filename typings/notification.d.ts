interface BaseNotificationI {
  idAction: string;
  idCreatedBy: string;
  idTo: string;
}

export interface DBNotificationI extends BaseNotificationI {
  _id: string;
  atCreated: Date;
  unread: boolean;
  atRead: Date;
}

export interface CreateNotificationI extends Partial<DBNotificationI> {}

export type SocketEventsI = 'refreshNotification';
