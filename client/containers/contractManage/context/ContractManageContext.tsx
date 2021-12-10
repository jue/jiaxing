import { createContext, useEffect, useMemo, useState, useContext } from 'react';
import { DBContractI, WEBDBContractI } from '../../../../typings/contract';
import { useRouter } from 'next/router';
import filesSvc from '../../../services/filesSvc';
import contractSvc from '../../../services/ContractSvc';
import { AuthContextI, AuthContext } from '../../../contexts/AuthContext';
import moment from 'moment';
import { message } from 'antd';
import engineeringSvc from '../../../services/EngineeringSvc';

message.config({ maxCount: 1, top: 100 });

interface Progress {
  _id: string;
  progressItem: number;
}
interface TermsComparison {
  content: string;
  amount: number;
}
interface UploadFile {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  resourceSize: number;
  resourceDisplaySize: string;
  attachmentType: string;
}

export interface ContractManageContextI {
  contractMsg: Partial<WEBDBContractI>;
  setContractMsg: Function;
  contractMsgs: DBContractI[];
  setContractMsgs: Function;
  handleContractCreate: Function;
  saveFiles: Function;
  vfileLists: any;
  setFfileLists: Function;
  handleDeleteFile: Function;
  progress: Progress[];
  setProgress: Function;
  query: any;
  setQuery: Function;
  count: number;
  successsPopver: boolean;
  nextContractAuditing: any;
  auditContractDetail: Partial<WEBDBContractI>;
  setAuditContractDetail: Function;
  updateContractMsg: any;
  setUpdateContractMsg: Function;
  handleContractUpdate: Function;
  nextNode: any;
  setNextNode: Function;
  contractStatus: string;
  setContractStatus: Function;
  openTermsComparison: boolean;
  setOpenTermsComparison: Function;
  termsComparisonArray: TermsComparison[];
  setTermsComparisonArray: Function;
  tabIndex: number;
  setTabIndex: Function;
  engiName: string;
  setEngiName: Function;
  open: {
    engiOpen: boolean;
    conOpen: boolean;
    amount: boolean;
  };
  setOpen: Function;
  specialTerms: boolean;
  setSpecialTerms: Function;
  end: number;
  setEnd: Function;
  handleHistoryCreate: Function;
  projectInfos: any;
  setProjectInfos: Function;
  handleHistorySearch: Function;
}

export const defaultContext: ContractManageContextI = {
  contractMsg: {
    payTerms: [
      { payContent: '', payAmount: '', payPercentage: '', payTerms: '' },
    ],
    specialTerms: [],
    partyB: [
      {
        partyB: '',
        partyBLegalPerson: '',
        partyBNumber: '',
      },
    ],
    nodeFiles: [],
  },
  setContractMsg() {},
  contractMsgs: [],
  setContractMsgs() {},
  handleContractCreate() {},
  saveFiles() {},
  vfileLists: [],
  setFfileLists() {},
  handleDeleteFile() {},
  progress: [],
  setProgress() {},
  query: {
    page: 0,
    limit: 10,
    contractType: '',
    idEngineering: '',
    status: '',
    myself: '',
    idCreatedBy: '',
    tendertype: '',
  },
  setQuery() {},
  count: 0,
  successsPopver: false,
  nextContractAuditing: {},
  auditContractDetail: {},
  setAuditContractDetail() {},
  updateContractMsg: {},
  setUpdateContractMsg() {},
  handleContractUpdate() {},
  nextNode: {},
  setNextNode() {},
  contractStatus: '',
  setContractStatus() {},
  openTermsComparison: false,
  setOpenTermsComparison() {},
  termsComparisonArray: [],
  setTermsComparisonArray() {},
  tabIndex: 0,
  setTabIndex() {},
  engiName: '',
  setEngiName() {},
  open: {
    engiOpen: false,
    conOpen: false,
    amount: false,
  },
  setOpen() {},
  specialTerms: false,
  setSpecialTerms() {},
  end: 0,
  setEnd() {},
  handleHistoryCreate() {},
  projectInfos: [],
  setProjectInfos() {},
  handleHistorySearch() {},
};

