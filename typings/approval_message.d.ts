// 个人中心-消息列表

export interface Receivers {
  receiver: string;
  receiverName: string;
}

export interface WebUpdateMessageI {
  title: string;
  content: string;
  attachments: string[];
  receivers: Receivers[];
  cc: Receivers[];
  operatorId: string;
  operatorName: string;
  companies: string[];
  departments: string[];
  ccCompanies: string[];
  ccDepartments: string[];
}
