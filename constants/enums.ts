export enum OrganizationTabType {
  Company = 'company',
  Depart = 'depart',
  Job = 'job',
}

export enum OrganizationTabTypeDesc {
  company = '单位设置',
  depart = '部门设置',
  job = '职务设置',
}
export enum AuthAction {
  search = 'search',
  update = 'update',
  create = 'create',
  delete = 'delete',
}

export enum AuthModuleType {
  qualityManagement = 'qualityManagement',
  securityManagement = 'securityManagement',
  designChangesManagement = 'designChangesManagement',
  progressManagement = 'progressManagement',
  contractManegement = 'contractManegement',
  modelManegement = 'modelManegement',
  riskManagement = 'riskManagement',
  documentManagement = 'documentManagement',
}

export enum StatusCode {
  password_error = 'password_error',
  role_off = 'role_off',
  password_valid_success = 'password_valid_success',
  password_valid_fail = 'password_valid_fail',
  role_move_success = 'role_move_success',
  role_insert_success = 'role_insert_success',
}

export const CompanyType = [
  { _id: 'constructionUnit', name: '施工单位' },
  { _id: 'buildingUnit', name: '建设单位' },
  { _id: 'constructionControlUnit', name: '监理单位' },
  { _id: 'costConsultingUnit', name: '造价咨询单位' },
  { _id: 'consultingUnit', name: '咨询单位' },
  { _id: 'designConsultingUnit', name: '设计咨询单位' },
  { _id: 'designUnit', name: '设计单位' },
  { _id: 'supplierUnit', name: '材料设备供应商' },
  { _id: 'monitoringUnit', name: '监测单位' },
  { _id: 'measurementUnit', name: '检测和测量单位' },
  { _id: 'investigationUnit', name: '勘察单位' },
  { _id: 'operationUnit', name: '运营单位' },
];

export enum FilterType {
  Todo = 'todo',
  Done = 'done',
}

export enum FilterDesc {
  todo = '我的代办',
  done = '我的已办',
}

export enum EngineeringTabType {
  All = 'all',
  Approval = 'approval',
  Request = 'request',
}

export enum EngineeringTypeDesc {
  all = '全部',
  approval = '我的审批',
  request = '我的申请',
}
export enum ExaminationTabType {
  All = 'all',
  Approval = 'approval',
  Request = 'request',
}

export enum ExaminationTypeDesc {
  all = '全部',
  approval = '我的审批',
  request = '我的检查',
}

export enum InspectReportType {
  RoutineInspection = 'routineInspection',
  SpecialInspection = 'specialInspection',
  HolidaysInspection = 'holidaysInspection',
  SeasonInspection = 'seasonInspection',
}
export enum InspectReportDesc {
  routineInspection = '例行检查',
  specialInspection = '专项检查',
  holidaysInspection = '节假日检查',
  seasonInspection = '季节性检查',
}
export enum PerilsResultsType {
  Common = 'common',
  Serious = 'serious',
  Great = 'great',
}
export enum PerilsResultsDesc {
  common = '一般',
  serious = '较大',
  great = '重大',
}

export const DataTypeDesc = [
  {
    value: '',
    label: '全部',
  },
  {
    value: 'routineInspection',
    label: '例行检查',
  },
  {
    value: 'specialInspection',
    label: '专项检查',
  },
  {
    value: 'holidaysInspection',
    label: '节假日检查',
  },
  {
    value: 'seasonInspection',
    label: '季节性检查',
  },
];
export const DataResultDesc = [
  {
    value: '',
    label: '全部',
  },
  {
    value: 'common',
    label: '一般变更',
  },
  {
    value: 'serious',
    label: '较大',
  },
  {
    value: 'great',
    label: '重大',
  },
];
export const statusInfo = [
  {
    value: '',
    label: '全部状态',
  },
  {
    value: '2',
    label: '已退回',
  },
  {
    value: '1',
    label: '进行中',
  },
  {
    value: '3',
    label: '已完成',
  },
];
export const level = [
  {
    value: '',
    label: '全部级别',
  },
  {
    value: 'common',
    label: '一般变更',
  },
  {
    value: 'great',
    label: '重大变更',
  },
];

export enum EngineeringChangeType {
  Common = 'constructionUnit',
  DesignUnit = 'designUnit',
  Other = 'other',
}

export enum EngineeringChangeTypeDesc {
  constructionUnit = '施工',
  designUnit = '设计',
  other = '其他',
}
export enum EngineeringLevelTabType {
  Common = 'common',
  Great = 'great',
}

export enum EngineeringLevelTypeDesc {
  common = '一般变更',
  great = '重大变更',
}

export enum NewDataStatus {
  Normal = 'Normal',
  Tashed = 'Tashed',
}

export enum DataStatusDesc {
  Normal = '全部',
  Tashed = '回收站',
}
export enum WorkBenchDesc {
  quality = '质量检查概况',
  hidden = '隐患排查情况',
}
export enum WorkBenchType {
  Quality = 'quality',
  Hidden = 'hidden',
}
export enum CreateQualityInspectionDesc {
  Name = '请输入检查主题',
  Desc = '请输入检查描述',
  Type = '请输入检查类型',
  PerilsTime = '请选择检查日期',
  PartCompanys = '请输入参与单位',
  PerilsResults = '请选择检查结果',
  ProblemName = '请输入问题说明',
  Remark = '请输入整改意见',
  EndTime = '请选择整改截止日期',
  // EngineeringInfo = '请选择整改执行单位',
}
export const DataStateDesc = [
  { key: 1, value: ' 整改中' },
  { key: 2, value: '已驳回' },
  { key: 3, value: '已取消' },
  { key: 4, value: '已整改' },
];
export const ConstructionStateDesc = [
  { key: 1, value: ' 审批中' },
  { key: 2, value: '已驳回' },
  { key: 3, value: '已取消' },
  { key: 4, value: '已通过' },
];

export enum SchemeType {
  SpecialConstructionScheme = 'specialConstructionScheme',
  SpecialConstructionSchemeOver = 'specialConstructionSchemeOver',
  Emergency = 'emergency',
}
export enum SchemeTypeDesc {
  specialConstructionScheme = '专项施工方案',
  specialConstructionSchemeOver = '专项施工方案(超规模)',
  emergency = '应急预案',
}
export const scheme = [
  {
    value: '',
    label: '全部类型',
  },
  {
    value: 'specialConstructionScheme',
    label: '专项施工方案',
  },
  {
    value: 'specialConstructionSchemeOver',
    label: '专项施工方案(超规模)',
  },
  {
    value: 'emergency',
    label: '应急预案',
  },
];
export enum DocumentFileType {
  NewFile = 'newFile',
  RelatedForm = 'relatedForm',
}
export enum DocumentFileDesc {
  newFile = '上传新附件',
  relatedForm = '关联现有表单',
}