export const ContractManageContext = createContext<ContractManageContextI>(
  defaultContext
);
const ContractManageContextProvider = ({ children }) => {
  const router = useRouter();
  const { account } = useContext<AuthContextI>(AuthContext);

  const [contractMsg, setContractMsg] = useState(defaultContext.contractMsg);
  const [contractMsgs, setContractMsgs] = useState(defaultContext.contractMsgs);
  const [vfileLists, setFfileLists] = useState(defaultContext.vfileLists);

  const [progress, setProgress] = useState(defaultContext.progress);

  const [query, setQuery] = useState(defaultContext.query);
  const [count, setCount] = useState(defaultContext.count);

  const [deleteBIMFile, setDeleteBIMFile] = useState([]);
  const [successsPopver, setSuccesssPopver] = useState(
    defaultContext.successsPopver
  );
  const [nextContractAuditing, setNextContractAuditing] = useState(
    defaultContext.nextContractAuditing
  );
  const [auditContractDetail, setAuditContractDetail] = useState(
    defaultContext.auditContractDetail
  );
  const [updateContractMsg, setUpdateContractMsg] = useState(
    defaultContext.updateContractMsg
  );
  const [nextNode, setNextNode] = useState(defaultContext.nextNode);
  const [contractStatus, setContractStatus] = useState(
    defaultContext.contractStatus
  );
  const [openTermsComparison, setOpenTermsComparison] = useState(
    defaultContext.openTermsComparison
  );
  const [termsComparisonArray, setTermsComparisonArray] = useState(
    defaultContext.termsComparisonArray
  );
  const [open, setOpen] = useState(defaultContext.open);
  const [tabIndex, setTabIndex] = useState(defaultContext.tabIndex);
  const [engiName, setEngiName] = useState(defaultContext.engiName);
  const [specialTerms, setSpecialTerms] = useState(defaultContext.specialTerms);
  const [end, setEnd] = useState(defaultContext.end);
  const [projectInfos, setProjectInfos] = useState(defaultContext.projectInfos);

  // 上传文件
  const saveFiles = async (files, type) => {
    filesSvc.upload(files, type).then(data => {
      if (data.code === 200) {
        const filesList = data.data;
        setContractMsg({
          ...contractMsg,
          nodeFiles: [...contractMsg.nodeFiles, ...filesList],
        });
      }
    });
  };

  const handleDeleteFile = async file => {
    try {
      let fileList = contractMsg.nodeFiles;
      const deleteFiles = fileList.filter(item => item !== file);
      setContractMsg({
        ...contractMsg,
        nodeFiles: deleteFiles,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleContractCreate = async () => {
    try {
      let nodeFiles: UploadFile[] = [];

      vfileLists.map(f => {
        nodeFiles.push({
          resourceId: f.resourceId,
          resourceName: f.resourceName,
          resourceType: f.resourceType,
          resourceSize: f.resourceSize,
          resourceDisplaySize: f.resourceDisplaySize,
          attachmentType: f.attachmentType,
        });
      });

      const contractType =
        query.tendertype === 'private' ? 'other' : contractMsg.contractType;

      contractSvc
        .create({
          ...contractMsg,
          // nodeFiles,
          tendertype: query.tendertype,
          contractType,
        })
        .then(data => {
          if (data.code === 200) {
            setSuccesssPopver(true);
          } else {
            message.info('创建失败!');
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleContractUpdate = async (status, attchmentFile, _id) => {
    let date;
    if (status === 4) {
      date = moment(new Date()).format('YYYY-MM-DD');
    }
    try {
      contractSvc
        .update({
          ...updateContractMsg,
          _id: _id,
          status: status,
          contractEffectiveDate: date,
          nodeFiles: attchmentFile,
        })
        .then(data => {
          if (data.code === 200) {
            setAuditContractDetail({});
            setUpdateContractMsg({});
            setContractStatus('');
            handleContractQuery();
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleContractQuery = async () => {
    setContractMsgs([]);
    contractSvc
      .search({
        ...query,
      })
      .then(data => {
        if (data.code === 200) {
          const list = data.data.data;
          const count = data.data.count;
          setContractMsgs(list);
          setCount(count);
        }
      });
  };

  const handleHistoryCreate = () => {
    const contractType =
      query.tendertype === 'private' ? 'other' : contractMsg.contractType;
    contractSvc
      .historyCreate({
        ...contractMsg,
        tendertype: query.tendertype,
        contractType: contractType,
      })
      .then(data => {
        if (data) {
          message.info('暂存成功!');
        }
      });
  };

  const handleHistorySearch = type => {
    contractSvc.historySearch().then(data => {
      if (data.code === 200) {
        if (data.data) {
          if (data.data.tendertype === type) {
            setContractMsg(data.data);
          }
        }
      }
    });
  };

  const queryProjects = async () => {
    try {
      const data = await engineeringSvc.search({});
      setProjectInfos(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleContractQuery();
  }, [query, contractStatus]);

  useEffect(() => {
    queryProjects();
  }, []);

  const providerValue = useMemo(() => {
    return {
      contractMsg,
      setContractMsg,
      contractMsgs,
      setContractMsgs,
      handleContractCreate,
      saveFiles,
      vfileLists,
      setFfileLists,
      handleDeleteFile,
      progress,
      setProgress,
      query,
      setQuery,
      count,
      successsPopver,
      nextContractAuditing,
      auditContractDetail,
      setAuditContractDetail,
      updateContractMsg,
      setUpdateContractMsg,
      handleContractUpdate,
      nextNode,
      setNextNode,
      contractStatus,
      setContractStatus,
      openTermsComparison,
      setOpenTermsComparison,
      termsComparisonArray,
      setTermsComparisonArray,
      tabIndex,
      setTabIndex,
      engiName,
      setEngiName,
      open,
      setOpen,
      specialTerms,
      setSpecialTerms,
      end,
      setEnd,
      handleHistoryCreate,
      projectInfos,
      setProjectInfos,
      handleHistorySearch,
    };
  }, [
    contractMsg,
    contractMsgs,
    vfileLists,
    progress,
    query,
    count,
    successsPopver,
    nextContractAuditing,
    auditContractDetail,
    updateContractMsg,
    nextNode,
    contractStatus,
    openTermsComparison,
    termsComparisonArray,
    tabIndex,
    engiName,
    open,
    specialTerms,
    end,
    projectInfos,
  ]);
  return (
    <ContractManageContext.Provider value={providerValue}>
      {children}
    </ContractManageContext.Provider>
  );
};

export default ContractManageContextProvider;
