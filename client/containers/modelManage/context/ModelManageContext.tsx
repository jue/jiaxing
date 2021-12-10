import { createContext, useEffect, useState, useMemo } from 'react';
import forgeSvc from '../../../services/forgeSvc';
import engineeringSvc from '../../../services/EngineeringSvc';
import contractSvc from '../../../services/ContractSvc';
import modelSvc from '../../../services/modelSvc';
import { FRONT_END_DBModelI, UploadFile } from '../../../../typings/model';
import { useRouter } from 'next/router';
import { ModelRemindModal } from '../ModelModal';

export interface ModelManageContextI {
  saveFiles: Function;
  projectInfos: any;
  setProjectInfos: Function;
  contractInfos: any;
  setContractInfos: Function;
  modelInfos: FRONT_END_DBModelI[];
  setModelInfos: Function;
  createModelInfo: any;
  setCreateModelInfo: Function;
  handleCreateModelInfo: Function;
  query: {
    page: number;
    limit: number;
    idEngineering: string;
    idContract: string;
  };
  setQuery: Function;
  modelTable: any;
  setModelTable: Function;
  count: number;
  setCount: Function;
  queryModelVersion: Function;
  handleViewQuery: Function;
  deleteModelItem: Function;
  queryContracts: Function;
  filesList: any;
  setFilesList: Function;
  queryModelTable: Function;
  model: {
    pathname: string;
    modelname: string;
  };
  setModel: Function;
  isLoading: boolean;
  setIsLoading: Function;
  disabled: boolean;
  setDisabled: Function;
  bimModelCompared: Partial<FRONT_END_DBModelI>;
  setBimModelCompared: Function;
  modelAllList: FRONT_END_DBModelI[];
  handleModelDiff: Function;
}

const defaultModelManageContext: ModelManageContextI = {
  saveFiles() {},
  projectInfos: [],
  setProjectInfos() {},
  contractInfos: [],
  setContractInfos() {},
  modelInfos: [],
  setModelInfos() {},
  createModelInfo: {
    files: {},
  },
  setCreateModelInfo() {},
  handleCreateModelInfo() {},
  query: {
    page: 0,
    limit: 10,
    idEngineering: '',
    idContract: '',
  },
  setQuery() {},
  modelTable: [{ name: '' }],
  setModelTable() {},
  count: 0,
  setCount() {},
  queryModelVersion() {},
  handleViewQuery() {},
  deleteModelItem() {},
  queryContracts() {},
  filesList: [],
  setFilesList() {},
  queryModelTable() {},
  model: {
    pathname: '',
    modelname: '',
  },
  setModel() {},
  isLoading: false,
  setIsLoading() {},
  disabled: false,
  setDisabled() {},
  bimModelCompared: {},
  setBimModelCompared() {},
  modelAllList: [],
  handleModelDiff() {},
};

export const ModelManageContext = createContext<ModelManageContextI>(
  defaultModelManageContext
);

const ModelManageContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [projectInfos, setProjectInfos] = useState(
    defaultModelManageContext.projectInfos
  );
  const [contractInfos, setContractInfos] = useState(
    defaultModelManageContext.contractInfos
  );
  const [modelInfos, setModelInfos] = useState(
    defaultModelManageContext.modelInfos
  );
  const [createModelInfo, setCreateModelInfo] = useState(
    defaultModelManageContext.createModelInfo
  );
  const [query, setQuery] = useState(defaultModelManageContext.query);
  const [modelTable, setModelTable] = useState(
    defaultModelManageContext.modelTable
  );
  const [count, setCount] = useState(defaultModelManageContext.count);
  const [model, setModel] = useState(defaultModelManageContext.model);
  const [isLoading, setIsLoading] = useState(
    defaultModelManageContext.isLoading
  );
  const [disabled, setDisabled] = useState(defaultModelManageContext.disabled);
  const [bimModelCompared, setBimModelCompared] = useState(
    defaultModelManageContext.bimModelCompared
  );
  const [modelAllList, setModelAllList] = useState(
    defaultModelManageContext.modelAllList
  );

  const [filesList, setFilesList] = useState([]);

  const router = useRouter();

  const saveFiles = file => {
    setIsLoading(true);

    forgeSvc
      .create(file)
      .then(data => {
        if (data.status !== 'error') {
          setIsLoading(false);
          setCreateModelInfo({
            ...createModelInfo,
            files: {
              _id: data._id,
              idFile: data.idFile,
              contentType: 'model',
              originalname: data.filename,
            },
            size: data.fileSize,
          });
        }
      })
      .catch(res => {
        const status = res.response.status;
        setIsLoading(false);

        if (status) {
          ModelRemindModal('模型上传失败');
        }
      });
  };

  const queryProjectInfos = async () => {
    try {
      const data = await engineeringSvc.search({});
      setProjectInfos(data);
    } catch (error) {
      console.log(error);
    }
  };

  const queryContracts = async (id?) => {
    try {
      const data = await contractSvc.search({ idEngineering: id });
      if (data.code === 200) {
        setContractInfos(data.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateModelInfo = () => {
    modelSvc
      .create({ ...createModelInfo })
      .then(data => {
        if (data.code === 1003) {
          ModelRemindModal('版本已存在，请修改');
          return;
        }
        setDisabled(true);
        setTimeout(() => {
          router.push('/model/list');
        }, 3000);
      })
      .catch(data => {
        setDisabled(false);
        const res = data.response;
        if (res.status === 500) {
          ModelRemindModal('模型上传失败');
          return;
        }
      });
  };

  const queryModelTable = async () => {
    try {
      const data = await modelSvc.query({ ...query });
      setModelTable(data.data);
      setCount(data.count);
    } catch (error) {
      console.log(error);
    }
  };

  const queryModelVersion = async (last, name, idContract?, end?) => {
    try {
      const data = await modelSvc.query({
        last: last,
        name: name,
        idContract: idContract,
        end: end,
      });
      let list =
        data.count === 0 ? defaultModelManageContext.modelTable : data.data;
      if (last && data) {
        setCreateModelInfo({
          ...createModelInfo,
          name: name,
          version: data[0].version,
        });
      } else {
        setModelAllList([...list]);
        setModelTable([...list]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteModelItem = async _id => {
    try {
      const data = await modelSvc.delete(_id);
      if (data.data === 'success') {
        queryModelTable();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewQuery = async (modelId, modelname?) => {
    const data = await forgeSvc.view(modelId);
    setModel({ modelname: modelname, pathname: data });
  };

  const handleModelDiff = async modelId => {
    const data = await forgeSvc.modelDiff({
      primaryId: modelId.letfBIM._id,
      diffId: modelId.rightBIM._id,
    });
    setModel({ ...model, pathname: data });
  };

  useEffect(() => {
    queryProjectInfos();
  }, []);

  useEffect(() => {
    if (router.pathname.includes('list')) {
      queryModelTable();
      queryContracts();
    }
  }, [query]);

  useEffect(() => {
    if (!router.pathname.includes('list')) {
      queryModelVersion('', '');
    }
  }, [bimModelCompared._id]);

  let providerValue = useMemo(() => {
    return {
      saveFiles,
      projectInfos,
      setProjectInfos,
      contractInfos,
      setContractInfos,
      createModelInfo,
      setCreateModelInfo,
      handleCreateModelInfo,
      query,
      setQuery,
      modelTable,
      setModelTable,
      count,
      setCount,
      modelInfos,
      setModelInfos,
      queryModelVersion,
      handleViewQuery,
      deleteModelItem,
      queryContracts,
      filesList,
      setFilesList,
      queryModelTable,
      model,
      setModel,
      isLoading,
      setIsLoading,
      disabled,
      setDisabled,
      bimModelCompared,
      setBimModelCompared,
      modelAllList,
      handleModelDiff,
    };
  }, [
    projectInfos,
    contractInfos,
    createModelInfo,
    query,
    modelTable,
    count,
    modelInfos,
    filesList,
    model,
    isLoading,
    disabled,
    bimModelCompared,
    modelAllList,
  ]);

  return (
    <ModelManageContext.Provider value={providerValue}>
      {children}
    </ModelManageContext.Provider>
  );
};

export default ModelManageContextProvider;
