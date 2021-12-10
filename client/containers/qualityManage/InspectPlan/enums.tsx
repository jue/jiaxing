export const method = [
  { label: '请选择检查方式', value: '' },
  { label: '日常检查', value: 'day' },
  { label: '专项检查', value: 'special' },
  { label: '抽检', value: 'spot' },
];

export const type = [
  { label: '请选择检查方式', value: '' },
  { label: '施工单位自检', value: 'constructionUnit' },
  { label: '监理单位检查', value: 'supervisionUnit' },
  { label: '建设单位检查', value: 'developmentUnit' },
  { label: '项目联合检查', value: 'projectJoint' },
  { label: '其他', value: 'other' },
];

export const frequency = [
  { label: '请选择', value: '' },
  { label: '每周', value: 'week' },
  { label: '每月', value: 'month' },
  { label: '每季度', value: 'quarter' },
  { label: '每年', value: 'year' },
  { label: '不定期', value: 'withOutday' },
];

export const InspectionMethod = {
  day: '日常检查',
  special: '专项检查',
  spot: '抽检',
};
export const InspectionFrequency = {
  week: '每周',
  month: '每月',
  quarter: '每季度',
  year: '每年',
  withOutday: '不定期',
};
export const InspectionType = {
  constructionUnit: '施工单位自检',
  supervisionUnit: '监理单位检查',
  developmentUnit: '建设单位检查',
  projectJoint: '项目联合检查',
  other: '其他',
};
