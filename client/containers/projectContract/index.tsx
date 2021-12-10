import { withRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutPageContext } from '../layout/context/LayoutPageContext';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ProjectContractContextProvider, {
  ProjectContractContext,
} from './projectContractContext';
import ProjectTable from './projectTable';
import ContractTable from './contractTable';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      background: '#fff',
      marginTop: 10,
      padding: '23px 20px',
      borderRadius: 2,
    },
    container: {
      width: '100%',
      marginTop: 20,
    },
  });
});

const ProjectContractManage = () => {
  const classes = useStyles({});
  const { tabType, setTabType, setQuery } = useContext(ProjectContractContext);
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <div className={classes.root}>
      <Tabs
        value={tabType}
        onChange={(event, newValue) => setTabType(newValue)}
        indicatorColor="primary"
        textColor="primary"
        aria-label="full width tabs example"
      >
        <Tab label="项目设置" />
        {/* <Tab label="合同设置" /> */}
      </Tabs>

      <div className={classes.container}>
        {!Boolean(tabType) ? <ProjectTable /> : <ContractTable />}
      </div>
    </div>
  );
};

export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);

  useEffect(() => {
    setParts(['业务设置', '项目设置']);
  }, [router.query]);

  return (
    <ProjectContractContextProvider>
      <ProjectContractManage />
    </ProjectContractContextProvider>
  );
});
