import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import toDoListSvc from '../../../services/todoListSvc';
import { AuthContext, AuthContextI } from '../../../contexts/AuthContext';
import MessageSvc from '../../../services/MessageSvc';
import { DocumentCategory, Documents } from '../../../../typings/document';
import documentCategorySvc from '../../../services/DocumentCategorySvc';
import documentSvc from '../../../services/DocumentSvc';
import inspectThemeSvc from '../../../services/InspectThemeSvc';
import safetyHiddenDangerSvc from '../../../services/SafetyHiddenDangerSvc';
import { QualityColumn } from '../../../../typings/security_risks_hidden_perils';
import { forEach } from 'lodash';
import { WorkBenchType } from '../../../../constants/enums';
import engineeringChangeSvc from '../../../services/EngineeringChangeSvc';
import progressSvc from '../../../services/ProgressSvc';

interface WorkBenchContextI {
  todoCount: number;
  doneCount: number;
  unReadCount: number;
  haveReadCount: number;
  documentCategorys: DocumentCategory[];
  selectCategory: Partial<DocumentCategory>;
  setSelectCategory: Function;
  documents: Documents[];
  setDocuments: Function;
  queryDocuments: Function;
  queryDocument: {
    page: number;
    limit: number;
    idCategory?: string;
  };
  countDocument: number;
  setCountDocument: Function;
  setQueryDocument: Function;
  qualityColumn: {
    delayCounts?: any[];
    inspectCounts?: any[];
    rectifyCounts?: any[];
    _ids?: any[];
  };
  // setQualityColum: Function;
  qualityPie: {
    days?: number;
    rectifyCount?: number;
    doingCount?: number;
    delayCount?: number;
  };
  setQualityPie: Function;
  completionCase: Function;
  qualityProblemList: any[];
  tabIndex: string;
  setTabIndex: Function;
  engineeringAmountCount: {
    amounts?: any[];
    counts?: any[];
    _ids?: any[];
  };
  engineeringChangeCost: Function;
  changeLevelPercent: {
    commonAmounts?: number;
    greatAmounts?: number;
  };
  changeTypePercent: {
    constructionAmounts?: number;
    designAmounts?: number;
    otherAmounts?: number;
  };
  progressTask: Function;
  progressCarryOut: {
    todoCounts?: number;
    doingCounts?: number;
    doneCount?: number;
  };
  progressDelay: {
    noDelayCounts?: number;
    delayCounts?: number;
    seriousDelayCounts?: number;
  };
  progressDelayTop10: any;
  progressTotalTaskRate: any;
  progerssProjectDate: any;
  progressDelayTop: Function;
}
const defaultContext: WorkBenchContextI = {
  todoCount: 0,
  doneCount: 0,
  unReadCount: 0,
  haveReadCount: 0,
  documentCategorys: [],
  selectCategory: {},
  setSelectCategory() {},
  documents: [],
  setDocuments() {},
  queryDocuments() {},

  queryDocument: {
    page: 0,
    limit: 10,
  },
  setQueryDocument() {},
  countDocument: 0,
  setCountDocument() {},
  qualityColumn: {},
  // setQualityColum() {},
  qualityPie: {},
  setQualityPie() {},
  completionCase() {},
  qualityProblemList: [],
  tabIndex: '',
  setTabIndex() {},
  engineeringAmountCount: {},
  engineeringChangeCost() {},
  changeLevelPercent: {},
  changeTypePercent: {},
  progressTask() {},
  progressCarryOut: {},
  progressDelay: {},
  progressDelayTop10: [],
  progressTotalTaskRate: {},
  progerssProjectDate: {},
  progressDelayTop() {},
};

export const WorkBenchContext = createContext<WorkBenchContextI>(
  defaultContext
);

