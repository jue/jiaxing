import { useContext, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Tooltip, Pagination } from 'antd';

import { useRouter, withRouter } from 'next/router';
import moment from 'moment';
import { Router } from '../../../../server/next.routes';

import { AuthContext, AuthContextI } from '../../../contexts/AuthContext';

import AntdTable from '../../../components/AntdTable';
import { InspectionContext } from '../context/InspectionContext';
import {
  InspectReportDesc,
  PerilsResultsDesc,
  DataStateDesc,
} from '../../../../constants/enums';
import { FlowContext } from '../../../contexts/FlowContext';
import { find } from 'lodash';
const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
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
    button: {
      color: palette.primary.main,
      border: 0,
      cursor: 'pointer',
      background: 'none',
      outline: 'none',
    },
  })
);

const QualityInspectionTable = () => {
  const { account } = useContext<AuthContextI>(AuthContext);
  const {
    hiddenDangerList,
    count,
    setQuery,
    query,
    setHiddenDangerSubject,
    setHiddenDangerProblem,
  } = useContext(InspectionContext);
  const { queryAuditMap, setDetailInfos } = useContext(FlowContext);

  const classes = useStyles({});
  const statusArr = ['1', '2', '3', '4'];
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
      title: '检查编号',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '创建人',
      render: (text) => text.account && text.account.userName,
    },
    {
      title: '创建时间',
      render: (text) => moment(text.atCreated).format('YYYY-MM-DD'),
      key: 'atCreated',
    },
    {
      title: '检查类型',
      render: (text) => InspectReportDesc[text.type],
      key: 'type',
    },
    {
      title: '办理状态',
      render: (text) => {
        let newStatus = find(DataStateDesc, (v) => v.key == text.status);
        return <>{newStatus && newStatus.value}</>;
      },
      key: 'status',
    },
    {
      title: '检查结果',
      render: (text) => PerilsResultsDesc[text.perilsResults],
      key: 'perilsResults',
    },

    {
      title: '操作',
      render: (text, record, index) => (
        <button
          className={clsx(
            classes.button
            // text.isAuth !== false && text.status === 'doing' && classes.buttonI
          )}
          onClick={(e) => {
            e.stopPropagation();
            Router.pushRoute(`/quality/v2/inspection/view/${record._id}`);

            // setHiddenDangerSubject(text);
            // setHiddenDangerProblem(text.problemItem);
          }}
        >
          {text.isAuth
            ? account.company &&
              text.accountExecutor &&
              text.accountExecutor.company &&
              account.company._id === text.accountExecutor.company._id
              ? '回复'
              : '审批'
            : '查看'}
        </button>
      ),
    },
  ];

  return (
    <>
      <AntdTable
        styles={{ marginBottom: 30 }}
        onChange={() => console.warn(111)}
        columns={columns}
        dataSource={hiddenDangerList.data}
        rowKey={(row) => row._id}
        pagination={{
          size: 'small',
          defaultCurrent: 1,
          total: count,
          onChange: (page) => {
            setQuery({ ...query, page: page - 1 });
          },
          style: {
            display: 'flex',
            justifyContent: 'center',
            position: 'fixed',
            width: 'calc(100% - 258px)',
            bottom: 0,
            backgroundColor: '#fff',
            padding: 14,
          },
        }}
        onRow={(record) => {
          return {
            onClick: (e) => {},
          };
        }}
      />
      {/* <div className={classes.pagination}>
        <Pagination
          size="small"
          total={count}
          defaultCurrent={1}
          onChange={(page) => {
            setQuery({ ...query, page: page - 1 });
          }}
        />
      </div> */}
    </>
  );
};

export default QualityInspectionTable;
