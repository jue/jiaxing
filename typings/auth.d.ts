// 人员管理-权限
export type AuthAction = 'search' | 'create' | 'update' | 'delete';
export type AuthModuleType =
  | 'qualityManagement'
  | 'securityManagement'
  | 'designChangesManagement'
  | 'progressManagement'
  | 'contractManegement'
  | 'modelManegement'
  | 'riskManagement'
  | 'documentManagement';

export interface DBAuthI {
  _id: string; // id
  name: string; // 权限名称
  action: AuthAction; // 权限
  moduleType: AuthModuleType; // 模块名称
  atCreated: Date; // 创建时间
  deleted: boolean; // 是否删除
}
