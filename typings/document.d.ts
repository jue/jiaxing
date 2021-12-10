import { NewDataStatus } from '../constants/enums';

export interface Documents {
  _id: string;
  idCategory: string;
  idFile: string;
  documentNo: string;
  name: string; // 文件名
  idCreatedBy: string;
  atCreated: Date;
  isFavorite: Boolean;
  size: number;
  dataStatus: NewDataStatus; // 是否是回收站数据
}

export interface DocumentCategory {
  _id: string;
  name: string;
  idParent: string;
  atCreated: Date;
  idCreatedBy: string;
  deleted: boolean;
  idFile: string;
  category: any;
}
