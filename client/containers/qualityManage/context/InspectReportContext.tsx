import {
  createContext,
  useEffect,
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
  useContext,
} from 'react';
import { useRouter } from 'next/router';
import shortid from 'shortid';

import { DBQualityInspectCheckItemI } from '../../../../typings/quality_inspect_checkItem';
import { DBQualityInspectReportI } from '../../../../typings/quality_inspect_report';
import { DBQualityInspectRectificationI } from '../../../../typings/quality_inspect_rectification';
import { webCreateTaskI } from '../../../../typings/quality_inspect_task';
import { AuthContext, AuthContextI } from '../../../contexts/AuthContext';

import BaseSvc from '../../../services/BaseSvc';
import inspectReportSvc from '../../../services/InspectReportSvc';
import inspectCheckItemSvc from '../../../services/InspectCheckItemSvc';
import inspectRectificationSvc from '../../../services/InspectRectificationSvc';
import inspectQualityFilesSvc from '../../../services/InspectQualityFilesSvc';
import inspectTaskSvc from '../../../services/InspectTaskSvc';
import { InspectPlanStatusContext } from './InspectPlanStatusContext';

export interface QueryContent {
  page: number;
  limit: number;
}
export interface TaskContent {
  userId: string;
  userName: string;
  atCreated: Date;
  content: string;
}

type SetState<T> = Dispatch<SetStateAction<T>>;

interface InspectReportContextI {
  saveFiles: Function;

  inspectCheckItemCreated: Partial<DBQualityInspectCheckItemI>;
  setInspectCheckItemCreated: Function;

  inspectReportCreated: Partial<DBQualityInspectReportI>;
  setInspectReportCreated: Function;
  inspectReportEdit: Partial<DBQualityInspectReportI>;
  setInspectReportEdit: Function;
  handleCreatedReport: Function;
  handleCreatedCheckList: Function;
  handleUpdateReport: Function;
  inspectReportList: DBQualityInspectReportI[];
  // setInspectReportList: Function;
  setInspectReportList: SetState<InspectReportContextI['inspectReportList']>;

  inspectCheckList: any;
  setInspectCheckList: Function;
  handleCraeatedCheckItem: Function;
  handleConfirm: Function;
  getReportList: Function;

  query: QueryContent;
  setQuery: Function;
  count: number;
  setCount: Function;

  inspectRectification: Partial<DBQualityInspectRectificationI>;
  setInspectRectifition: Function;
  handleRectificationCreated: Function;
  handleUpdateRectification: Function;

  filterList: DBQualityInspectReportI[];
  setFilterList: Function;
  inspectTaskInfos: webCreateTaskI;
  setInspectTaskInfos: Function;
  getTaskList: Function;
}

const defaultContext: InspectReportContextI = {
  saveFiles() {},

  inspectCheckItemCreated: {},
  setInspectCheckItemCreated() {},

  inspectReportCreated: {},
  setInspectReportCreated() {},
  inspectReportEdit: {},
  setInspectReportEdit() {},
  handleCreatedReport() {},
  handleUpdateReport() {},
  handleCreatedCheckList() {},
  inspectReportList: [],
  setInspectReportList() {},

  inspectCheckList: [],
  setInspectCheckList() {},
  handleCraeatedCheckItem() {},

  handleConfirm() {},
  getReportList() {},

  query: {
    page: 0,
    limit: 10,
  },
  setQuery() {},
  count: 0,
  setCount() {},
  inspectRectification: {},
  setInspectRectifition() {},
  handleRectificationCreated() {},
  handleUpdateRectification() {},
  filterList: [],
  setFilterList() {},
  inspectTaskInfos: {
    _id: '',
    idRectification: '',
    idReport: '',
    idSubject: '',
    atCreated: null,
    content: [],
    level: 'common',
    progress: 0,
    files: [],
    status: 'todo',
    name: '',
    idExecutive: '',
    endTime: null,
    idsCC: [],
  },
  setInspectTaskInfos() {},
  getTaskList() {},
};

export const InspectReportContext = createContext<InspectReportContextI>(
  defaultContext
);

