import React, { createContext, useEffect, useMemo, useState } from 'react';
import modelSvc from '../services/modelSvc';
import { FRONT_END_DBModelI } from '../../typings/model';
import { useRouter } from 'next/router';

export interface BIMComparedContext {
  modelInfos: FRONT_END_DBModelI[];
  setModelInfos: Function;
  // modelList:FRONT_END_DBModelI[];
  // setModelList:Function
}

const defaultBIMComparedContext: BIMComparedContext = {
  modelInfos: [],
  setModelInfos() {},
};

export const BIMComparedContext = createContext<BIMComparedContext>(
  defaultBIMComparedContext
);

const BIMComparedContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [modelInfos, setModelInfos] = useState(
    defaultBIMComparedContext.modelInfos
  );
  const router = useRouter();
  const { name } = router.query;
  const queryModel = async () => {
    modelSvc.query({ name }).then((data) => {
      setModelInfos(data.data);
    });
  };

  // const queryAllModel = async () => {
  //   try {
  //     const data = await modelSvc.query({
  //       last: '',
  //       name: '',
  //       end: '',
  //     });
  //     let list =
  //       data.count === 0 ? defaultModelManageContext.modelTable : data.data;
  //     if (last && data) {
  //       setCreateModelInfo({
  //         ...createModelInfo,
  //         name: name,
  //         version: data[0].version,
  //       });
  //     } else {
  //       setModelTable([...list]);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    queryModel();
    // queryAllModel()
  }, []);

  let providerValue = useMemo(() => {
    return { modelInfos, setModelInfos };
  }, [modelInfos]);

  return (
    <BIMComparedContext.Provider value={providerValue}>
      {children}
    </BIMComparedContext.Provider>
  );
};

export default BIMComparedContextProvider;
