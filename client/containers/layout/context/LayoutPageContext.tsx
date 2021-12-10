import {
  createContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useMemo,
} from 'react';

export interface LayoutPageContextI {
  openSideBar: boolean;
  setOpenSideBar: Dispatch<SetStateAction<boolean>>;
  parts: string[];
  setParts?: Function;
}

const defaultLayoutPageContext: LayoutPageContextI = {
  openSideBar: false,
  setOpenSideBar() {},
  parts: [],
};

export const LayoutPageContext = createContext<LayoutPageContextI>(
  defaultLayoutPageContext
);

const LayoutPageContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [openSideBar, setOpenSideBar] = useState(false);
  const [parts, setParts] = useState(defaultLayoutPageContext.parts);

  let providerValue = useMemo(() => {
    return {
      openSideBar,
      setOpenSideBar,
      parts,
      setParts,
    };
  }, [openSideBar, parts.toString()]);

  return (
    <LayoutPageContext.Provider value={providerValue}>
      {children}
    </LayoutPageContext.Provider>
  );
};

export default LayoutPageContextProvider;
