// 施工方案
export type SchemeType =
  | 'specialConstructionScheme' // 专项施工方案
  | 'specialConstructionSchemeOver' // 专项施工方案(超过一定规模)
  | 'emergency'; // 应急预案

export interface UploadFile {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  resourceSize: number;
  resourceDisplaySize: string;
  attachmentType: string;
}
export interface Account {
  userName: string;
  _id: string;
}
export interface DBConstructionSchemeI {
  _id: string; // id
  name: string; // 方案名称
  type: SchemeType; // 方案类型
  projectName: string; // 项目名称
  modelFile: UploadFile[]; // 模版文件
  nodeFiles: UploadFile[]; // 节点文件
  idAuditing: string; //审核流程ID
  status: string; // 状态
  atCreated: Date; // 创建日期
  idCreatedBy: boolean; // 发起人
  deleted: boolean; // 是否删除
  isAuth: boolean; //权限
}

export interface WebConstructionSchemeI {
  _id: string; // id
  name: string; // 方案名称
  type: SchemeType; // 方案类型
  projectName: string; // 项目名称
  modelFile: any[]; // 模版文件
  nodeFiles: UploadFile[]; // 节点文件
  idAuditing: string; //审核流程ID
  status: string; // 状态
  atCreated: Date; // 创建日期
  idCreatedBy: boolean; // 发起人
  deleted: boolean; // 是否删除
  isAuth: boolean; //权限
  account: Account;
}
