import { useContext, useEffect, useMemo, useState } from 'react';

import { Box, Button, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Tooltip, Pagination } from 'antd';

import { useRouter, withRouter } from 'next/router';
import moment from 'moment';
import { Router } from '../../../../server/next.routes';

import { AuthContext, AuthContextI } from '../../../contexts/AuthContext';
import { LayoutPageContext } from '../../layout/context/LayoutPageContext';
import InspectQualityStatusContextProvider from '../context/InspectPlanStatusContext';
import { InspectReportContext } from '../context/InspectReportContext';
import InspectReportContextProvider from '../context/InspectReportContext';

import AntdTable from '../../../components/AntdTable';
import Datepicker from '../../../components/Datepicker';
import FilterTable from '../../../components/FilterTable';
import OverTime from '../../../components/Svgs/OverTime';

import InspectViewReport from './InspectViewReport';
import SubjectDialog from './SubjectDialog';
import { InspectFileViewDialog } from '../InspectPlan/InspectFileViewDialog';
// import InspectQualityStatusContextProvider from '../context/InspectPlanStatusContext';
// import { AuthContext, AuthContextI } from '../../../contexts/AuthContext';
import { OrganizationContextProvider } from '../context/OrganizationContext';
import RectificationDialog from './SubjectDialog/RectificationDialog';

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    paper: {
      height: '100%',
      overflow: 'hidden',
    },
    tableName: {
      display: 'block',
      width: '170px !important',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      position: 'fixed',
      width: 'calc(100% - 258px)',
      bottom: 16,
      backgroundColor: '#fff',
      padding: 14,
    },
    typography: {
      marginLeft: spacing(0.5),
    },
    progress: {
      width: 300,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    editButton: {
      backdropFilter: '#fff',
      border: 0,
      color: '#597EF7',
      padding: '0 10px',
      cursor: 'pointer',
    },
  })
);

const Search = () => {
  const { query, setQuery } = useContext(InspectReportContext);
  const { account } = useContext<AuthContextI>(AuthContext);

  return (
    <Box p={2} display="flex">
      <Box flex="1">
        <Datepicker
          placeholder="请选择创建时间"
          bordered={true}
          onChange={d => {
            if (d) {
              setQuery({ ...query, atCreated: moment(d).format('YYYY-MM-DD') });
            } else {
              setQuery({ ...query, atCreated: '' });
            }
          }}
        />
      </Box>
      {account.company && account.company.type === 'buildingUnit' && (
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => {
            Router.pushRoute('/quality/inspectReport/create');
          }}
        >
          创建检查计划
        </Button>
      )}
    </Box>
  );
};

