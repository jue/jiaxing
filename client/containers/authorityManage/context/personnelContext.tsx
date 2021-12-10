import { createContext, useState, useMemo, useEffect } from 'react';
import {
  WebUpdateAccountI,
  WebCreateAccountI,
  DBAccountI,
} from '../../../../typings/account';
import { DBAuthI } from '../../../../typings/auth';
import accountSvc from '../../../services/accountSvc';
import authSvc from '../../../services/authSvc';

interface PersonnelContextI {
  personnelInfo: WebUpdateAccountI | WebCreateAccountI;
  setPersonnelInfo: Function;

  personnelInfos: DBAccountI[];
  setPersonnelInfos: Function;

  authorizes: DBAuthI[];

  handleCreate: Function;
  handleUpdate: Function;
  handleDelete: Function;

  query: {
    page: number;
    limit: number;
    userName: string;
  };
  count: number;
  setCount: Function;
  setQuery: Function;
}

const defaultContext: PersonnelContextI = {
  personnelInfo: {
    userName: '',
    idCompany: '',
    idDepartment: '',
    idsAuth: [],
    idJob: '',
    phone: '',
    email: '',
  },
  setPersonnelInfo() {},

  personnelInfos: [],
  setPersonnelInfos() {},

  authorizes: [],

  handleCreate() {},
  handleUpdate() {},
  handleDelete() {},

  query: {
    page: 0,
    limit: 10,
    userName: '',
  },
  setQuery() {},
  count: 0,
  setCount() {},
};

export const PersonnelContext = createContext<PersonnelContextI>(
  defaultContext
);

export const PersonnelContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [personnelInfo, setPersonnelInfo] = useState(
    defaultContext.personnelInfo
  );

  const [personnelInfos, setPersonnelInfos] = useState(
    defaultContext.personnelInfos
  );
  const [authorizes, setAuthorize] = useState(defaultContext.authorizes);
  const [query, setQuery] = useState(defaultContext.query);
  const [count, setCount] = useState(defaultContext.count);

  const querypersonnels = async () => {
    try {
      const data = await accountSvc.search(query);
      setPersonnelInfos(data.data);
      setCount(data.count);
    } catch (error) {
      console.log(error);
    }
  };

  const queryAuthrize = async () => {
    try {
      const data = await authSvc.search({});
      setAuthorize(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = async () => {
    try {
      await accountSvc.create({ ...personnelInfo });
      await querypersonnels();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      await accountSvc.update({ ...personnelInfo });
      await querypersonnels();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async _id => {
    try {
      await accountSvc.delete(_id);
      await querypersonnels();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    querypersonnels();
  }, [query]);

  useEffect(() => {
    queryAuthrize();
  }, []);

  const providerValue = useMemo(() => {
    return {
      personnelInfo,
      setPersonnelInfo,

      personnelInfos,
      setPersonnelInfos,

      authorizes,

      handleCreate,
      handleUpdate,
      handleDelete,

      query,
      setQuery,
      count,
      setCount,
    };
  }, [query, count, personnelInfo, personnelInfos]);

  return (
    <PersonnelContext.Provider value={providerValue}>
      {children}
    </PersonnelContext.Provider>
  );
};

export default PersonnelContextProvider;
