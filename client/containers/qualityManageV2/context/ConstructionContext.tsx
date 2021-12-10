import React, {
  createContext,
  useEffect,
  useState,
  useMemo,
  useContext,
} from 'react';
import { ExaminationTabType } from '../../../../constants/enums';
import { WebConstructionSchemeI } from '../../../../typings/construction_scheme.d';
import filesSvc from '../../../services/filesSvc';
import constructionSchemeSvc from '../../../services/ConstructionSchemeSvc';
import { message } from 'antd';
export interface ConstructionContextI {
  constructionInfo: Partial<WebConstructionSchemeI>;
  setConstructionInfo: Function;
  constructionList: WebConstructionSchemeI[];
  setConstructionList: Function;
  currentTab: string;
  setCurrentTab: Function;
  query: {
    page: number;
    limit: number;
    idCreatedBy?: boolean;
    myself?: boolean;
    _id?: string;
    name?: string;
  };
  count: number;
  setCount: Function;
  setQuery: Function;
  saveFiles: Function;
  handleConfirm: Function;
  handleQuery: Function;
  handleUpdate: Function;
  taskinfo: any;
  setTaskinfo: Function;
}
const defaultContext: ConstructionContextI = {
  constructionInfo: { nodeFiles: [] },
  setConstructionInfo() {},
  constructionList: [],
  setConstructionList() {},
  currentTab: ExaminationTabType.All,
  setCurrentTab() {},
  query: {
    page: 0,
    limit: 10,
  },
  setQuery() {},
  count: 0,
  setCount() {},
  saveFiles() {},
  handleConfirm() {},
  handleQuery() {},
  handleUpdate() {},
  taskinfo: [],
  setTaskinfo() {},
};

export const ConstructionContext = createContext<ConstructionContextI>(
  defaultContext
);

export const ConstructionContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [taskinfo, setTaskinfo] = useState<any>({});

  const [currentTab, setCurrentTab] = useState(defaultContext.currentTab);
  const [query, setQuery] = useState(defaultContext.query);
  const [count, setCount] = useState(defaultContext.count);
  const [constructionInfo, setConstructionInfo] = useState(
    defaultContext.constructionInfo
  );
  const [constructionList, setConstructionList] = useState(
    defaultContext.constructionList
  );

  const saveFiles = async (file, type, attachmentType) => {
    let constructionFiles = constructionInfo.nodeFiles || [];
    const data = await filesSvc.upload(file, type);

    data.data[0].attachmentType = attachmentType;
    data.data.map(item => {
      constructionFiles.push(item);
    });
    setConstructionInfo({
      ...constructionInfo,
      nodeFiles: constructionFiles,
    });
  };

  //创建施工管理
  const handleConfirm = async () => {
    constructionSchemeSvc
      .create({ ...constructionInfo })
      .then(data => {
        if (data.code === 4001) {
          return message.error(data.msg);
        }
        setConstructionInfo({});
        handleQuery();
      })
      .catch(error => {
        message.error(error.msg);
      });
  };
  const handleQuery = async (params?: any) => {
    try {
      const data = await constructionSchemeSvc.query({
        ...query,
        ...params,
      });

      await setConstructionList(data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (status, attchmentFile, _id) => {
    try {
      const newNodeFiles = constructionInfo.nodeFiles.concat(attchmentFile);
      await constructionSchemeSvc.update({
        // ...updateEngineeringtMsg,
        _id: _id,
        status: status,
        nodeFiles: attchmentFile,
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (currentTab === ExaminationTabType.Request) {
      handleQuery({ idCreatedBy: true });
    } else if (currentTab === ExaminationTabType.All) {
      handleQuery();
    } else {
      handleQuery({ myself: true });
    }
  }, [query, currentTab]);

  const providerValue = useMemo(() => {
    return {
      currentTab,
      setCurrentTab,
      query,
      setQuery,
      count,
      setCount,
      constructionInfo,
      setConstructionInfo,
      saveFiles,
      handleConfirm,
      handleQuery,
      constructionList,
      setConstructionList,
      handleUpdate,
      taskinfo,
      setTaskinfo,
    };
  }, [currentTab, query, count, constructionInfo, constructionList, taskinfo]);
  return (
    <ConstructionContext.Provider value={providerValue}>
      {children}
    </ConstructionContext.Provider>
  );
};
