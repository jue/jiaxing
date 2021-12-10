import React, { useContext, useEffect } from 'react';
import { withRouter } from 'next/router';
import { LayoutPageContext } from '../layout/context/LayoutPageContext';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ContractManageContextProvider, {
  ContractManageContext,
} from './context/ContractManageContext';
import { Select } from 'antd';
import AuditContractDetail from './AuditContractDetail';
import AntdTableI from './compontents/AntdTable';
import { contractType } from './enum';

const { Option } = Select;

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    contanier: {
      backgroundColor: '#fff',
      padding: '24px 0 32px',
      borderRadius: 2,
      marginTop: 16,
      height: 'calc(100% - 40px - 32px)',
    },
    sort: {
      margin: '0 0 23px 26px',
      '& .ant-select': {
        width: 104,
        height: 32,
        '& .ant-select-selector': {
          borderRadius: 4,
          '& .ant-select-selection-item': {
            color: '#000',
            fontSize: 14,
            opacity: 0.65,
          },
        },
      },
      '& .ant-select:not(.ant-select-disabled):hover .ant-select-selector': {
        borderColor: '#8fc220 !important',
      },
      '& .ant-select-focused.ant-select-single:not(.ant-select-customize-input) .ant-select-selector': {
        WebkitBoxShadow: 'none !important',
        boxShadow: 'none !important',
        borderColor: '#8fc220 !important',
      },
    },
    antdTable: {
      margin: '0 21px',
      '& .ant-table': {
        minHeight: 'calc(100vh - 345px)',
      },
    },
  });
});

const ContractTable = () => {
  const classes = useStyles({});

  return (
    <div className={classes.antdTable}>
      <AntdTableI />
    </div>
  );
};

function Topbar() {
  const classes = useStyles({});
  const { query, setQuery } = useContext(ContractManageContext);

  return (
    <div className={classes.sort}>
      <Select
        defaultValue="类型筛选"
        onChange={value => {
          setQuery({ ...query, contractType: value });
        }}
        style={{ width: 170 }}
      >
        <Option value="">全部</Option>
        <Option value="construction">施工合同</Option>
        <Option value="supervision">监理合同</Option>
        <Option value="other">其他合同（服务类）</Option>
      </Select>
      {/* <Select
        defaultValue="发起部门"
        onChange={value => {
          setQuery({ ...query, deptCreated: value });
        }}
      >
        <Option value="">全部</Option>
        <Option value="合财部">合财部</Option>
        <Option value="项目部">项目部</Option>
      </Select> */}

      <Select
        defaultValue="状态筛选"
        style={{ margin: '0 32px' }}
        onChange={value => {
          setQuery({ ...query, status: value });
        }}
      >
        <Option value="">全部</Option>
        <Option value={1}>进行中</Option>
        <Option value={4}>已完成</Option>
        <Option value={2}>已驳回</Option>
      </Select>
    </div>
  );
}

function ListContract() {
  const classes = useStyles({});
  const { auditContractDetail, query, setQuery } = useContext(
    ContractManageContext
  );

  useEffect(() => {
    setQuery({ ...query, tendertype: '', myself: '' });
  }, []);

  return (
    <>
      {/* <TitleCommon title="合同查询" content="" /> */}

      <div className={classes.contanier}>
        {auditContractDetail._id && <AuditContractDetail />}
        {!auditContractDetail._id && (
          <>
            <Topbar />
            <ContractTable />
          </>
        )}
      </div>
    </>
  );
}

export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);

  useEffect(() => {
    setParts(['合同管理', '合同查询']);
  }, [router.query]);

  return (
    <ContractManageContextProvider>
      <ListContract />
    </ContractManageContextProvider>
  );
});
