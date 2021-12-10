import { createContext, useState, useMemo, useEffect } from 'react';
import { DBCompanyI, WebUpdateCompanyI } from '../../../../typings/company';
import {
  DBDepartmentI,
  WebUpdateDepartmentI,
} from '../../../../typings/department';
import { DBJobI, WebUpdateJobI } from '../../../../typings/job';

import { OrganizationTabType } from '../../../../constants/enums';

import companySvc from '../../../services/companySvc';
import departSvc from '../../../services/departSvc';
import jobSvc from '../../../services/jobSvc';

interface OrganizationContextI {
  companyInfo: WebUpdateCompanyI;
  setCompanyInfo: Function;

  companyInfos: DBCompanyI[];
  setCompanyInfos: Function;

  departInfo: WebUpdateDepartmentI;
  setDepartInfo: Function;

  departInfos: DBDepartmentI[];
  setDepartInfos: Function;

  jobInfo: WebUpdateJobI;
  setJobInfo: Function;

  jobInfos: DBJobI[];
  setJobInfos: Function;

  currentTab: string;
  setCurrentTab: Function;

  handleCreateCompany: Function;
  handleUpdateCompany: Function;
  handleDeleteCompany: Function;

  handleCreateDepart: Function;
  handleUpdateDepart: Function;
  handleDeleteDepart: Function;

  handleCreateJob: Function;
  handleUpdateJob: Function;
  handleDeleteJob: Function;
}

const defaultContext: OrganizationContextI = {
  companyInfo: {
    _id: '',
    name: '',
    parentId: '',
    path: '',
    type: '',
    idsDepartment: [],
  },
  setCompanyInfo() {},

  companyInfos: [],
  setCompanyInfos() {},

  departInfo: {
    _id: '',
    name: '',
    parentId: '',
    path: '',
    idCompany: '',
    idsPosition: [],
  },
  setDepartInfo() {},

  departInfos: [],
  setDepartInfos() {},

  jobInfo: {
    _id: '',
    name: '',
    parentId: '',
    path: '',
    idCompany: '',
    idDepartment: '',
  },
  setJobInfo() {},

  jobInfos: [],
  setJobInfos() {},

  currentTab: OrganizationTabType.Company,
  setCurrentTab() {},

  handleCreateCompany() {},
  handleUpdateCompany() {},
  handleDeleteCompany() {},

  handleCreateDepart() {},
  handleUpdateDepart() {},
  handleDeleteDepart() {},

  handleCreateJob() {},
  handleUpdateJob() {},
  handleDeleteJob() {},
};

export const OrganizationContext = createContext<OrganizationContextI>(
  defaultContext
);

export const OrganizationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [companyInfo, setCompanyInfo] = useState(defaultContext.companyInfo);

  const [companyInfos, setCompanyInfos] = useState(defaultContext.companyInfos);

  const [departInfo, setDepartInfo] = useState(defaultContext.departInfo);

  const [departInfos, setDepartInfos] = useState(defaultContext.departInfos);

  const [jobInfo, setJobInfo] = useState(defaultContext.jobInfo);

  const [jobInfos, setJobInfos] = useState(defaultContext.jobInfos);

  const [currentTab, setCurrentTab] = useState(defaultContext.currentTab);

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

  const handleCreateCompany = async () => {
    try {
      await companySvc.create({
        ...companyInfo,
        parentId: companyInfo.parentId || '0',
        path: companyInfo.parentId ? `/${companyInfo.parentId}` : '/',
      });
      await queryCompanys();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateDepart = async () => {
    try {
      await departSvc.create({
        ...departInfo,
        parentId: departInfo.parentId || '0',
        path: departInfo.parentId ? `/${departInfo.parentId}` : '/',
      });
      await queryDeparts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateJob = async () => {
    try {
      await jobSvc.create({
        ...jobInfo,
        parentId: jobInfo.parentId || '0',
        path: jobInfo.parentId ? `/${jobInfo.parentId}` : '/',
      });
      await queryJobs();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateCompany = async () => {
    try {
      await companySvc.update({
        ...companyInfo,
        parentId: companyInfo.parentId || '0',
        path: companyInfo.parentId ? `/${companyInfo.parentId}` : '/',
      });
      await queryCompanys();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateDepart = async () => {
    try {
      await departSvc.update({
        ...departInfo,
        parentId: departInfo.parentId || '0',
        path: departInfo.parentId ? `/${departInfo.parentId}` : '/',
      });
      await queryDeparts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateJob = async () => {
    try {
      await jobSvc.update({
        ...jobInfo,
        parentId: jobInfo.parentId || '0',
        path: jobInfo.parentId ? `/${jobInfo.parentId}` : '/',
      });
      await queryJobs();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCompany = async (_id) => {
    try {
      await companySvc.delete(_id);
      await queryCompanys();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteDepart = async (_id) => {
    try {
      await departSvc.delete(_id);
      await queryDeparts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteJob = async (_id) => {
    try {
      await jobSvc.delete(_id);
      await queryJobs();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    queryCompanys();
    queryDeparts();
    queryJobs();
  }, [currentTab]);

  const providerValue = useMemo(() => {
    return {
      companyInfo,
      setCompanyInfo,

      companyInfos,
      setCompanyInfos,

      departInfo,
      setDepartInfo,

      departInfos,
      setDepartInfos,

      jobInfo,
      setJobInfo,

      jobInfos,
      setJobInfos,

      currentTab,
      setCurrentTab,

      handleCreateCompany,
      handleUpdateCompany,
      handleDeleteCompany,

      handleCreateDepart,
      handleUpdateDepart,
      handleDeleteDepart,

      handleCreateJob,
      handleUpdateJob,
      handleDeleteJob,
    };
  }, [companyInfo, companyInfos, departInfo, departInfos, jobInfo, jobInfos]);

  return (
    <OrganizationContext.Provider value={providerValue}>
      {children}
    </OrganizationContext.Provider>
  );
};

export default OrganizationContextProvider;
