import React, { createContext, useEffect, useState, useMemo } from 'react';
import {
  WebQualityInspectPlan,
  InspectionState,
} from '../../../../typings/quality_inspect_plan';
import { WebQualityInspectSubjectI } from '../../../../typings/quality_inspect_subject';
import inspectPlanSvc from '../../../services/InspectPlanSvc';
import inspectSubjectSvc from '../../../services/InspectSubjectSvc';
import accountSvc from '../../../services/accountSvc';

import { useRouter } from 'next/router';
import inspectQualityFilesSvc from '../../../services/InspectQualityFilesSvc';
import _ from 'lodash';
interface InspectPlanReqContextI {
  inspectCreatedPlan: Partial<WebQualityInspectPlan>;
  setInspectCreatedPlan: Function;
  inspectCreatedPlanSubject: Partial<WebQualityInspectSubjectI>;
  setInspectCreatedPlanSubject: Function;
  inspectPlanSubjectList: Partial<WebQualityInspectSubjectI>[];
  setInspectPlanSubjectList: Function;
  hadleCraeatedSubjectList: Function;
  handleCreatedPlan: Function;
  handleConfirm: Function;
  inspectListPlan: WebQualityInspectPlan[];
  setInspectListPlan: Function;
  handleInspectPlanDelete: Function;
  getPlanList: Function;
  query: {
    page: number;
    limit: number;
  };
  count: number;
  setCount: Function;
  setQuery: Function;
  subjectDeleteDialog: string;
  setSubjectDeleteDialog: Function;
  editInspectPlan: Partial<WebQualityInspectPlan>;
  setEditInspectPlan: Function;
  handleEditPlanCreatedSub: Function;
  handleDeleteSubject: Function;
  saveFiles: Function;
  handleQuerySubjects: Function;
  queryTaskStatus: {
    delayCount: number;
    progressAvg: number;
  };
  setQueryTaskStatus: Function;
  handleUpdateSubjects: Function;
  handleCreatedSubjects: Function;
  dragList: Partial<WebQualityInspectSubjectI>[];
  queryUserName: Function;
  queryPersonnelList: any[];
  setQueryPersonnelList: Function;
}

const defaultContext: InspectPlanReqContextI = {
  inspectCreatedPlan: {
    _id: '',
    files: [],
    desc: '',
    name: '',
    number: '',
    startTime: new Date(),
    atCreated: new Date(),
    schedule: '',
    state: 'notstart',
    idsSubject: [],
    createFiles: [],
  },
  setInspectCreatedPlan() {},
  inspectCreatedPlanSubject: {
    _id: '',
    name: '',
    method: '',
    frequency: '',
    count: 0,
    type: '',
    allocateObjects: '',
    startTime: new Date(),
    endTime: new Date(),
    files: [],
    idPlan: '',
    distributionState: '',
    progress: '',
    atCreated: new Date(),
  },
  setInspectCreatedPlanSubject() {},
  inspectPlanSubjectList: [
    {
      _id: '',
      name: '',
      method: 'day',
      frequency: 'week',
      count: 0,
      type: 'constructionUnit',
      allocateObjects: '',
      startTime: new Date(),
      endTime: new Date(),
      files: [],
      idPlan: '',
      distributionState: '',
      progress: '',
      atCreated: new Date(),
    },
  ],
  setInspectPlanSubjectList() {},
  hadleCraeatedSubjectList() {},
  handleCreatedPlan() {},
  handleConfirm() {},
  inspectListPlan: [],
  setInspectListPlan() {},
  handleInspectPlanDelete() {},
  getPlanList() {},
  query: {
    page: 0,
    limit: 10,
  },
  setQuery() {},
  count: 0,
  setCount() {},
  subjectDeleteDialog: '',
  setSubjectDeleteDialog() {},
  editInspectPlan: {},
  setEditInspectPlan() {},
  handleEditPlanCreatedSub() {},
  handleDeleteSubject() {},
  saveFiles() {},
  handleQuerySubjects() {},
  queryTaskStatus: {
    delayCount: 0,
    progressAvg: 0,
  },
  setQueryTaskStatus() {},
  handleUpdateSubjects() {},
  handleCreatedSubjects() {},
  dragList: [],
  queryUserName() {},
  queryPersonnelList: [],
  setQueryPersonnelList() {},
};

export const InspectPlanReqContext = createContext<InspectPlanReqContextI>(
  defaultContext
);

