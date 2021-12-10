// 流程进度关系表
export type ActionType =
  | 'create'
  | 'batchCreate'
  | 'update'
  | 'batchUpdate'
  | 'delete'
  | 'batchDelete';

export interface DBProgressDetailI {
  _id: string; // id

  name: string; //名称
  auditingId: string; // 流程id
  progressId: string[]; // 进度id
  data: any; // 数据
  actionType: ActionType; // 操作
  idCreatedBy: boolean; // 发起人

  status: string; // 任务状态
  isAuth: boolean; //权限

  atCreated: Date; // 创建时间
  deleted: boolean; // 是否删除
}
