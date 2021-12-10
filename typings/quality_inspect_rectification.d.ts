// 整改安排

export interface DBQualityInspectRectificationI {
  _id: string;
  name: string; // 整改任务名称
  idExecutive: string; // 执行人
  endTime: Date; // 截止日期
  idsCC: string[]; // 抄送对象
  idReport: string; // 检查报告id
  deleted: boolean; // 是否删除
  creator: string; // 发起人/创建人
  atCreated: Date; // 创建时间
}
