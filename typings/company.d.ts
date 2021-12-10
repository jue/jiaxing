// 组织架构管理-单位
export interface DBCompanyI {
  _id: string; // id
  name: string; // 单位名称
  parentId: string; // 上级单位id
  path: string; // 单位路径
  type: string; // 单位类型
  atCreated: Date; // 单位创建时间
  deleted: boolean; // 是否删除
}

export interface WebUpdateCompanyI {
  _id: string; // id
  name: string; // 单位名称
  parentId: string; // 上级单位id
  path: string; // 单位路径
  type: string; // 单位类型
  idsDepartment: string[]; // 部门ids
}
