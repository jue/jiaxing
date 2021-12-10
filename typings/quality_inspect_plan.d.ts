import mongoose from 'mongoose';
// 检查计划-计划
export type InspectionState = 'notstart' | 'ongoing' | 'complete';
export interface UploadFile {
  _id: string;
  contentType: string;
  originalname: string;
}
export interface DBQualityInspectPlanI {
  _id: string; // id
  files: UploadFile[]; // 计划附件
  desc: string; // 计划描述
  name: string; // 计划名称
  number: string; // 计划编号
  startTime: Date; // 计划开始时间
  endTime: Date; // 计划结束时间
  atCreated: Date; // 计划创建时间
  schedule: number; // 计划进度
  state: InspectionState; // 计划状态
  deleted: boolean; // 是否删除
}

export interface WebQualityInspectPlan {
  _id: string; // id
  files: UploadFile[]; // 计划附件
  desc: string; // 计划描述
  name: string; // 计划名称
  number: string; // 计划编号
  startTime: Date; // 计划开始时间
  endTime: Date; // 计划结束时间
  atCreated: Date; // 计划创建时间
  schedule: string; // 计划进度
  state: InspectionState; // 计划状态
  idsSubject: string[]; // 主题ids
  createFiles: UploadFile[]; // 更新附件
}
