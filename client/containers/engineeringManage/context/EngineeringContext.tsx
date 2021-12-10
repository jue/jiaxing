import { createContext, useState, useMemo, useEffect, useContext } from 'react';
import { EngineeringTabType } from '../../../../constants/enums';
import engineeringSvc from '../../../services/EngineeringSvc';
import contractSvc from '../../../services/ContractSvc';
import auditingSvc from '../../../services/AuditingSvc';
import engineeringChangeSvc from '../../../services/EngineeringChangeSvc';
import moment from 'moment';
import filesSvc from '../../../services/filesSvc';
import { FRONT_END_DBModelI } from '../../../../typings/model';
import { useRouter } from 'next/router';
import forgeSvc from '../../../services/forgeSvc';
import ModelModal from '../components/ModelModal';

interface EngineeringContextI {
  engineeringInfo: any;
  setEngineeringInfo: Function;
  handleConfirm: Function;
  handleUpdate: Function;
  engineeringInfos: any;
  setEngineeringInfos: Function;

  projectInfos: any;
  setProjectInfos: Function;
  queryProjects: Function;

  contractInfos: any;
  setContractInfos: Function;
  queryContracts: Function;
  nextAuditing: any;
  setNextAuditing: Function;
  queryAuditing: Function;

  currentTab: string;
  setCurrentTab: Function;
  query: {
    page: number;
    limit: number;
    idCreatedBy?: boolean;
    myself?: boolean;
    status?: string;
  };
  count: number;
  setCount: Function;
  setQuery: Function;
  updateEngineeringtMsg: any;
  setUpdateEngineeringtMsg: Function;

  successDialog: boolean;
  setSuccessDialog: Function;
  saveFiles: Function;
  handleDeleteFile: Function;
  fileDialog: any;
  setFileDialog: Function;
  createModelInfo: any;
  setCreateModelInfo: Function;
  openBIM: boolean;
  setOpenBIM: Function;
  isLoading: boolean;
  setIsLoading: Function;
  modelPathName: string;
  setModelPathName: Function;
  handleViewQuery: Function;
  saveBImfiles: Function;
  diffModelFile: any;
  setDiffModelFile: Function;
  engineeringProcess: any;
  setEngineeringProcess: Function;
  QueryEngineeringProcess: Function;
}

const defaultContext: EngineeringContextI = {
  engineeringInfo: {},
  setEngineeringInfo() {},
  handleConfirm() {},
  handleUpdate() {},
  engineeringInfos: [],
  setEngineeringInfos() {},

  projectInfos: {},
  setProjectInfos() {},
  queryProjects() {},

  contractInfos: [],
  setContractInfos() {},
  queryContracts() {},

  nextAuditing: {},
  setNextAuditing() {},
  queryAuditing() {},

  currentTab: EngineeringTabType.Request,
  setCurrentTab() {},
  query: {
    page: 0,
    limit: 10,
    // idCreatedBy: false,
    // myself: false,
    // status:''
  },
  setQuery() {},
  count: 0,
  setCount() {},
  updateEngineeringtMsg: {},
  setUpdateEngineeringtMsg() {},
  successDialog: false,
  setSuccessDialog() {},
  saveFiles() {},
  handleDeleteFile() {},
  fileDialog: '',
  setFileDialog() {},
  createModelInfo: {
    files: {},
  },
  setCreateModelInfo() {},
  openBIM: false,
  setOpenBIM() {},
  isLoading: false,
  setIsLoading() {},
  modelPathName: '',
  setModelPathName() {},
  handleViewQuery() {},
  saveBImfiles() {},
  diffModelFile: '',
  setDiffModelFile() {},
  engineeringProcess: {},
  setEngineeringProcess() {},
  QueryEngineeringProcess() {},
};

export const EngineeringContext = createContext<EngineeringContextI>(
  defaultContext
);

