// 质量检查-报告
export type CheckWay = 'day' | 'special' | 'spot';
export type CheckType =
  | 'constructionUnit' // 施工单位自检
  | 'supervisionUnit' // 监理单位检查
  | 'developmentUnit' // 建设单位检查
  | 'projectJoint' // 项目联合检查
  | 'other'; // 其他
export type CheckFrequency =
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'withOutday';
export type CheckResult =
  | 'qualified'
  | 'warning'
  | 'rectification'
  | 'shutdownRectification';
export type AcceptResult = 'pass' | 'nopass';

export interface UploadFile {
  _id: string;
  contentType: string;
  originalname: string;
}
export interface DBQualityInspectReportI {
  _id: string;
  idSubject: string; // 主题的id
  files: UploadFile[]; //文件
  name: string; // 检查报告
  number: string; // 检查编号
  way: CheckWay; // 检查方式
  type: CheckType; // 检查类型
  frequency: CheckFrequency; // 检查频率
  desc: string; // 检查描述
  result: CheckResult; // 检查结果
  creator: string; // 创建人
  atCreated: Date; // 创建时间
  state: string; // 办理状态
  acceptResult: AcceptResult; // 验收结果
  acceptOpinion: string; // 验收意见
  acceptEvaluation: string; // 验收评价
  deleted: boolean; // 是否删除
}
