import { createContext, useState, useMemo, useEffect, useContext } from 'react';
import flowSvc from '../services/flowSvc';
import companySvc from '../services/companySvc';
import departSvc from '../services/departSvc';
import jobSvc from '../services/jobSvc';
import { DBCompanyI } from '../../typings/company';
import { DBDepartmentI } from '../../typings/department';
import { DBJobI } from '../../typings/job';
import fileSvc from '../services/filesSvc';
import accountSvc from '../services/accountSvc';
import taskSvc from '../services/taskSvc';
import progressSvc from '../services/ProgressSvc';
import { AuthContext, AuthContextI } from './AuthContext';
import { useRouter } from 'next/router';
// import { EngineeringContext } from '../../client/containers/engineeringManage/context/EngineeringContext';
import { message } from 'antd';
// import { InspectionContext } from '../containers/qualityManageV2/context/InspectionContext';

message.config({ maxCount: 1 });

interface FlowContextI {
  queryAuditNode: Function;
  currentNode: any;
  nextNode: any;
  companyInfos: DBCompanyI[];
  departInfos: DBDepartmentI[];
  jobInfos: DBJobI[];
  queryAuditFlow: Function;
  flows: any;
  setFlows: Function;
  updateAuditFlow: Function;
  queryAuditMap: Function;
  auditMap: any;
  setAuditMap: Function;
  saveFiles: Function;
  taskInfos: any;
  setTasksInfos: Function;
  detailInfos: any;
  setDetailInfos: Function;
  handleCreateBizData: Function;
  bizDatasFlow: any;
  setBizDatasFlow: Function;
  queryTask: Function;
  fileFillData: Function;
  queryFileFillData: Function;
  // iframeUrl: string;
  // setIframeUrl: Function;
}

const defaultContext: FlowContextI = {
  queryAuditNode() {},
  currentNode: [],
  nextNode: [],
  companyInfos: [],
  departInfos: [],
  jobInfos: [],
  queryAuditFlow() {},
  flows: [],
  setFlows() {},
  updateAuditFlow() {},
  queryAuditMap() {},
  auditMap: [],
  setAuditMap() {},
  saveFiles() {},
  taskInfos: {},
  setTasksInfos() {},
  detailInfos: {},
  setDetailInfos() {},
  handleCreateBizData() {},
  bizDatasFlow: [],
  setBizDatasFlow() {},
  queryTask() {},
  fileFillData() {},
  queryFileFillData() {},
  // iframeUrl: '',
  // setIframeUrl() {},
};

export const FlowContext = createContext<FlowContextI>(defaultContext);

