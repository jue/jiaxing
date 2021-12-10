// 组织架构管理-部门
export interface DBDepartmentI {
  _id: string; // id
  name: string; // 部门名称
  parentId: string; // 上级部门id
  path: string; // 部门路径
  idCompany: String; // 单位id
  atCreated: Date; // 部门创建时间
  deleted: boolean; // 是否删除
}

export interface WebUpdateDepartmentI {
  _id: string; // id
  name: string; // 部门名称
  parentId: string; // 上级部门id
  path: string; // 部门路径
  idCompany: String; // 单位id
  idsPosition: string[]; //  职务ids
}
