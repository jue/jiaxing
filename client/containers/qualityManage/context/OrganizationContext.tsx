import React, { createContext, useEffect, useState, useMemo } from 'react';

import companySvc from '../../../services/companySvc';
import departSvc from '../../../services/departSvc';

import { DBCompanyI } from '../../../../typings/company';
import { DBDepartmentI } from '../../../../typings/department';
interface OrganizationContextI {
  companyInfo: DBCompanyI[];
  handleQueryCompany: Function;
  setCompanyInfo: Function;

  departInfo: DBDepartmentI[];
  setDepartInfo: Function;
  HandleQueryDeparts: Function;
  HandleQueryDepartIndo: Function;
}

const defaultContext: OrganizationContextI = {
  companyInfo: [],
  handleQueryCompany() {},
  setCompanyInfo() {},

  departInfo: [],
  setDepartInfo() {},
  HandleQueryDeparts() {},
  HandleQueryDepartIndo() {},
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

  const [departInfo, setDepartInfo] = useState(defaultContext.departInfo);

  const handleQueryCompany = async () => {
    const data = await companySvc.query({});
    await setCompanyInfo(data);
  };

  const HandleQueryDeparts = async () => {
    const data = await departSvc.query({});
    setDepartInfo(data);
  };
  const HandleQueryDepartIndo = async (id) => {
    const data = await departSvc.query({
      idCompany: id,
    });
    setDepartInfo(data);
  };
  // useEffect(() => {
  //   handleQueryCompany();
  // }, []);

  const providerValue = useMemo(() => {
    return {
      companyInfo,
      handleQueryCompany,
      setCompanyInfo() {},

      departInfo,
      setDepartInfo,
      HandleQueryDeparts,
      HandleQueryDepartIndo,
    };
  }, [companyInfo, departInfo]);

  return (
    <OrganizationContext.Provider value={providerValue}>
      {children}
    </OrganizationContext.Provider>
  );
};

export default OrganizationContextProvider;