export const InspectReportContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { addNotification } = BaseSvc;
  const router = useRouter();
  const { action } = router.query as {
    action: 'create' | 'edit' | 'view';
  };
  const { _id } = router.query as { _id: string };

  const { account } = useContext<AuthContextI>(AuthContext);
  const { setRectificationDialog } = useContext(InspectPlanStatusContext);

  const [inspectReportCreated, setInspectReportCreated] = useState(
    defaultContext.inspectReportCreated
  );
  const [inspectReportEdit, setInspectReportEdit] = useState(
    defaultContext.inspectReportEdit
  );
  const [inspectCheckItemCreated, setInspectCheckItemCreated] = useState(
    defaultContext.inspectCheckItemCreated
  );
  const [inspectCheckList, setInspectCheckList] = useState(
    defaultContext.inspectCheckList
  );
  const [inspectReportList, setInspectReportList] = useState(
    defaultContext.inspectReportList
  );

  const [query, setQuery] = useState(defaultContext.query);
  const [count, setCount] = useState(defaultContext.count);

  const [inspectRectification, setInspectRectifition] = useState(
    defaultContext.inspectRectification
  );

  const [filterList, setFilterList] = useState(defaultContext.filterList);

  const [inspectTaskInfos, setInspectTaskInfos] = useState(
    defaultContext.inspectTaskInfos
  );

  const saveFiles = async (grid, file) => {
    let files: any = inspectReportCreated.files || [];
    let checkFiles: any = inspectCheckItemCreated.files || [];
    let taskFiles: any = inspectTaskInfos.files || [];

    const data = await inspectQualityFilesSvc.upload(file);
    data.map((item) => {
      switch (grid) {
        case 'checkItem':
          data.map((item) => {
            checkFiles.push(item);
          });
          break;
        case 'task':
          data.map((item) => {
            taskFiles.push(item);
          });
          break;
        default:
          files.push(item);
          break;
      }
    });
    switch (grid) {
      case 'checkItem':
        setInspectCheckItemCreated({
          ...inspectCheckItemCreated,
          files: checkFiles,
        });
        break;
      case 'task':
        setInspectTaskInfos({
          ...inspectTaskInfos,
          files: taskFiles,
        });
        break;
      default:
        setInspectReportCreated({
          ...inspectReportCreated,
          files,
        });
        break;
    }

    await inspectTaskSvc.update({
      _id: inspectTaskInfos._id,
      content: {
        userId: account._id,
        userName: account.userName,
        atCreated: new Date(),
        content: `上传了${file[0].name}文件`,
      },
    });
    getTaskList(inspectTaskInfos._id);
  };

  //整改
  const handleRectificationCreated = async (id) => {
    return await inspectRectificationSvc.create({
      ...inspectRectification,
      idReport: id,
    });
  };

  const handleUpdateRectification = async (id) => {
    await inspectRectificationSvc.update({
      ...inspectRectification,
      idReport: id,
    });
  };

  //创建检查内容
  const handleCraeatedCheckItem = (checkItem) => {
    setInspectCheckList([...inspectCheckList, checkItem]);
  };
  //创建检查列表
  const handleCreatedCheckList = async (id) => {
    inspectCheckList.map((item, index) => {
      item.idReport = id;
    });
    await inspectCheckItemSvc.create([...inspectCheckList]);
  };

  // 质量检查
  const handleCreatedReport = async () => {
    return await inspectReportSvc.create({
      ...inspectReportCreated,
      state:
        inspectReportCreated.result === 'qualified' ||
        inspectReportCreated.result === 'warning'
          ? 'passed'
          : 'normal',
    });
  };
  const handleUpdateReport = async () => {
    await inspectReportSvc.update({
      ...inspectReportEdit,
      _id: inspectReportCreated._id,
    });
  };

  //查询计划
  const getReportList = async () => {
    const reportId = router.query._id;
    let data, list, total;
    if (Boolean(reportId)) {
      data = await inspectReportSvc.query({
        _id: reportId,
        ...query,
      });

      await setInspectReportCreated(data);
      await setInspectCheckList(data.checkItems);
      await setInspectRectifition(data.rectification);
      await setInspectTaskInfos(data.task);
    } else {
      data = await inspectReportSvc.query({
        _id: reportId,
        ...query,
      });
      list = data.data;
      total = data.count;

      await setInspectReportList(list || []);
      await setFilterList(list);
    }

    await setCount(total);
  };

  //创建任务
  const handleTaskCreate = async (id, idReport, idSubject) => {
    const TaskContent = {
      userId: account._id,
      userName: account.userName,
      atCreated: new Date(),
      content: `建设单位创建了${inspectRectification.name}整改任务`,
    };
    inspectTaskInfos.content.push(TaskContent);

    await inspectTaskSvc.create({
      _id: shortid.generate(),
      idRectification: id,
      idReport,
      idSubject,
      atCreated: new Date(),
      content: inspectTaskInfos.content,
      level: 'common',
      progress: 0,
      status: 'todo',
      name: inspectRectification.name,
      idExecutive: inspectRectification.idExecutive,
      endTime: inspectRectification.endTime,
      idsCC: inspectRectification.idsCC,
    });
  };

  const getTaskList = async (id) => {
    let taskData = await inspectTaskSvc.query(id);

    return await setInspectTaskInfos(taskData[0]);
  };

  const handleConfirm = async () => {
    let reportInfo = await handleCreatedReport();
    await handleCreatedCheckList(reportInfo._id);
    if (
      inspectReportCreated.result === 'rectification' ||
      inspectReportCreated.result === 'shutdownRectification'
    ) {
      let rectificationInfo: any = await handleRectificationCreated(
        reportInfo._id
      );
      await handleTaskCreate(
        rectificationInfo._id,
        reportInfo._id,
        reportInfo.idSubject
      );
    }
    setInspectReportCreated({});
    setInspectCheckList([]);
    setInspectRectifition({});
  };

  useEffect(() => {
    setInspectReportList([]);
    setInspectCheckItemCreated({});
    setInspectReportCreated({});
    getReportList();
  }, [router, query]);
  const providerValue = useMemo(() => {
    return {
      saveFiles,
      inspectCheckItemCreated,
      setInspectCheckItemCreated,
      handleCreatedCheckList,
      inspectReportCreated,
      setInspectReportCreated,
      inspectReportEdit,
      setInspectReportEdit,
      inspectReportList,
      setInspectReportList,
      handleCreatedReport,
      handleUpdateReport,
      inspectCheckList,
      setInspectCheckList,
      handleCraeatedCheckItem,
      handleConfirm,
      getReportList,
      query,
      setQuery,
      count,
      setCount,

      inspectRectification,
      setInspectRectifition,
      handleRectificationCreated,
      handleUpdateRectification,

      filterList,
      setFilterList,
      inspectTaskInfos,
      setInspectTaskInfos,
      getTaskList,
    };
  }, [
    inspectCheckItemCreated,
    inspectReportCreated,
    inspectReportEdit,
    inspectCheckList,
    inspectReportList,
    query,
    count,
    inspectRectification,
    filterList,
    inspectTaskInfos,
  ]);

  return (
    <InspectReportContext.Provider value={providerValue}>
      {children}
    </InspectReportContext.Provider>
  );
};

export default InspectReportContextProvider;
