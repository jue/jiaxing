// 模型管理
export interface UploadFile {
  _id: string;
  contentType: string;
  originalname: string;
  status?: string;
  idFile: string;
}
export interface DBModelI {
  _id: string; // id
  idEngineering: string; // 工程 id
  idContract: string; // 合同 ID
  name: string; // 模型名称
  version: number; // 版本号
  number: string; // 模型编码
  type: string; // 文件类型 model | drawing
  size: number; // 文件大小
  files: UploadFile; // 模型文件
  atCreated: Date; // 模型创建时间
  idCreatedBy: string; // 创建人
  deleted: boolean; // 是否删除
}

export interface FRONT_END_DBModelI {
  _id: string; // id
  idEngineering: string; // 工程 id
  idContract: string; // 合同 ID
  name: string; // 模型名称
  version: number; // 版本号
  type: string; // 文件类型 model | drawing
  size: number; // 文件大小
  files: Partial<UploadFile>; // 模型文件
  atCreated: Date; // 模型创建时间
  idCreatedBy: string; // 创建人
  deleted: boolean; // 是否删除
}