export const InspectPlanReqContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [inspectCreatedPlan, setInspectCreatedPlan] = useState(
    defaultContext.inspectCreatedPlan
  );
  const [inspectCreatedPlanSubject, setInspectCreatedPlanSubject] = useState(
    defaultContext.inspectCreatedPlanSubject
  );
  const [inspectPlanSubjectList, setInspectPlanSubjectList] = useState(
    defaultContext.inspectPlanSubjectList
  );
  const [query, setQuery] = useState(defaultContext.query);
  const [count, setCount] = useState(defaultContext.count);
  const [editInspectPlan, setEditInspectPlan] = useState(
    defaultContext.editInspectPlan
  );
  const [inspectListPlan, setInspectListPlan] = useState(
    defaultContext.inspectListPlan
  );
  const [subjectDeleteDialog, setSubjectDeleteDialog] = useState(
    defaultContext.subjectDeleteDialog
  );
  const [queryTaskStatus, setQueryTaskStatus] = useState(
    defaultContext.queryTaskStatus
  );
  const [dragList, setDragList] = useState(defaultContext.dragList);
  const [queryPersonnelList, setQueryPersonnelList] = useState(
    defaultContext.queryPersonnelList
  );

  const router = useRouter();
  const { action } = router.query as {
    action: 'create' | 'edit' | 'view';
  };
  const { _id } = router.query as { _id: string };

  const hadleCraeatedSubjectList = planSubject => {
    setInspectPlanSubjectList([...inspectPlanSubjectList, planSubject]);
  };

  const handleCreatedPlan = async () => {
    return await inspectPlanSvc.create({
      ...inspectCreatedPlan,
    });
  };

  const handleUpdatePlan = async () => {
    return await inspectPlanSvc.update({
      ...editInspectPlan,
      _id: inspectCreatedPlan._id,
    });
  };

  const handleInspectPlanDelete = async id => {
    await inspectPlanSvc.delete(id);
    await getPlanList();
  };

  const handleConfirm = async () => {
    if (action === 'edit') {
      await handleUpdatePlan();
    } else {
      let planInfo = await handleCreatedPlan();
      await handleCreatedSubjects(planInfo._id);
    }
  };

  const handleQuerySubjects = async delay => {
    const data = await inspectSubjectSvc.query({ delay, idPlan: _id });
    await setInspectPlanSubjectList(data.data);
    await setDragList(data.data);
    await setQueryTaskStatus({
      delayCount: data.delayCount,
      progressAvg: data.progressAvg,
    });
  };

  const handleCreatedSubjects = async id => {
    let pos = Math.pow(2, 14);
    const listPos =
      inspectPlanSubjectList.length !== 0
        ? inspectPlanSubjectList.length * pos
        : pos;
    if (action === 'create') {
      await inspectPlanSubjectList.map((item, index) => {
        item.idPlan = id;
        item.pos = pos * (index + 1);
        inspectSubjectSvc.create(item);
      });
    } else {
      await inspectSubjectSvc.create({
        ...inspectCreatedPlanSubject,
        idPlan: _id,
        pos: listPos,
      });
    }
    await handleQuerySubjects('');
  };
  const handleUpdateSubjects = async subject => {
    await inspectSubjectSvc.update({
      ...subject,
    });
    await handleQuerySubjects('');
  };

  const handleEditPlanCreatedSub = async () => {
    await inspectSubjectSvc.create({
      ...inspectCreatedPlanSubject,
      idPlan: inspectCreatedPlan._id,
    });
    await getPlanList();
  };

  const handleDeleteSubject = async id => {
    await inspectSubjectSvc.delete(id);
    await handleQuerySubjects('');
  };

  const getPlanList = async () => {
    let data, list, total;
    if (_id) {
      data = await inspectPlanSvc.query({
        _id: _id,
        ...query,
      });
      await setInspectCreatedPlan(data);
    } else {
      data = await inspectPlanSvc.query({
        _id: _id,
        ...query,
      });
      list = data.data;
      total = data.count;
      await setInspectListPlan(list || []);
    }
    await setCount(total);
  };

  const saveFiles = async (grid, file) => {
    let files: any =
      grid === 'plan'
        ? inspectCreatedPlan.files || []
        : inspectCreatedPlanSubject.files || [];
    let editFiles: any = editInspectPlan.files || [];
    const data = await inspectQualityFilesSvc.upload(file);
    data.map(item => {
      files.push(item);
      editFiles.push(item);
    });
    if (grid === 'plan') {
      setInspectCreatedPlan({
        ...inspectCreatedPlan,
        files: files,
      });
    }
    if (grid === 'subject') {
      setInspectCreatedPlanSubject({
        ...inspectCreatedPlanSubject,
        files: files,
      });
    }
    if (action === 'edit') {
      setEditInspectPlan({
        ...editInspectPlan,
        createFiles: editFiles,
      });
    }
  };

  const queryUserName = async (name: string) => {
    if (!name) {
      setQueryPersonnelList([]);
      return;
    }
    const data = await accountSvc.search({ userName: name });
    let userNameList = [...queryPersonnelList] || [];
    data.data.length &&
      data.data.map(item => {
        userNameList.push(item.userName);
      });
    setQueryPersonnelList(_.uniq(userNameList));
  };

  useEffect(() => {
    if (action !== 'create') {
      handleQuerySubjects('');
    }
    setInspectPlanSubjectList([]);
    setInspectCreatedPlan({});
    getPlanList();
    setSubjectDeleteDialog('');
  }, [router, query]);

  const providerValue = useMemo(() => {
    return {
      inspectCreatedPlan,
      setInspectCreatedPlan,
      inspectCreatedPlanSubject,
      setInspectCreatedPlanSubject,
      inspectPlanSubjectList,
      hadleCraeatedSubjectList,
      setInspectPlanSubjectList,
      handleCreatedPlan,
      handleConfirm,
      inspectListPlan,
      setInspectListPlan,
      handleInspectPlanDelete,
      getPlanList,
      query,
      setQuery,
      count,
      setCount,
      subjectDeleteDialog,
      setSubjectDeleteDialog,
      editInspectPlan,
      setEditInspectPlan,
      handleEditPlanCreatedSub,
      handleDeleteSubject,
      saveFiles,
      handleQuerySubjects,
      queryTaskStatus,
      setQueryTaskStatus,
      handleUpdateSubjects,
      handleCreatedSubjects,
      dragList,
      queryUserName,
      queryPersonnelList,
      setQueryPersonnelList,
    };
  }, [
    inspectCreatedPlan,
    inspectCreatedPlanSubject,
    inspectPlanSubjectList,
    inspectListPlan,
    query,
    count,
    subjectDeleteDialog,
    editInspectPlan,
    queryTaskStatus,
    dragList,
    queryPersonnelList,
  ]);

  return (
    <InspectPlanReqContext.Provider value={providerValue}>
      {children}
    </InspectPlanReqContext.Provider>
  );
};

export default InspectPlanReqContextProvider;
