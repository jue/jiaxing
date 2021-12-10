// 整改-任务
export type Level = 'common' | 'important' | 'emergency';
export type Status =
  | 'todo' // 未开始
  | 'doing' // 进行中
  | 'tocheck' // 待验收
  | 'done' // 已完成
  | 'outdate'; // 已超期
export interface UploadFile {
  _id: string;
  contentType: string;
  originalname: string;
}

export interface DialogueContent {
  userId: string;
  userName: string;
  atCreated: Date;
  content: string;
}
export interface DBQualityInspectTaskI {
  _id: string; // id
  idRectification: string; // 整改id
  idReport: string; // 检查报告id
  idSubject: string; // 检查主题id
  level: Level; // 任务优先级
  progress: number; // 任务进度
  content: any; // 任务对话内容
  status: Status; // 任务状态
  idCreator: string; // 发起人/创建人
  idParticipate: string[]; // 参与人
  atCreated: Date; // 任务创建时间
  files: UploadFile[]; // 任务附件
  deleted: boolean; // 是否删除

  name: string; // 整改任务名称
  idExecutive: string; // 执行人(任务接收人)
  endTime: Date; // 截止日期
  idsCC: string[]; // 抄送对象
}
export interface webCreateTaskI {
  _id: string; // id
  idRectification: string; // 整改id
  idReport: string; // 检查报告id
  idSubject: string; // 检查主题id
  level: Level; // 任务优先级
  progress: number; // 任务进度
  content: any; // 任务对话内容
  atCreated: Date; // 任务创建时间
  files: UploadFile[]; // 任务附件
  status: Status; // 任务状态

  name: string; // 整改任务名称
  idExecutive: string; // 执行人(任务接收人)
  endTime: Date; // 截止日期
  idsCC: string[]; // 抄送对象
}