const TableList = () => {
  const { account } = useContext<AuthContextI>(AuthContext);

  const classes = useStyles({});
  const {
    inspectReportList,
    query,
    setQuery,
    getReportList,
    setInspectReportList,
    count,
    filterList,
  } = useContext(InspectReportContext);

  const columns = [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      key: 'index',
    },
    {
      title: '检查主题',
      render: (text, record, index) => (
        <Tooltip title={<span>{text.name}</span>} placement="bottom">
          <span className={classes.tableName}>{text.name}</span>
        </Tooltip>
      ),
      key: 'name',
    },
    {
      title: '编号',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '编辑时间',
      render: text => moment(text.atCreated).format('YYYY-MM-DD'),
      key: 'atCreated',
    },
    {
      title: () => (
        <FilterTable
          title="检查类型"
          filterContent={[
            {
              text: '施工单位自检',
              value: 'constructionUnit',
            },
            {
              text: '监理单位检查',
              value: 'supervisionUnit',
            },
            {
              text: '建设单位检查',
              value: 'developmentUnit',
            },
            {
              text: '项目联合检查',
              value: 'projectJoint',
            },
            {
              text: '其他',
              value: 'other',
            },
            {
              text: '全部',
              value: 'all',
            },
          ]}
          onchange={val => {
            let data;
            if (val.value === 'all') {
              data = filterList;
            } else {
              data = filterList.filter(_item => _item.type === val.value);
            }

            setInspectReportList(data);
          }}
        />
      ),
      render: text => {
        let type = '';
        switch (text.type) {
          case 'constructionUnit':
            type = '施工单位自检';
            break;
          case 'supervisionUnit':
            type = '监理单位检查';
            break;
          case 'developmentUnit':
            type = '建设单位检查';
            break;
          case 'projectJoint':
            type = '项目联合检查';
            break;
          default:
            type = '其他';
        }
        return <span>{type}</span>;
      },
      key: 'type',
    },
    {
      title: () => (
        <FilterTable
          title="办理结果"
          filterContent={[
            {
              text: '检查完成',
              value: 'passed',
            },
            {
              text: '待整改',
              value: 'normal',
            },
            {
              text: '待验收',
              value: 'acceptance',
            },
            {
              text: '全部',
              value: 'all',
            },
          ]}
          onchange={val => {
            let data;
            if (val.value === 'all') {
              data = filterList;
            } else {
              data = filterList.filter(_item => _item.type === val.value);
            }
            setInspectReportList(data);
          }}
        />
      ),
      key: 'status',
      render: (text, record) => {
        const acceptanceStatus = {
          normal: '待整改',
          acceptance: '待验收',
          passed: '检查完成',
        };

        return (
          <Box display="flex" flexDirection="row">
            <Typography
              variant="body2"
              component="div"
              onClick={async e => {
                window.localStorage.setItem('qualityTitle', 'rectification');
                e.stopPropagation();
                if (
                  (account.company.type === 'buildingUnit' &&
                    text.state !== 'passed') ||
                  (account.company.type === 'constructionUnit' &&
                    text.state === 'normal')
                ) {
                  Router.pushRoute(`/quality/inspectReport/view/${record._id}`);

                  getReportList(record._id);
                }
              }}
            >
              {acceptanceStatus[text.state]}
            </Typography>

            {new Date(text.task?.endTime) > new Date() &&
              text.task?.status === 'done' && (
                <Box flex="1" ml={2} alignItems="center">
                  <OverTime />
                  <Typography
                    variant="caption"
                    color="error"
                    className={classes.typography}
                  >
                    已超期
                  </Typography>
                </Box>
              )}
          </Box>
        );
      },
    },
    {
      title: () => (
        <FilterTable
          title="检查结果"
          filterContent={[
            {
              text: '合格',
              value: 'qualified',
            },
            {
              text: '预警',
              value: 'warning',
            },
            {
              text: '整改',
              value: 'rectification',
            },
            {
              text: '停工整改',
              value: 'shutdownRectification',
            },
            {
              text: '全部',
              value: 'all',
            },
          ]}
          onchange={val => {
            let data;
            if (val.value === 'all') {
              data = filterList;
            } else {
              data = filterList.filter(_item => _item.result === val.value);
            }

            setInspectReportList(data);
          }}
        />
      ),
      render: text => {
        let resultI = '';
        switch (text.result) {
          case 'qualified':
            resultI = '合格';
            break;
          case 'warning':
            resultI = '预警';
            break;
          case 'rectification':
            resultI = '整改';
            break;
          case 'shutdownRectification':
            resultI = '停工整改';
            break;
          default:
            resultI = '';
        }
        return <span>{resultI}</span>;
      },
      key: 'result',
    },
  ];

  return (
    <>
      <AntdTable
        onChange={() => console.warn(111)}
        columns={columns}
        dataSource={inspectReportList || []}
        rowKey={row => row._id}
        pagination={false}
        onRow={record => {
          return {
            onClick: e => {
              e.stopPropagation();
              window.localStorage.setItem('qualityTitle', 'report');
              Router.pushRoute(`/quality/inspectReport/view/${record._id}`);
            },
          };
        }}
      />
      <div className={classes.pagination}>
        <Pagination
          size="small"
          total={count}
          defaultCurrent={1}
          onChange={page => {
            setQuery({ ...query, page: page - 1 });
          }}
        />
      </div>
    </>
  );
};

const InspectReport = () => {
  const classes = useStyles({});
  const router = useRouter();

  const { action } = router.query as {
    action: 'create' | 'edit' | 'view';
  };
  let component = null;

  switch (action) {
    case 'create':
    case 'edit':
      component = <SubjectDialog />;
      break;
    case 'view':
      component = <InspectViewReport />;
      break;
    default:
      component = (
        <>
          <Search />
          <TableList />
        </>
      );
      break;
  }

  return <Paper className={classes.paper}>{component}</Paper>;
};

export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);

  useEffect(() => {
    setParts(['质量管理', '质量检查']);
  }, [router.query]);

  return (
    <InspectReportContextProvider>
      <InspectQualityStatusContextProvider>
        <OrganizationContextProvider>
          <InspectReport />
          <InspectFileViewDialog />
          <RectificationDialog />
        </OrganizationContextProvider>
      </InspectQualityStatusContextProvider>
    </InspectReportContextProvider>
  );
});
