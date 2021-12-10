// 检查计划-主题
export type InspectionMethod = 'day' | 'special' | 'spot';
export type InspectionFrequency =
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'withOutday';
export type InspectionType =
  | 'constructionUnit' // 施工单位自检
  | 'supervisionUnit' // 监理单位检查
  | 'developmentUnit' // 建设单位检查
  | 'projectJoint' // 项目联合检查
  | 'other'; // 其他
export type AllocateObjects = '';
export interface UploadFile {
  _id: string;
  contentType: string;
  originalname: string;
}
export interface DBQualityInspectSubjectI {
  _id: string; // id
  name: string; // 主题名称
  method: InspectionMethod; // 检查方式
  frequency: InspectionFrequency; // 检查周期（频率）
  count: number; // 检查次数
  type: InspectionType; // 检查类型
  allocateObjects: AllocateObjects; // 分配对象
  startTime: Date; // 开始时间
  endTime: Date; // 结束时间
  files: UploadFile[]; // 主题附件
  idPlan: string; // 计划id
  distributionState: string; // 分配状态
  progress: number; // 办理进度
  pos: number; // 位置
  atCreated: Date; // 创建日期
  deleted: boolean; // 是否删除
}

export interface WebQualityInspectSubjectI {
  _id: string; // id
  name: string; // 主题名称
  method: string; // 检查方式
  frequency: string; // 检查周期（频率）
  count: number; // 检查次数
  type: string; // 检查类型
  allocateObjects: string; // 分配对象
  startTime: Date; // 开始时间
  endTime: Date; // 结束时间
  files: UploadFile[]; // 主题附件
  idPlan: string; // 计划id
  distributionState: string; // 分配状态
  progress: string; // 办理进度
  atCreated: Date; // 创建日期
  pos: number; // 位置
}
