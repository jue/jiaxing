import React, {
  createContext,
  useEffect,
  useState,
  useMemo,
  useContext,
} from 'react';
import filesSvc from '../../../services/filesSvc';
import safetyHiddenDangerSvc from '../../../services/SafetyHiddenDangerSvc';
import { WebSecurityRisksHiddenPerils } from '../../../../typings/security_risks_hidden_perils';
import { WebSecurityRisksProblemItem } from '../../../../typings/security_risks_problem_item';
import { ExaminationTabType } from '../../../../constants/enums';
import { useRouter } from 'next/router';
import { FlowContext } from '../../../contexts/FlowContext';
import companySvc from '../../../services/companySvc';
import { DBCompanyI } from '../../../../typings/company';
import { message } from 'antd';
import flowSvc from '../../../services/flowSvc';
import { AuthContextI, AuthContext } from '../../../contexts/AuthContext';
import accountSvc from '../../../services/accountSvc';

export interface HiddenDangerContextI {
  hiddenDangerProblem: WebSecurityRisksProblemItem[];
  setHiddenDangerProblem: Function;
  problemData: Partial<WebSecurityRisksProblemItem>;
  setProblemData: Function;
  updateProblemData: Partial<WebSecurityRisksProblemItem>;
  setUpdateProblemData: Function;
  saveFiles: Function;
  hiddenDangerSubject: Partial<WebSecurityRisksHiddenPerils>;
  setHiddenDangerSubject: Function;
  handleConfirm: Function;
  query: {
    page: number;
    limit: number;
    idCreatedBy?: boolean;
    myself?: boolean;
    status?: string;
    _id?: string;
  };
  count: number;
  setCount: Function;
  setQuery: Function;
  relusTrue: any;
  setRelusTrue: Function;
  currentTab: string;
  setCurrentTab: Function;
  hiddenDangerList: any;
  setHiddenDangerList: Function;
  handleQuery: Function;
  handleUpdateQuality: Function;
  companyInfos: DBCompanyI[];
  bizDatas: any;
  setBizDatas: Function;
  taskinfo: any;
  setTaskinfo: Function;
  handleAuditingMap: Function;
  handleReply: Function;
}

const defaultContext: HiddenDangerContextI = {
  hiddenDangerProblem: [],
  setHiddenDangerProblem() {},
  problemData: {},
  setProblemData() {},
  updateProblemData: {},
  setUpdateProblemData() {},
  saveFiles() {},
  hiddenDangerSubject: {},
  setHiddenDangerSubject() {},
  handleConfirm() {},
  query: {
    page: 0,
    limit: 10,
  },
  setQuery() {},
  count: 0,
  setCount() {},
  relusTrue: {
    name: '',
    desc: '',
    type: '',
    perilsTime: '',
    partCompanys: '',
    perilsResults: '',
    endTime: '',
  },
  setRelusTrue() {},
  currentTab: ExaminationTabType.All,
  setCurrentTab() {},
  hiddenDangerList: [],
  setHiddenDangerList() {},
  handleQuery() {},
  handleUpdateQuality() {},
  companyInfos: [],
  bizDatas: [],
  setBizDatas() {},
  taskinfo: [],
  setTaskinfo() {},
  handleAuditingMap() {},
  handleReply() {},
};

export const HiddenDangerContext = createContext<HiddenDangerContextI>(
  defaultContext
);

