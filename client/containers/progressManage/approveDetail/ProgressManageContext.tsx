import { createContext, useMemo, useState, useEffect } from 'react';

import ScriptGanttAssigningResources from './scriptGant/ScriptGanttAssigningResources';
import progressSvc from '../../../services/ProgressSvc';
import { DBProgressI } from '../../../../typings/progress';
import filesSvc from '../../../services/filesSvc';
import { message } from 'antd';
export interface ProgressManageContextI {
  timeTypeIndex: number;
  setTimeTypeIndex(number);

  openModel: boolean;
  setOpenModel(boolean);

  ganttScripts: ScriptGanttAssigningResources;
  files: any;
  saveFile({});
  approvalInfo: any;
  setApprovalInfo({});
}

export const ProgressManageContext = createContext<ProgressManageContextI>({
  timeTypeIndex: 0,
  setTimeTypeIndex: null,

  openModel: false,
  setOpenModel: null,

  ganttScripts: null,
  files: [],
  saveFile: null,
  approvalInfo: {},
  setApprovalInfo: null,
});

const ProgressManageContextProvder = ({ children }) => {
  const [timeTypeIndex, setTimeTypeIndex] = useState(0);
  const [openModel, setOpenModel] = useState(false);
  const [files, saveFile] = useState([]);
  const [approvalInfo, setApprovalInfo] = useState({
    num: 0,
    author: '',
    actionType: '',
    date: '',
  });
  let ganttScripts = useMemo(() => {
    return typeof window !== 'undefined'
      ? new ScriptGanttAssigningResources()
      : null;
  }, []);
  return (
    <ProgressManageContext.Provider
      value={{
        timeTypeIndex,
        setTimeTypeIndex,
        openModel,
        setOpenModel,
        ganttScripts,
        files,
        saveFile,
        approvalInfo,
        setApprovalInfo,
      }}
    >
      {children}
    </ProgressManageContext.Provider>
  );
};

export default ProgressManageContextProvder;
