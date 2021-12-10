import React, { useContext, useEffect } from 'react';
import { LayoutPageContext } from '../layout/context/LayoutPageContext';
import { withRouter } from 'next/router';
import { Select } from 'antd';
import ModelManageContextProvider, {
  ModelManageContext,
} from './context/ModelManageContext';
import ModelPreview from './ModelPreview';
import TableList from './ModelTable';
import { useStyles } from './ModelStyles';
import BIMCompared from '../../components/BIMCompared';

const { Option } = Select;

function TopBar() {
  const classes = useStyles({});
  const { projectInfos, contractInfos, query, setQuery } = useContext(
    ModelManageContext
  );

  return (
    <div className={classes.topBar}>
      <Select
        placeholder="全部项目"
        bordered={false}
        className={classes.select}
        onChange={id => {
          setQuery({ ...query, idEngineering: id });
        }}
      >
        <Option value="">全部项目</Option>
        {projectInfos.map(item => (
          <Option value={item._id} key={item._id}>
            {item.name}
          </Option>
        ))}
      </Select>
      <Select
        placeholder="全部合同"
        bordered={false}
        className={classes.select}
        onChange={id => {
          setQuery({ ...query, idContract: id });
        }}
      >
        <Option value="">全部合同</Option>
        {contractInfos.map(item => (
          <Option value={item._id} key={item._id}>
            {item.name}
          </Option>
        ))}
      </Select>
    </div>
  );
}

function ModelList() {
  const classes = useStyles({});
  const {
    model,
    setModel,
    bimModelCompared,
    setBimModelCompared,
    modelAllList,
    queryModelVersion,
  } = useContext(ModelManageContext);

  return (
    <div className={classes.modelList}>
      {!Boolean(model.pathname) && !Boolean(bimModelCompared._id) && (
        <>
          <TopBar />
          <TableList />
        </>
      )}
      {Boolean(model.pathname) && !Boolean(bimModelCompared._id) && (
        <ModelPreview setModel={setModel} model={model} />
      )}
      {Boolean(bimModelCompared._id) && (
        <BIMCompared
          modelInfo={bimModelCompared}
          modelInfos={modelAllList}
          func={setBimModelCompared}
          queryAllModel={queryModelVersion}
        />
      )}
    </div>
  );
}

export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);

  useEffect(() => {
    setParts(['模型管理', '模型列表']);
  }, [router.query]);

  return (
    <ModelManageContextProvider>
      <ModelList />
    </ModelManageContextProvider>
  );
});
