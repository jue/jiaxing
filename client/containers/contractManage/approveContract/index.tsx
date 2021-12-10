import { useContext, useEffect, useState } from 'react';
import { withRouter } from 'next/router';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

// import TitleCommon from '../../../../components/Title/TitleCommon';
import { LayoutPageContext } from '../../layout/context/LayoutPageContext';

import ContractManageContextProvider, {
  ContractManageContext,
} from '../context/ContractManageContext';
import AntdTable from '../compontents/AntdTable';
import AuditContractDetail from '../AuditContractDetail';
import ReactAntTabs, {
  ReactAntTab,
} from '../compontents/ReactAntTabs/ReactAntTabs';

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    paper: {
      height: 'calc(100% - 20px)',
      marginTop: 16,
      borderRadius: 2,
      '& .ant-table': {
        minHeight: 'calc(100vh - 313px)',
      },
    },
    table: {
      padding: spacing(2, 3, 0),
      '& .MuiTabs-flexContainer': {
        justifyContent: 'flex-start',
      },
    },
  })
);
function ApproveContract() {
  const classes = useStyles({});
  const { auditContractDetail, query, setQuery } = useContext(
    ContractManageContext
  );
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setQuery({ ...query, tendertype: '', myself: true });
  }, []);

  return (
    <>
      {/* <TitleCommon title="合同审批" content="" /> */}
      <Paper className={classes.paper}>
        {auditContractDetail._id && <AuditContractDetail />}
        {!auditContractDetail._id && (
          <div className={classes.table}>
            <ReactAntTabs
              value={tabIndex}
              onChange={(_, value) => {
                setTabIndex(value);
                if (value === 0) {
                  setQuery({ ...query, myself: true, idCreatedBy: '' });
                } else {
                  setQuery({ ...query, myself: '', idCreatedBy: true });
                }
              }}
            >
              <ReactAntTab label="我的审批" />
              <ReactAntTab label="我的申请" />
            </ReactAntTabs>
            <AntdTable />
          </div>
        )}
      </Paper>
    </>
  );
}

export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);
  useEffect(() => {
    setParts(['合同管理', '合同审批']);
  }, [router.query]);
  return (
    <ContractManageContextProvider>
      <ApproveContract />
    </ContractManageContextProvider>
  );
});
