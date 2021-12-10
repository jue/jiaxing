// 安全风险-问题项
export interface UploadFile {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  resourceSize: number;
  resourceDisplaySize: string;
  attachmentType: string;
}
export interface DBSecurityRisksProblemItemI {
  _id: string; // ID
  name: string; // 问题项
  type: string; // 排查项类别
  remark: string; // 备注
  nodeFiles: UploadFile[]; // 节点文件
  idPerils: string; //检查报告id
  replyContent: string; // 回复内容
  replyFile: UploadFile[]; // 回复图片
  idCreatedBy: boolean; // 发起人
  atCreated: Date; // 创建时间
  deleted: boolean; // 是否删除
}
export interface WebSecurityRisksProblemItem {
  _id: string; // ID
  name: string; // 问题项
  type: string; // 排查项类别
  remark: string; // 备注
  modelFile: UploadFile[]; // 模版文件
  nodeFiles: UploadFile[]; // 节点文件
  files: UploadFile[]; //附件
  idPerils: string; //检查报告id
  atCreated: Date; // 创建时间
  deleted: boolean; // 是否删除
  replyContent: string; //回复内容
  replyFile: UploadFile[]; //回复附件
}