export const HiddenDangerContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // const { account } = useContext<AuthContextI>(AuthContext);
  const [taskinfo, setTaskinfo] = useState<any>({});

  const { setDetailInfos, queryAuditNode } = useContext(FlowContext);
  const [hiddenDangerProblem, setHiddenDangerProblem] = useState(
    defaultContext.hiddenDangerProblem
  );
  const [problemData, setProblemData] = useState(defaultContext.problemData);
  const [hiddenDangerSubject, setHiddenDangerSubject] = useState(
    defaultContext.hiddenDangerSubject
  );
  const [updateProblemData, setUpdateProblemData] = useState(
    defaultContext.updateProblemData
  );
  const [query, setQuery] = useState(defaultContext.query);
  const [count, setCount] = useState(defaultContext.count);
  const [relusTrue, setRelusTrue] = useState(defaultContext.relusTrue);
  const [currentTab, setCurrentTab] = useState(defaultContext.currentTab);
  const [hiddenDangerList, setHiddenDangerList] = useState(
    defaultContext.hiddenDangerList
  );
  const [companyInfos, setCompanyInfos] = useState(defaultContext.companyInfos);
  const [bizDatas, setBizDatas] = useState(defaultContext.bizDatas);

  const router = useRouter();
  const { action, _id } = router.query;

  const saveFiles = async (grid, file, type, attachmentType) => {
    let problemFiles = problemData.nodeFiles || [];
    let subjectFiles = hiddenDangerSubject.nodeFiles || [];
    let replyFiles = updateProblemData.replyFile || [];
    const data = await filesSvc.upload(file, type);

    data.data[0].attachmentType = attachmentType;
    switch (grid) {
      case 'problem':
        data.data.map((item) => {
          problemFiles.push(item);
        });

        setProblemData({
          ...problemData,
          nodeFiles: problemFiles,
        });
        break;
      case 'replay':
        data.data.map((item) => {
          replyFiles.push(item);
        });
        setUpdateProblemData({
          ...updateProblemData,
          replyFile: replyFiles,
        });
        break;
      default:
        data.data.map((item) => {
          subjectFiles.push(item);
        });
        setHiddenDangerSubject({
          ...hiddenDangerSubject,
          nodeFiles: subjectFiles,
        });
        break;
    }
  };

  //创建检查
  const handleConfirm = async () => {
    safetyHiddenDangerSvc
      .create({
        perilsInfo: {
          ...hiddenDangerSubject,
        },
        itemInfos: [...hiddenDangerProblem],
      })
      .then((data) => {
        if (data.code === 4001) {
          // return message.error(data.msg);
          return message.error(
            data.msg === '参数不全' ? '请至少填写一条问题项' : data.msg
          );
        }
        router.push('/safety/hiddenDanger');
      })
      .catch((error) => {
        message.error(error.msg);
      });
  };
  const handleQuery = async (params?: any) => {
    safetyHiddenDangerSvc
      .query({ ...query, ...params })
      .then((data) => {
        if (data.code === 4001) {
          return message.error(data.msg);
        }
        setHiddenDangerList(data.data);
        setCount(data.data.count);
        // if (action === 'view') {
        setHiddenDangerSubject(data.data);
        setHiddenDangerProblem(data.data.problemItem);
        setDetailInfos(data.data);
        queryAuditNode(data.data.idAuditing);
        // }
      })
      .catch(() => message.error('查询信息失败'));
  };
  const handleUpdateQuality = async (status, attchmentFile, _id) => {
    try {
      // const newNodeFiles = hiddenDangerSubject.nodeFiles.concat(attchmentFile);
      await safetyHiddenDangerSvc.update({
        // ...updateEngineeringtMsg,
        _id: _id,
        status: status,
        // nodeFiles: newNodeFiles,
        nodeFiles: attchmentFile,
      });
    } catch (error) {
      console.log(error);
    }
  };
  //整改回复
  const handleReply = ({ status, _id }) => {
    safetyHiddenDangerSvc
      .reply(hiddenDangerProblem)
      .then((data) => {
        router.push('/safety/hiddenDanger');
      })
      .catch(() => message.error('整改问题回复失败'));
  };
  //获取map
  const handleAuditingMap = (companyType) => {
    accountSvc.self().then((data) => {
      flowSvc
        .getAuditingMap({
          dataType: 'SECURITY_RISK',
          dictKey: `${data.company && data.company.type}-${companyType}`,
          original: true,
        })
        .then((flow) => {
          if (flow.code === 200) {
            flow.data.map((item) => {
              if (item.start === 1) {
                setBizDatas(item.bizDataCode && item.bizDataCode);
              }
            });
          }
        });
    });
  };
  useEffect(() => {
    // if (action === 'view') {
    //   handleQuery({ _id });
    // }

    if (!action) {
      if (currentTab === ExaminationTabType.Request) {
        handleQuery({ idCreatedBy: true });
      } else if (currentTab === ExaminationTabType.All) {
        handleQuery();
      } else {
        handleQuery({ myself: true });
      }
    }
  }, [query, currentTab, action]);

  const queryCompanys = async () => {
    const data = await companySvc.query({});
    setCompanyInfos(data);
  };

  useEffect(() => {
    queryCompanys();
  }, []);

  const providerValue = useMemo(() => {
    return {
      hiddenDangerProblem,
      setHiddenDangerProblem,
      problemData,
      setProblemData,
      saveFiles,
      hiddenDangerSubject,
      setHiddenDangerSubject,
      handleConfirm,
      query,
      setQuery,
      count,
      setCount,
      relusTrue,
      setRelusTrue,
      currentTab,
      setCurrentTab,
      hiddenDangerList,
      setHiddenDangerList,
      handleQuery,
      handleUpdateQuality,
      companyInfos,
      bizDatas,
      setBizDatas,
      taskinfo,
      setTaskinfo,
      handleAuditingMap,
      updateProblemData,
      setUpdateProblemData,
      handleReply,
    };
  }, [
    hiddenDangerProblem,
    problemData,
    hiddenDangerSubject,
    query,
    count,
    relusTrue,
    currentTab,
    hiddenDangerList,
    companyInfos,
    bizDatas,
    taskinfo,
    updateProblemData,
  ]);

  return (
    <HiddenDangerContext.Provider value={providerValue}>
      {children}
    </HiddenDangerContext.Provider>
  );
};

export default HiddenDangerContextProvider;
