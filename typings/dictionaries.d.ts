export interface DBDictionariesI {
  _id: string; // id
  dataType: string; // 字典类型
  chnWd: string; // 字典-中文
  usWd: string; // 字典-英文
  dataValue: string; // 字典默认值
  remark: string; // 描述
  atCreated: Date; // 创建时间
}