export const EngineeringContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const [engineeringInfo, setEngineeringInfo] = useState(
    defaultContext.engineeringInfo
  );
  const [engineeringInfos, setEngineeringInfos] = useState(
    defaultContext.engineeringInfos
  );
  const [currentTab, setCurrentTab] = useState(defaultContext.currentTab);
  const [query, setQuery] = useState(defaultContext.query);
  const [count, setCount] = useState(defaultContext.count);
  const [updateEngineeringtMsg, setUpdateEngineeringtMsg] = useState(
    defaultContext.updateEngineeringtMsg
  );

  const [projectInfos, setProjectInfos] = useState(defaultContext.projectInfos);
  const [contractInfos, setContractInfos] = useState(
    defaultContext.contractInfos
  );
  const [nextAuditing, setNextAuditing] = useState(defaultContext.nextAuditing);
  const [successDialog, setSuccessDialog] = useState(
    defaultContext.successDialog
  );
  const [fileDialog, setFileDialog] = useState(defaultContext.fileDialog);
  const [createModelInfo, setCreateModelInfo] = useState(
    defaultContext.createModelInfo
  );
  const [openBIM, setOpenBIM] = useState(defaultContext.openBIM);
  const [isLoading, setIsLoading] = useState(defaultContext.isLoading);
  const [modelPathName, setModelPathName] = useState(
    defaultContext.modelPathName
  );
  const [diffModelFile, setDiffModelFile] = useState(
    defaultContext.diffModelFile
  );
  const [engineeringProcess, setEngineeringProcess] = useState(
    defaultContext.engineeringProcess
  );
  const [nodeFile, setNodeFile] = useState([]);
  const [changeAccordingFileList, setChangeAccordingFileList] = useState([]);

  //上传文件
  const saveBImfiles = async file => {
    setIsLoading(true);

    try {
      forgeSvc
        .create(file)
        .then(data => {
          if (data.status !== 'error') {
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
            setIsLoading(false);
          }
        })
        .catch(res => {
          const status = res.response.status;
          setIsLoading(false);

          if (status) {
            ModelModal('模型上传失败');
          }
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const saveFiles = async (grid, file) => {
    try {
      let changeAccordingFile: any = changeAccordingFileList || [];

      let nodeArr = [...nodeFile];
      const data = await filesSvc.upload(file, '1');

      if (data.code === 200) {
        data.data.map(item => {
          if (grid === 'changeAccordingFile') {
            changeAccordingFile.push({
              ...item,
              attachmentType: grid,
            });
          } else {
            nodeArr.push({
              ...item,
              attachmentType: grid,
            });
          }
        });
        setNodeFile(nodeArr);
        setChangeAccordingFileList(changeAccordingFile);

        await setUpdateEngineeringtMsg({
          ...updateEngineeringtMsg,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //BIM预览
  const handleViewQuery = async modelId => {
    const data = await forgeSvc.modelDiff({
      primaryId: modelId.letfBIM._id,
      diffId: modelId.rightBIM._id,
    });
    setModelPathName(data);
  };

  //流程图
  const QueryEngineeringProcess = async account => {
    let newExecutiveDept = '';
    if (account.company && account.company.name === '建设单位') {
      newExecutiveDept = account.dept && account.dept.name;
    } else {
      newExecutiveDept = account.company && account.company.name;
    }
    // const data = await auditingSvc.getAutiting({
    //   // initiateDept: newExecutiveDept,
    //   _id: engineeringInfo._id,
    // });
    // setEngineeringProcess(data);
  };

  const handleDeleteFile = (list, type) => {
    let dateArr = ['changeAccordingFile', 'changeDrawings'];
    //上传文件变量key
    let files = dateArr.find(item => item === type);
    if (files) {
      setEngineeringInfo({
        ...engineeringInfo,
        [files]: list,
      });
    } else {
      setNodeFile(list);
    }
  };

  const queryProjects = async () => {
    try {
      const data = await engineeringSvc.search(query);
      setProjectInfos(data);
    } catch (error) {
      console.log(error);
    }
  };

  const queryContracts = async id => {
    try {
      const data = await contractSvc.search({
        idEngineering: id,
      });
      if (data.code === 200) {
        setContractInfos(data.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const queryAuditing = async (account, status, info) => {
    try {
      let newExecutiveDept = '';
      if (account.company && account.company.name === '建设单位') {
        newExecutiveDept = account.dept && account.dept.name;
      } else {
        newExecutiveDept = account.company && account.company.name;
      }
      // const data = await auditingSvc.getNextAuditing({
      //   idExecutive: status === 'create' ? '' : account._id,
      //   executiveDept:
      //     status === 'create' ? newExecutiveDept : info.executiveDept,
      //   action: status,
      //   _id: status === 'create' ? '' : info._id,
      //   companyType: status === 'create' ? account.company.type : '',
      // });
      // if (data.code === 1004) {
      //   ModelModal('您暂无创建变更权限');
      //   return;
      // }
      // if (data.code === 1002) {
      //   ModelModal('发起部门不存在');
      //   return;
      // }
      // await setNextAuditing(data.data);
      if (status === 'create') {
        await setEngineeringInfo({
          ...engineeringInfo,
          initiateDept: newExecutiveDept,
          initiator: account.userName,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirm = async account => {
    try {
      let time: any = moment(engineeringInfo.endTime || new Date()).format(
        'YYYY-MM-DD'
      );
      engineeringChangeSvc
        .create({
          ...engineeringInfo,
          preAction: [account.company && account.company.name, 'pass'],
          endTime: time,
        })
        .then(data => {
          if (data.code === 200) {
            setSuccessDialog(true);
          } else if (data.msg === '字典数据为空') {
            ModelModal('暂没有权限新建变更');
          } else {
            ModelModal('新建变更失败');
          }
        });

      // setTimeout(() => {
      //   router.push('/engineering/changeList');
      // }, 1500);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (status, attchmentFile, _id) => {
    try {
      await engineeringChangeSvc.update({
        ...updateEngineeringtMsg,
        _id: _id,
        status: status,
        nodeFiles: attchmentFile,
      });
      // await QueryEngineering({ myself: true });
    } catch (error) {
      console.log(error);
    }
  };

  const QueryEngineering = async (params?: any) => {
    const data: any = await engineeringChangeSvc.search({
      ...query,
      ...params,
    });
    const list = data.data;
    if (data.code === 200) {
      setCount(list.count);
      setEngineeringInfos(list.data);
    }
  };
  useEffect(() => {
    if (currentTab === EngineeringTabType.Request) {
      QueryEngineering({ idCreatedBy: true });
    } else if (currentTab === EngineeringTabType.All) {
      QueryEngineering({});
    } else {
      QueryEngineering({ myself: true });
    }
  }, [query, currentTab]);

  useEffect(() => {
    setEngineeringInfo({
      ...engineeringInfo,
      nodeFiles: [...nodeFile],
    });
  }, [nodeFile]);

  useEffect(() => {
    setEngineeringInfo({
      ...engineeringInfo,
      changeAccordingFile: changeAccordingFileList,
    });
  }, [changeAccordingFileList]);

  const providerValue = useMemo(() => {
    return {
      engineeringInfo,
      setEngineeringInfo,
      handleConfirm,
      handleUpdate,
      projectInfos,
      setProjectInfos,
      queryProjects,
      contractInfos,
      setContractInfos,
      queryContracts,
      nextAuditing,
      setNextAuditing,
      queryAuditing,
      currentTab,
      setCurrentTab,
      query,
      setQuery,
      count,
      setCount,
      updateEngineeringtMsg,
      setUpdateEngineeringtMsg,
      successDialog,
      setSuccessDialog,
      engineeringInfos,
      setEngineeringInfos,
      saveFiles,
      handleDeleteFile,
      fileDialog,
      setFileDialog,
      createModelInfo,
      setCreateModelInfo,
      openBIM,
      setOpenBIM,
      isLoading,
      setIsLoading,
      modelPathName,
      setModelPathName,
      handleViewQuery,
      saveBImfiles,
      diffModelFile,
      setDiffModelFile,
      engineeringProcess,
      setEngineeringProcess,
      QueryEngineeringProcess,
    };
  }, [
    engineeringInfo,
    currentTab,
    query,
    count,
    updateEngineeringtMsg,
    projectInfos,
    contractInfos,
    nextAuditing,
    successDialog,
    engineeringInfos,
    fileDialog,
    createModelInfo,
    openBIM,
    isLoading,
    modelPathName,
    diffModelFile,
    engineeringProcess,
  ]);

  return (
    <EngineeringContext.Provider value={providerValue}>
      {children}
    </EngineeringContext.Provider>
  );
};

export default EngineeringContextProvider;