export const FlowContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentNode, setCurrentNode] = useState(defaultContext.currentNode);
  const [nextNode, setNextNode] = useState(defaultContext.nextNode);
  const [companyInfos, setCompanyInfos] = useState(defaultContext.companyInfos);
  const [departInfos, setDepartInfos] = useState(defaultContext.departInfos);
  const [jobInfos, setJobInfos] = useState(defaultContext.jobInfos);
  const [flows, setFlows] = useState(defaultContext.flows);
  const [auditMap, setAuditMap] = useState(defaultContext.auditMap);
  const [taskInfos, setTasksInfos] = useState(defaultContext.taskInfos);
  const [detailInfos, setDetailInfos] = useState(defaultContext.detailInfos);
  const [bizDatasFlow, setBizDatasFlow] = useState(defaultContext.bizDatasFlow);
  // const [iframeUrl, setIframeUrl] = useState(defaultContext.iframeUrl);
  const { account } = useContext<AuthContextI>(AuthContext);
  // const { handleUpdate } = useContext(EngineeringContext);
  const router = useRouter();
  const is_change_engineering_create = router.pathname.includes(
    'engineering/changeCreate'
  );
  const is_change_construction = router.pathname.includes(
    '/quality/v2/construction'
  );

  const is_progress_manage = router.pathname.includes(
    '/progress/approveDetail'
  );
  const is_quality_safety =
    router.pathname.includes('/quality/v2/inspection') ||
    router.pathname.includes('/safety/hiddenDanger');
  const { action } = router.query;

  const queryAuditNode = params => {
    flowSvc.queryNode(params).then(data => {
      if (data.code === 200) {
        if (params.queryType === '1') {
          setCurrentNode(data.data);
        } else {
          setNextNode(data.data);
        }
      }
    });
  };
  const queryAuditFlow = idAuditing => {
    if (!idAuditing) {
      return;
    }
    flowSvc.queryFlow(idAuditing).then(data => {
      if (data.code === 200) {
        setFlows(data.data);
      }
    });
  };
  const updateAuditFlow = async ({
    approvalId,
    flowData,
    action,
    attchmentFile,
    _id,
    handleUpdate,
  }) => {
    let res;
    if (is_progress_manage) {
      res = await flowSvc.queryNode({
        idAuditing: approvalId,
        queryType: '1',
      });
    }
    flowSvc
      .update({ approvalId, flowData })
      .then(data => {
        if (data.code === 200) {
          const status = data.data.approvalStatus;
          if (typeof handleUpdate === 'function') {
            handleUpdate(status, attchmentFile, _id);
            window.location.reload();
          } else if (typeof handleUpdate === 'string') {
            if (handleUpdate === 'approval' && is_progress_manage) {
              if (res.code == 200) {
                if (res.data.end != 1) {
                  progressPutAudit({
                    _id: _id,
                    status: status + '',
                    end: '',
                  });
                } else {
                  progressPutAudit({
                    _id: _id,
                    status: status + '',
                    end: true,
                  });
                }
                router.push('/progress/approve');
              } else {
                message.error('获取当前节点信息失败！');
              }
            }
          }
          message.info('审批成功！');
          // if (is_quality_v2 || is_safety_hiddenDanger) {
          //   handleQuery({ _id });
          // }
        } else {
          message.error('审批失败！');
        }
      })
      .catch(error => {
        message.error('审批失败！');
      });
  };

  const queryAuditMap = (text, type, approvalId) => {
    if (!text.idCreatedBy) {
      return;
    }
    accountSvc.search({ _id: text.idCreatedBy }).then(data => {
      flowSvc
        .getAuditingMap({
          dataType: type,
          dictKey:
            // action === 'view'
            //   ? ''
            //   :
            is_change_construction
              ? text.type
              : is_quality_safety
              ? `${text.account &&
                  text.account.company &&
                  text.account.company.type}-${text.accountExecutor &&
                  text.accountExecutor.company &&
                  text.accountExecutor.company.type}`
              : data.company && data.company.type,
          approvalId: text.idAuditing,
        })
        .then(flow => {
          if (flow.code === 200) {
            setAuditMap(flow.data);
          }
        });

      taskSvc
        .query({
          dataType: type,
          dictKey:
            // action === 'view'
            //   ? ''
            //   :
            is_change_construction
              ? text.type
              : is_quality_safety
              ? `${text.account &&
                  text.account.company &&
                  text.account.company.type}-${text.accountExecutor &&
                  text.accountExecutor.company &&
                  text.accountExecutor.company.type}`
              : data.company && data.company.type,
        })
        .then(task => {
          if (task.code === 200) {
            setTasksInfos(task.data);
          }
        });
    });
  };
  const progressPutAudit = async params => {
    const data = await progressSvc.putAudit(params);
  };

  const queryCompanys = async () => {
    const data = await companySvc.query({});
    setCompanyInfos(data);
  };

  const queryDeparts = async () => {
    const data = await departSvc.query({});
    setDepartInfos(data);
  };

  const queryJobs = async () => {
    const data = await jobSvc.query({});
    setJobInfos(data);
  };

  const saveFiles = (files, info) => {
    fileSvc.upload(files.files, files.fileType).then(data => {
      if (data.code === 200) {
        let iframe = document.getElementById(
          'commonAudit'
        ) as HTMLIFrameElement;
        let iWindow = iframe.contentWindow;
        iWindow.postMessage(
          {
            uploadAttchmentFile: data.data,
          },
          '*'
        );
      }
    });
  };

  const queryTask = dataType => {
    const type = account.company && account.company.type;
    taskSvc
      .query({
        dataType: dataType,
        dictKey: type,
      })
      .then(task => {
        if (task.code === 200) {
          setTasksInfos(task.data);
        }
      });
  };

  const handleCreateBizData = (type: string) => {
    accountSvc.self().then(data => {
      flowSvc
        .getAuditingMap({
          dataType: type,
          dictKey: data && data.company && data.company.type,
          original: true,
        })
        .then(flow => {
          if (flow.code === 200) {
            flow.data.map(item => {
              if (item.start === 1) {
                if (item.bizDataCode) {
                  setBizDatasFlow(item.bizDataCode);
                }
              }
            });
          }
        });
    });
  };

  //文件填充数据
  const fileFillData = params => {
    const data = fileSvc.fillData(params);
    return data;
  };

  //文件填充数据，文件预览
  const queryFileFillData = (info, fileId, fileName, setPreViewFile) => {
    let { idAuditing, ...params } = info;
    const index = fileName.lastIndexOf('.');
    const fileType = fileName.substr(index + 1);
    fileFillData({
      ...params,
      tempId: fileId,
      fileName: fileName,
    }).then(data => {
      if (data.code === 200) {
        setPreViewFile({
          resourceId: fileType === 'pdf' ? fileId : data.data.tempDataKey,
          resourceName: fileName,
        });
      }
    });
  };

  useEffect(() => {
    // let url = window.location.href;

    // let testJxUrl = 'https://dev-jxtram.tylinsh.com';
    // let prodJxUrl = 'https://jxtram.tylinsh.com';

    // let testGAUrl = 'https://dev-approval.tylinsh.com';
    // let prodGAUrl = 'https://approval.tylinsh.com';

    // if (url.includes(testJxUrl)) {
    //   setIframeUrl(testGAUrl);
    // } else if (url.includes(prodJxUrl)) {
    //   setIframeUrl(prodGAUrl);
    // } else {
    //   setIframeUrl('http://localhost:3003');
    // }
    const { action } = router.query;
    if (is_change_engineering_create) {
      queryTask('GC_CHANGE');
    } else if (action !== 'create') {
      queryCompanys();
      queryDeparts();
      queryJobs();
    }
  }, []);

  useEffect(() => {
    if (detailInfos.idAuditing) {
      ['1', '2'].map(item => {
        queryAuditNode({
          idAuditing: detailInfos.idAuditing,
          queryType: item,
        });
      });
    }
  }, [detailInfos.idAuditing]);

  const providerValue = useMemo(() => {
    return {
      queryAuditNode,
      currentNode,
      nextNode,
      companyInfos,
      departInfos,
      jobInfos,
      flows,
      setFlows,
      queryAuditFlow,
      updateAuditFlow,
      queryAuditMap,
      auditMap,
      setAuditMap,
      saveFiles,
      taskInfos,
      setTasksInfos,
      detailInfos,
      setDetailInfos,
      handleCreateBizData,
      bizDatasFlow,
      setBizDatasFlow,
      queryTask,
      fileFillData,
      queryFileFillData,
      // iframeUrl,
      // setIframeUrl,
    };
  }, [
    currentNode,
    nextNode,
    flows,
    auditMap,
    taskInfos,
    detailInfos,
    bizDatasFlow,
    // iframeUrl,
  ]);

  return (
    <FlowContext.Provider value={providerValue}>
      {children}
    </FlowContext.Provider>
  );
};

export default FlowContextProvider;
