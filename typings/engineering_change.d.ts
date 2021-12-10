// 工程变更
export interface UploadFile {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  resourceSize: number;
  resourceDisplaySize: string;
  attachmentType: string;
}

export interface CostStatement {
  costProNumber: number; //项目号
  costProContent: string; //项目内容
  costCompany: string; //单位
  costBeforeCount: number; //变更前费用-数量
  costBeforeUnit: number; //变更前费用-单价
  costBeforePrice: number; //变更前费用-金额
  costAfterCount: number; //变更后费用-数量
  costAfterUnit: number; //变更后费用-单价
  costAfterPrice: number; //变更后费用-金额
}

export type changeLevel = 'common' | 'great';
export type ChangeType = 'constructionUnit' | 'designUnit' | 'other';
export interface DBEngineeringChangeI {
  _id: string; // id

  // 项目信息
  engineeringName: string; // 工程名称
  contractName: string; // 合同名称
  constructionUnit: string; // 建设单位名称
  phone: string; // 建设单位电话
  head: string; // 建设单位负责人
  initiator: string; // 变更发起人

  // 变更信息
  changeName: string; // 变更名称
  changeLevel: changeLevel; // 变更级别
  changeInitiateUnit: string; // 变更发起单位
  estimateAmountChange: number; // 预估变更金额
  endTime: Date; // 截至日期
  changeOwner: string; // 变更责任人
  changeReason: string; // 变更原因
  changeDesc: string; // 变更描述
  needsDesign: boolean; // 是否出图 默认无图纸false

  changeDrawings: UploadFile[]; // 图纸文件
  changeAccordingFile: UploadFile[]; // 变更依据文件

  costStatement: CostStatement[]; //费用计算清单

  modelFile: UploadFile[]; // 模版文件
  nodeFiles: UploadFile[]; // 节点文件

  status: string; // 状态 // 1表示审批中 2表示已驳回 3表示已取消 4表示已通过",

  idEngineering: string; // 工程 id
  idContract: string; // 合同 ID
  idAuditing: string; //审核流程ID

  atCreated: Date; // 发起时间
  idCreatedBy: boolean; // 发起人
  deleted: boolean; // 是否删除

  isAuth: boolean; //权限

  contractorUnit: string; // 承包单位
  constructionExectionUnit: string; // 施工单位
  constructionControlUnit: string; //监理单位
  designUnit: string; // 设计单位
  desideAgree: string; //是否同意立项
  investmentAmountDesc: string; // 核定变更金额说明
  investmentAmount: number; // 核定变更金额（保留小数点后两位，例如100.23）
  changeType: ChangeType; // 变更类别（例如：施工、设计、其它）
  feePercent1: number; // 费用分摊意见-建设单位
  feePercent2: number; // 费用分摊意见-施工单位
}
