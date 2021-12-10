type Yuan = number;

interface DBEngineeringI {
  _id: string; // ID
  name: string; // 项目名称
  changeableAmount: Yuan; // 可变更金额
  changedAmount: Yuan; // 已变更金额
  changingAmount: Yuan; // 正在变更金额
  head: string; // 负责人
  phone: string; // 电话
  constructionUnit: string; //建设单位
  changedCount: number; // 已变更次数
  changingCount: number; // 正在变更次数
  idCreatedBy: string; // 创建人
  atCreated: Date; // 创建时间
  deleted: boolean; // 是否删除
}

export interface CreateEngineeringInfoI {
  name: string;
  changeableAmount: Yuan; // 万元
}
