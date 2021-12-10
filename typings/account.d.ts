// 人员管理-用户
export type Role = 'systemAdmin' | 'companyAdmin' | 'common';
export interface UploadFile {
  _id: string;
  contentType: string;
  originalname: string;
}

export interface DBAccountI {
  _id: string; // id
  userName: string; // 账号
  nickName: string; // 昵称
  password: string; //密码
  idCompany: string; // 单位id
  idDepartment: string; // 部门id
  idsAuth: string[]; // 权限ids
  idJob: string; // 职位id
  phone: string; // 联系方式
  email: string; // 邮箱地址
  atCreated: Date; // 创建时间
  files: UploadFile; // 头像图片
  role: Role; // 管理员
  deleted: boolean; // 是否删除
  signId: string; // 签名id
}

export interface WebCreateAccountI {
  userName: string; // 账号
  idCompany: string; // 单位id
  idDepartment: string; // 部门id
  idsAuth: string[]; // 权限ids
  idJob: string; // 职位id
  phone: string; // 联系方式
  email: string; // 邮箱地址
}

export interface WebUpdateAccountI {
  _id: string;
  userName: string; // 账号
  idCompany: string; // 单位id
  idDepartment: string; // 部门id
  idsAuth: string[]; // 权限ids
  idJob: string; // 职位id
  phone: string; // 联系方式
  email: string; // 邮箱地址
  company?: any;
  signId: string; //签名id
  bind: any;
}

export interface JwtUserI {
  _id: string;
  userName: string;
  nickName: string;
  idsAuth: string[];
  idCompany: string;
  idDepartment: string;
  idJob: string;
  company: {
    _id: string;
    name: string;
    type: string;
  };
  dept: {
    _id: string;
    name: string;
  };
  job: {
    _id: string;
    name: string;
  };
}
