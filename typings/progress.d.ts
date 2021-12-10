// 进度管理
export interface UploadFile {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  resourceSize: number;
  resourceDisplaySize: string;
  attachmentType: string;
}

export interface CustomData {
  priority: PriorityType; // 任务优先级
  BIMcoding: string; // BIM专业构件编码
  jlPrincipal: string; // 监理负责人
}
export type PriorityType =
  | '0' // 低
  | '1' // 普通（默认）
  | '3'; // 高
export type Status = 'notstart' | 'doing' | 'done';
export type TaskTags =
  | '0' // 延期（30天内）
  | '1'; // 严重延期（大于30天）

export interface DBProgressI {
  _id: string; // id

  text: string; // 任务标题
  start_date: Date; // 开始时间
  end_date: Date; // 结束时间
  actual_start_date: Date; // 实际开始时间
  duration: number; // 工期
  progress: number; // 任务完成百分比
  open: boolean; // 是否开启
  parent: string; // 关联的父任务ID
  custom_data: CustomData; //自定义数据
  resource: string[]; //施工负责人

  delay: Status; // 任务状态
  importantNode: boolean; // 重要节点
  taskTags: TaskTags; // 任务标签
  projectId: string; // 关联项目ID

  idCreatedBy: string; // 发起人
  atCreated: Date; // 创建时间
  deleted: boolean; // 是否删除

  delayDays: number; // 延期天数
}