export const WorkBenchContextProvider = ({
  children,
  idParent,
}: {
  children: React.ReactNode;
  idParent: string;
}) => {
  const [queryDocument, setQueryDocument] = useState(
    defaultContext.queryDocument
  );
  const [countDocument, setCountDocument] = useState(
    defaultContext.countDocument
  );
  const [todoCount, setTodoCount] = useState(defaultContext.todoCount);
  const [doneCount, setDoneCount] = useState(defaultContext.doneCount);
  const [unReadCount, setUnReadCount] = useState(defaultContext.unReadCount);
  const [haveReadCount, setHaveReadCount] = useState(
    defaultContext.haveReadCount
  );
  const [documents, setDocuments] = useState(defaultContext.documents);
  const [documentCategorys, setDocumentCategorys] = useState<
    DocumentCategory[]
  >([]);
  const [selectCategory, setSelectCategory] = useState<
    Partial<DocumentCategory>
  >({});
  const [qualityColumn, setQualityColum] = useState(
    defaultContext.qualityColumn
  );
  const [qualityPie, setQualityPie] = useState(defaultContext.qualityPie);
  const [qualityProblemList, setQualityProblemList] = useState(
    defaultContext.qualityProblemList
  );
  const { account } = useContext<AuthContextI>(AuthContext);
  const [tabIndex, setTabIndex] = useState(WorkBenchType.Quality);
  const [engineeringAmountCount, seEngineeringAmountCount] = useState(
    defaultContext.engineeringAmountCount
  );
  const [changeLevelPercent, setChangeLevelPercent] = useState(
    defaultContext.changeLevelPercent
  );
  const [changeTypePercent, setChangeTypePercent] = useState(
    defaultContext.changeTypePercent
  );
  const [progressCarryOut, setProgressCarryOut] = useState(
    defaultContext.progressCarryOut
  );
  const [progressDelay, setProgressDelay] = useState(
    defaultContext.progressDelay
  );
  const [progressDelayTop10, setProgressDelayTop10] = useState(
    defaultContext.progressDelayTop10
  );
  const [progressTotalTaskRate, setProgressTotalTaskRate] = useState(
    defaultContext.progressTotalTaskRate
  );
  const [progerssProjectDate, setProgerssProjectDate] = useState(
    defaultContext.progerssProjectDate
  );
  const searchTodos = async () => {
    let data = await toDoListSvc.searchTodos({
      status: 1,
      operatorBizId: account._id,
    });
    setTodoCount(data.data.total);
  };
  const searchDoneList = async () => {
    let data = await toDoListSvc.searchTodos({
      status: 2,
      operatorBizId: account._id,
    });
    setDoneCount(data.data.total);
  };
  const searchUnRead = async () => {
    const data = await MessageSvc.search({ read: 0 });
    setUnReadCount(data.data.total);
  };
  const searchHaveRead = async () => {
    let data = await MessageSvc.search({ read: 1 });
    setHaveReadCount(data.data.total);
  };

  //文档表单模版
  const queryDocumentCategorys = () => {
    documentCategorySvc
      .query({ idParent })
      .then((data) => {
        setDocumentCategorys(data);

        setSelectCategory(data && data[0]);
        queryDocuments();
      })
      .catch((error) => console.log(error));
  };

  //模版
  const queryDocuments = () => {
    documentSvc
      .query({ ...queryDocument, idCategory: selectCategory._id })
      .then((data) => {
        setDocuments(data.data);
        if (queryDocument.page === 0) {
          setDocuments(data.data);
        } else {
          let newData = documents.concat(data.data);
          setDocuments(newData);
        }
        setCountDocument(data.count);
      })
      .catch((error) => console.log(error));
  };
  // 进度
  const progressPrject = () => {
    progressSvc
      .durationStatistical()
      .then((data) => setProgerssProjectDate(data.data))
      .catch((err) => console.log(err));
  };
  const progressTotalTask = () => {
    progressSvc
      .taskCompletionRate()
      .then((data) => setProgressTotalTaskRate(data.data))
      .catch((err) => console.log(err));
  };
  const progressTask = (type, val) => {
    let task;
    if (type == 'done') {
      task = progressSvc.taskCompletionCase({ daya: val });
    } else {
      task = progressSvc.taskDelayCase({ days: val });
    }
    task
      .then((data) => {
        if (type == 'done') {
          setProgressCarryOut({
            ...progressCarryOut,
            todoCounts: data.data.todoCount,
            doingCounts: data.data.doingCount,
            doneCount: data.data.doneCounts,
          });
        } else {
          setProgressDelay({
            ...progressCarryOut,
            noDelayCounts: data.data.noDelayCount,
            delayCounts: data.data.delayCount,
            seriousDelayCounts: data.data.seriousDelayCount,
          });
        }
      })
      .catch((err) => console.log(err));
  };
  const progressDelayTop = (val) => {
    progressSvc
      .delayTop10({ page: 0, limit: 10, days: val })
      .then((data) => setProgressDelayTop10(data.data))
      .catch((err) => console.log(err));
  };

  //质量检查/隐患排查 统计
  const statistical = (type) => {
    let statistical;
    if (type === 'quality') {
      statistical = inspectThemeSvc.qualityStatistical();
    } else {
      statistical = safetyHiddenDangerSvc.qualityStatistical();
    }
    statistical
      .then((data) => {
        setQualityColum({
          ...qualityColumn,
          _ids: data.data.map((item) => item._id.toString()),
          inspectCounts: data.data.map((item) => item.inspectCount),
          rectifyCounts: data.data.map((item) => item.rectifyCount),
          delayCounts: data.data.map((item) => item.delayCount),
        });
      })
      .catch((error) => console.log(error));
  };
  // 质量检查/隐患排查 整改完成统计
  const completionCase = (type, val) => {
    let completionCase;
    if (type === 'quality') {
      completionCase = inspectThemeSvc.qualityCompletionCase({ days: val });
    } else {
      completionCase = safetyHiddenDangerSvc.qualityCompletionCase({
        days: val,
      });
    }
    completionCase
      .then((data) => {
        setQualityPie({
          ...qualityPie,
          rectifyCount: data.data.rectifyCount,
          doingCount: data.data.doingCount,
          delayCount: data.data.delayCount,
        });
      })
      .catch((error) => console.log(error));
  };
  // 质量检查/隐患排查 整改问题统计
  const qualityProblem = (type) => {
    let problem;
    if (type === 'quality') {
      problem = inspectThemeSvc.qualityProblem({ page: 0, limit: 10 });
    } else {
      problem = safetyHiddenDangerSvc.qualityProblem({ page: 0, limit: 10 });
    }
    problem
      .then((data) => {
        setQualityProblemList(data.data.data);
      })
      .catch((error) => console.log(error));
  };
  //工程
  const engineeringStatistical = () => {
    engineeringChangeSvc
      .statistical()
      .then((data) => {
        seEngineeringAmountCount({
          ...engineeringAmountCount,
          _ids: data.data.map((item) => item._id.toString()),
          amounts: data.data.map((item) => item.amount / 1000000),
          counts: data.data.map((item) => item.count),
        });
      })
      .catch((error) => console.log(error));
  };
  const engineeringChangeCost = (type, val) => {
    let percent;
    if (type === 'level') {
      percent = engineeringChangeSvc.changeLevelPercent({ days: val });
    } else {
      percent = engineeringChangeSvc.changeTypePercent({ days: val });
    }

    percent
      .then((data) => {
        if (type == 'level') {
          setChangeLevelPercent({
            ...changeLevelPercent,
            commonAmounts: data.data.commonAmount,
            greatAmounts: data.data.greatAmout,
          });
        } else {
          setChangeTypePercent({
            ...changeTypePercent,
            constructionAmounts: data.data.constructionAmount,
            designAmounts: data.data.designAmount,
            otherAmounts: data.data.otherAmount,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (account && account._id) {
      searchTodos();
      searchDoneList();
      searchUnRead();
      searchHaveRead();
      progressDelayTop(30);
      queryDocumentCategorys();
      engineeringStatistical();
      engineeringChangeCost('level', 30);
      engineeringChangeCost('type', 30);
      progressTask('done', 30);
      progressTask('delay', 30);
      progressTotalTask();
      progressPrject();
    }
  }, [account]);
  useEffect(() => {
    if (tabIndex === 'quality') {
      statistical('quality');
      completionCase('quality', 30);
      qualityProblem('quality');
    } else {
      statistical('hidden');
      completionCase('hidden', 30);
      qualityProblem('hidden');
    }
  }, [tabIndex]);
  useEffect(() => {
    if (
      countDocument / 10 >= queryDocument.page &&
      selectCategory &&
      selectCategory._id !== undefined
    ) {
      queryDocuments();
    }
  }, [queryDocument]);
  useEffect(() => {
    setQueryDocument({
      ...queryDocument,
      page: 0,
    });
  }, [selectCategory]);
  const providerValue = useMemo(() => {
    return {
      todoCount,
      doneCount,
      unReadCount,
      haveReadCount,
      documentCategorys,
      selectCategory,
      setSelectCategory,
      documents,
      setDocuments,
      queryDocuments,
      queryDocument,
      setQueryDocument,
      countDocument,
      setCountDocument,
      qualityColumn,
      // setQualityColum,
      qualityPie,
      setQualityPie,
      completionCase,
      qualityProblemList,
      tabIndex,
      setTabIndex,
      engineeringAmountCount,
      engineeringChangeCost,
      changeLevelPercent,
      changeTypePercent,
      progressTask,
      progressCarryOut,
      progressDelay,
      progressDelayTop10,
      progressTotalTaskRate,
      progerssProjectDate,
      progressDelayTop,
    };
  }, [
    todoCount,
    doneCount,
    unReadCount,
    documents,
    haveReadCount,
    documentCategorys,
    selectCategory,
    queryDocument,
    countDocument,
    qualityColumn,
    qualityPie,
    // completionCase,
    qualityProblemList,
    tabIndex,
    engineeringAmountCount,
    changeLevelPercent,
    changeTypePercent,
    progressCarryOut,
    progressDelay,
    progressDelayTop10,
    progressTotalTaskRate,
    progerssProjectDate,
  ]);

  return (
    <WorkBenchContext.Provider value={providerValue}>
      {children}
    </WorkBenchContext.Provider>
  );
};

export default WorkBenchContextProvider;
