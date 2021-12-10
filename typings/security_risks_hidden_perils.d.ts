// 安全管理-隐患排查
export type PerilsType =
  | 'routineInspection' // 例行检查
  | 'specialInspection' // 专项检查
  | 'holidaysInspection' // 节假日检查
  | 'seasonInspection'; // 季节性检查
export type PerilsResults =
  | 'common' // 一般
  | 'serious' // 严重
  | 'great'; // 重大

export interface UploadFile {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  resourceSize: number;
  resourceDisplaySize: string;
  attachmentType: string;
}
export interface DBSecurityRisksHiddenPerilsI {
  _id: string; // id
  name: string; // 排查主题
  number: string; // 排查编号
  desc: string; // 排查描述
  type: PerilsType; // 排查类型
  perilsTime: Date; // 排查日期
  partCompanys: string[]; // 参与单位
  perilsResults: PerilsResults; // 排查结果
  executor: string; // 执行人
  endTime: Date; // 截止时间
  modelFile: UploadFile[]; // 模版文件
  nodeFiles: UploadFile[]; // 节点文件
  status: string; // 办理状态
  idAuditing: string; //审核流程ID
  idCreatedBy: string; // 创建人
  atCreated: Date; // 创建日期
  deleted: boolean; // 是否删除

  delayDays: number; // 延期天数

  isAuth: boolean; //权限
}
export interface WebSecurityRisksHiddenPerils {
  _id: string; // id
  name: string; // 排查主题
  number: string; // 排查编号
  desc: string; // 排查描述
  type: PerilsType; // 排查类型
  perilsTime: Date; // 排查日期
  partCompanys: string[]; // 参与单位
  perilsResults: PerilsResults; // 排查结果
  executor: string; // 执行人
  accountExecutor: any;
  endTime: Date; // 截止时间
  modelFile: any[]; // 模版文件
  nodeFiles: UploadFile[]; // 节点文件
  files: UploadFile[]; // 附件

  status: string; // 办理状态
  // { key: 1, value: ' 整改中' },
  // { key: 2, value: '已驳回' },
  // { key: 3, value: '已取消' },
  // { key: 4, value: '已整改' },

  idAuditing: string; //审核流程ID
  idCreatedBy: string; // 创建人
  atCreated: Date; // 创建日期
  deleted: boolean; // 是否删除
  bizData: any;
  isAuth: boolean; //权限
}
export interface QualityColumn {
  delayCount: number;
  inspectCount: number;
  rectifyCount: number;
  _id: string;
}
