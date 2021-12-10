// 合同管理
export type TenderType = 'public' | 'private';

export type ContractType =
  | 'construction' // 施工合同
  | 'supervision' // 监理合同
  | 'other'; //其他合同

export type DeliveryType = 'oneTime' | 'partial';

export interface UploadFile {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  resourceSize: number;
  resourceDisplaySize: string;
  attachmentType: string;
}

export interface PartyB {
  partyB: string; // 承包人（乙方）
  partyBLegalPerson: string; // 承包人法人
  partyBNumber: string; // 承包人统一社会信用代码
}
export interface PayTerms {
  payContent: string; // 支付内容
  payAmount: number; // 支付金额
  payPercentage: number; // 支付占总额百分比
  payTerms: string; // 支付条件
}

interface DBContractBaseI {
  _id: string;
  tendertype: TenderType; // 招标类型（公开招标、自行招标）
  contractType: ContractType; // 合同类型
  letterAcceptance: string; // 中标通知书

  capitalSource: string; // 资金来源

  name: string; // 合同名称
  number: string; // 合同统一编号
  unitUnifiedNumber: string; // 本单位统一编号
  contractEffectiveDate: Date; // 合同生效日期
  partyA: string; // 发包人（甲方）
  partyALegalPerson: string; // 发包人法人
  partyANumber: string; // 发包人统一社会信用代码
  partyB: PartyB[]; // 承包人（乙方）

  amount: number; // 合同总金额| 签约酬金合同总额
  changedAmount: number;

  payTerms: PayTerms[]; // 支付条款

  openAccountBank: string; // 开户银行
  openAccountPerson: string; // 开户人
  openAccount: string; // 开户账号

  modelFile: UploadFile[]; // 模版文件
  nodeFiles: UploadFile[]; // 节点文件
  status: string; // 办理状态
  idAuditing: string; //审核流程ID
  idCreatedBy: string; // 创建人
  atCreated: Date; // 创建日期
  deleted: boolean; // 是否删除
  isAuth: boolean; //权限
}

interface DBPublictenderI extends DBContractBaseI {
  // 项目概况
  idEngineering: string; // 项目ID
  blockName: string; // 标段名称
  projectSite: string; // 项目地点
  projectApprovalNumber: string; // 工程核准（备案）证编号
  projectScale: string; // 项目规模及特征
  projectScope: string; // 项目承包范围

  advancePaymentType: string; // 预付款类型
  advancePaymentAmount: number; // 预付款值
  balancePaymentType: string; // 尾款类型
  balancePaymentAmount: number; // 尾款值
  qualityMoneyType: string; // 质保金类型
  qualityMoneyAmount: number; // 质保金值

  specialTerms: any[]; // 专用条款
}

//施工合同字段
export interface DBSGContractI extends DBPublictenderI {
  planStartDate: Date; // 计划开工日期
  planEndDate: Date; // 计划竣工日期
  contractTime: string; // 合同工期
  tenderTime: string; // 招标工期

  matEngDesignEstAmount: number; // 材料和工程设备暂估价金额
  safeCivilizedAmount: number; // 安全文明施工费
  proEngEstAmount: number; // 专业工程暂估价金额
  provisionalAmount: number; // 暂列金额
  changeableAmount: number; // 合同可变更金额
}

//监理合同字段
export interface DBJLContractI extends DBPublictenderI {
  remunerationType: string; // 酬金方式
  remunerationScope: string; // 酬金范围
}

//其他合同字段
export interface DBOtherContractI extends DBContractBaseI {
  contractDesc: string; // 合同描述
}

export interface DBContractI extends DBSGContractI {
  remunerationType: string; // 酬金方式
  remunerationScope: string; // 酬金范围
  contractDesc: string; // 合同描述
}

export interface CreateContractInfoI {
  name: string;
  amount: Yuan;
  idEngineering: string;
}

export interface WEBDBContractI {
  _id: string;
  tendertype: TenderType; // 招标类型（公开招标、自行招标）
  contractType: ContractType; // 合同类型
  letterAcceptance: string; // 中标通知书

  capitalSource: string; // 资金来源

  name: string; // 合同名称
  number: string; // 合同统一编号
  unitUnifiedNumber: string; // 本单位统一编号
  contractEffectiveDate: Date; // 合同生效日期
  partyA: string; // 发包人（甲方）
  partyALegalPerson: string; // 发包人法人
  partyANumber: string; // 发包人统一社会信用代码
  partyB: PartyB[]; // 承包人（乙方）

  amount: number; // 合同总金额| 签约酬金合同总额
  changedAmount: number;

  payTerms: any[]; // 支付条款

  openAccountBank: string; // 开户银行
  openAccountPerson: string; // 开户人
  openAccount: string; // 开户账号

  modelFile: UploadFile[]; // 模版文件
  nodeFiles: UploadFile[]; // 节点文件
  status: string; // 办理状态
  idAuditing: string; //审核流程ID
  idCreatedBy: string; // 创建人
  atCreated: Date; // 创建日期
  deleted: boolean; // 是否删除
  isAuth: boolean; //权限
  // 项目概况
  idEngineering: any; // 项目ID
  blockName: string; // 标段名称
  projectSite: string; // 项目地点
  projectApprovalNumber: string; // 工程核准（备案）证编号
  projectScale: string; // 项目规模及特征
  projectScope: string; // 项目承包范围

  advancePaymentType: string; // 预付款类型
  advancePaymentAmount: number; // 预付款值
  balancePaymentType: string; // 尾款类型
  balancePaymentAmount: number; // 尾款值
  qualityMoneyType: string; // 质保金类型
  qualityMoneyAmount: number; // 质保金值

  specialTerms: any[]; // 专用条款
  planStartDate: Date; // 计划开工日期
  planEndDate: Date; // 计划竣工日期
  contractTime: string; // 合同工期
  tenderTime: string; // 招标工期

  matEngDesignEstAmount: number; // 材料和工程设备暂估价金额
  safeCivilizedAmount: number; // 安全文明施工费
  proEngEstAmount: number; // 专业工程暂估价金额
  provisionalAmount: number; // 暂列金额
  changeableAmount: number; // 合同可变更金额
  engineering: { name: string };
  remunerationType: string;
  remunerationScope: string;
  exclusiveTerms: any[];
  contractEffectiveDate: Date;
  planStartTime: any;
  contractDesc: string;
}
