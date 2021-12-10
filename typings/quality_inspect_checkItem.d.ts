// 质量检查-检查项
export type CheckItemResult = 'pass' | 'notPass';
export type CheckItemType =
  | 'sand' // 沙子
  | 'concrete' // 混凝土
  | 'reinforced' // 钢筋
  | 'casting'; // 浇筑
export interface UploadFile {
  _id: string;
  contentType: string;
  originalname: string;
}
export interface DBQualityInspectCheckItemI {
  _id: string; // ID
  name: string; // 检查项名称
  result: CheckItemResult; // 检查项结果
  type: CheckItemType; // 检查项类别
  remark: string; // 备注
  files: UploadFile[];
  idReport: string; //检查报告id
  atCreated: Date; // 创建时间
  deleted: boolean; // 是否删除
}
