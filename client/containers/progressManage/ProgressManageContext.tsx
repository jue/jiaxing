import { createContext, useMemo, useState, useEffect } from 'react';

import ScriptGanttAssigningResources from './scriptGant/ScriptGanttAssigningResources';
import progressSvc from '../../services/ProgressSvc';
import { DBProgressI } from '../../../typings/progress';
import filesSvc from '../../services/filesSvc';
import { message } from 'antd';
export interface ProgressManageContextI {
  timeTypeIndex: number;
  setTimeTypeIndex(number);

  openModel: boolean;
  setOpenModel(boolean);

  ganttScripts: ScriptGanttAssigningResources;
  files: any;
  saveFiles({});
  companies: any;
  setCompanies(any);
}

export const ProgressManageContext = createContext<ProgressManageContextI>({
  timeTypeIndex: 0,
  setTimeTypeIndex: null,

  openModel: false,
  setOpenModel: null,

  ganttScripts: null,
  files: [],
  saveFiles: null,
  companies: [],
  setCompanies: null,
});
const ProgressManageContextProvder = ({ children }) => {
  const [timeTypeIndex, setTimeTypeIndex] = useState(1);
  const [openModel, setOpenModel] = useState(false);
  const [files, saveFiles] = useState([]);
  const [companies, setCompanies] = useState([]);
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
        saveFiles,
        companies,
        setCompanies,
      }}
    >
      {children}
    </ProgressManageContext.Provider>
  );
};

export default ProgressManageContextProvder;
