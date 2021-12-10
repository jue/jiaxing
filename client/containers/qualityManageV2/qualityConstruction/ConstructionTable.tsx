import { useContext } from 'react';
import clsx from 'clsx';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Tooltip, Pagination } from 'antd';

import moment from 'moment';

import AntdTable from '../../../components/AntdTable';
import { ConstructionContext } from '../context/ConstructionContext';
import {
  ConstructionStateDesc,
  SchemeTypeDesc,
} from '../../../../constants/enums';
import { find } from 'lodash';
import { FlowContext } from '../../../contexts/FlowContext';

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

const ConstructionTable = ({ setViewOpen, handleTask }) => {
  const {
    constructionList,
    count,
    setQuery,
    query,
    setConstructionInfo,
  } = useContext(ConstructionContext);
  const { queryAuditMap } = useContext(FlowContext);

  const classes = useStyles({});
  const columns = [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      key: 'index',
    },
    {
      title: '施工方案',
      render: (text, record, index) => (
        <Tooltip title={<span>{text.name}</span>} placement="bottom">
          <span className={classes.tableName}>{text.name}</span>
        </Tooltip>
      ),
      key: 'name',
    },
    {
      title: '施工方案类型',
      render: (text) => SchemeTypeDesc[text.type],
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
      title: '办理状态',
      render: (text) => {
        let newStatus = find(
          ConstructionStateDesc,
          (v) => v.key === text.status
        );
        return <>{newStatus && newStatus.value}</>;
      },
      key: 'status',
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
            setViewOpen(true);
            handleTask('SG_SCHEME', text.type);
            setConstructionInfo(text);
            queryAuditMap(text, 'SG_SCHEME');
            // setHiddenDangerProblem(text.problemItem);
          }}
        >
          {text.isAuth === true && text.status === 1 ? '审批' : '查看'}
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
        dataSource={constructionList}
        rowKey={(row) => row._id}
        pagination={{
          size: 'small',
          current: 1,
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
          onChange={page => {
            setQuery({ ...query, page: page - 1 });
          }}
        />
      </div> */}
    </>
  );
};

export default ConstructionTable;
