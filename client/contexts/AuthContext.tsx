import { createContext, useEffect, useMemo, useState, useContext } from 'react';

import accountSvc from '../services/accountSvc';
import { WebUpdateAccountI } from '../../typings/account';
import { Router } from '../../server/next.routes';
import useInterval from '../hooks/useInterval';
import { defaultContext } from '../containers/contractManage/context/ContractManageContext';

export type PageAuthControl = {
  isAdmin: boolean;
};

export interface AuthContextI {
  logout: Function;
  account: WebUpdateAccountI;
  setAccount: Function;
  editAccount: WebUpdateAccountI;
  setEditAccount: Function;
  pageAuthControl?: PageAuthControl;

  routerPush: (pathname: string) => void;
}
const defaultAuthContext: AuthContextI = {
  account: {
    _id: '',
    userName: '',
    idCompany: '',
    idDepartment: '',
    idsAuth: [],
    idJob: '',
    phone: '',
    email: '',
    signId: '',
    bind: null,
  },
  editAccount: {
    _id: '',
    userName: '',
    idCompany: '',
    idDepartment: '',
    idsAuth: [],
    idJob: '',
    phone: '',
    email: '',
    signId: '',
    bind: null,
  },
  setAccount() {},
  setEditAccount() {},
  logout() {},
  routerPush(pathname: string) {},
};
export const AuthContext = createContext<AuthContextI>(defaultAuthContext);

const AuthContextProvider = ({ children }) => {
  const [account, setAccount] = useState(defaultAuthContext.account);
  const [editAccount, setEditAccount] = useState(defaultAuthContext.account);
  function routerPush(pathname: string) {
    if (false) {
      return;
    }
    Router.pushRoute(pathname);
  }

  async function logout() {
    await accountSvc.logout();
    Router.replace('/login');
  }

  useEffect(() => {
    accountSvc
      .self()
      .then((data) => {
        setAccount(data);
        setEditAccount(data);
      })
      .catch(async () => {
        await logout();
      });
  }, []);

  useInterval(() => {
    accountSvc
      .self()
      .then((data) => {
        setAccount(data);
      })
      .catch(async () => {
        await logout();
      });
  }, 3.6e6);

  let providevalue = useMemo(() => {
    return {
      account,
      setAccount,
      logout,
      routerPush,
      editAccount,
      setEditAccount,
    };
  }, [
    // account && account._id,
    account,
    editAccount,
  ]);

  return (
    <AuthContext.Provider value={providevalue}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
