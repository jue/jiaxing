// 组织架构管理-职务
export interface DBJobI {
  _id: string; // id
  name: string; // 职务名称
  parentId: string; // 上级领导id
  path: string; // 职务路径
  idCompany: string; // 所属单位id
  idDepartment: String; // 部门id
  atCreated: Date; // 职务创建时间
  deleted: boolean; // 是否删除
}

export interface WebUpdateJobI {
  _id: string; // id
  name: string; // 职务名称
  parentId: string; // 上级领导id
  path: string; // 职务路径
  idCompany: string; // 所属单位id
  idDepartment: String; // 部门id
}
