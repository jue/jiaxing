import { useContext, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import clsx from 'clsx';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import Pagination from 'antd/lib/pagination';
import Tooltip from 'antd/lib/tooltip';

import { Select } from 'antd';
import { EngineeringContext } from '../context/EngineeringContext';
import { statusInfo, level } from '../../../../constants/enums';
import { Empty, Statistic } from 'antd';

import AntdTable from '../../../components/AntdTable';
import { AuthContext, AuthContextI } from '../../../contexts/AuthContext';
import { FlowContext } from '../../../contexts/FlowContext';
import { engineeringStyles } from '../styles';

const { Option } = Select;
const { Countdown } = Statistic;

const useStyles = makeStyles(({ spacing, palette }) => {
  return createStyles({
    root: {
      width: '100%',
      padding: spacing(2),

      borderRadius: 4,
      '& .ant-table-column-sorter-inner .ant-table-column-sorter-up.active, .ant-table-column-sorter-down.active': {
        color: '#8FC220',
      },
      '& .ant-statistic-content-value': {
        fontSize: 14,
        color: '#000',
        opacity: 0.65,
      },
    },
    progressIcon: {
      display: 'flex',
      alignItems: 'center',
    },
    planName: {
      width: 200,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    button: {
      color: palette.primary.main,
      border: 0,
      cursor: 'pointer',
      background: 'none',
      outline: 'none',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      position: 'fixed',
      width: 'calc(100% - 260px)',
      bottom: 10,
      left: 250,
      backgroundColor: '#fff',
      padding: 8,
    },
    buttonI: {
      color: '#0F6EFF',
    },
    statusCircle: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      marginRight: 8,
    },
    doing: { backgroundColor: '#1890FF' },
    reject: { backgroundColor: '#FA5555' },
    done: { backgroundColor: '#8FC220' },
  });
});

const TableList = ({ data, setOpen }) => {
  const classes = useStyles({});
  const { account } = useContext<AuthContextI>(AuthContext);
  const engiClasses = engineeringStyles({});
  const {
    query,
    setQuery,
    count,
    queryAuditing,
    setEngineeringInfo,
  } = useContext(EngineeringContext);

  const { queryAuditMap } = useContext(FlowContext);

  const columns = [
    {
      title: '序号',
      dataIndex: '_id',
      render: (text, record, index) => `${index + 1}`,
      width: 70,
    },
    {
      title: '变更名称',
      ellipsis: {
        showTitle: false,
      },
      width: 258,
      render: (text) => (
        <Tooltip
          title={text.changeName}
          overlayStyle={{ background: '#fff' }}
          placement="bottomLeft"
        >
          {text.changeName}
        </Tooltip>
      ),
    },
    {
      title: '变更金额（万元）',
      render: (text) => (Number(text.estimateAmountChange) / 10000).toFixed(6),
      showSorterTooltip: false,
      sorter: (a, b) =>
        Number(a.estimateAmountChange) - Number(b.estimateAmountChange),
      width: 180,
    },
    {
      title: '发起人',
      dataIndex: 'initiator',
    },
    {
      title: '发起时间',
      render: (text) => moment(text.atCreated).format('YYYY-MM-DD'),
    },
    // {
    //   title: '倒计时',
    //   render: text => <Countdown value={text.endTime} format="HH: mm: ss" />,
    // },
    {
      title: '状态',

      render: (text, record, index) => (
        <div className={classes.progressIcon}>
          {record.status === 1 && (
            <>
              <span
                className={clsx([classes.statusCircle, classes.doing])}
              ></span>
              <span> 进行中</span>
            </>
          )}
          {record.status === 2 && (
            <>
              <span
                className={clsx([classes.statusCircle, classes.reject])}
              ></span>
              <span> 已驳回</span>
            </>
          )}
          {record.status === 3 && (
            <>
              <span
                className={clsx([classes.statusCircle, classes.reject])}
              ></span>
              <span> 已取消</span>
            </>
          )}
          {record.status === 4 && (
            <>
              <span
                className={clsx([classes.statusCircle, classes.done])}
              ></span>
              <span> 已完成</span>
            </>
          )}
        </div>
      ),
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
            // Router.pushRoute(`/engineering/changeList/view/${record._id}`);
            setEngineeringInfo(text);
            setOpen(true);
            queryAuditing(account, 'pass', text);
            queryAuditMap(text, 'GC_CHANGE');
          }}
        >
          {text.isAuth === true && text.status === 1 ? '审批' : '查看'}
        </button>
      ),
    },
  ];

  return (
    <div className={classes.root}>
      <div style={{ marginBottom: 16 }}>
        <Select
          defaultValue="全部状态"
          className={engiClasses.select}
          bordered={null}
          style={{ width: 120, marginLeft: 0 }}
          onChange={(value) => {
            setQuery({
              ...query,
              status: value,
            });
          }}
        >
          {statusInfo.map((item, index) => (
            <Option value={item.value} key={index}>
              {item.label}
            </Option>
          ))}
        </Select>
        <Select
          defaultValue="全部级别"
          className={engiClasses.select}
          bordered={null}
          style={{ margin: '0 32px', width: 120 }}
          onChange={(value) => {
            setQuery({
              ...query,
              changeLevel: value === '全部级别' ? '' : value,
            });
          }}
        >
          {level.map((item, index) => (
            <Option value={item.value} key={index}>
              {item.label}
            </Option>
          ))}
        </Select>
      </div>
      <div>
        <AntdTable
          onChange={() => console.warn(111)}
          columns={columns}
          dataSource={data}
          rowKey={(row) => row._id}
          pagination={false}
          // scroll={{ y: 590 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无数据"
              />
            ),
          }}
          onRow={(record) => {
            return {
              onClick: () => {
                //   Router.pushRoute(`/quality/inspectPlan/view/${record._id}`);
              },
            };
          }}
        />
        {Boolean(count) && (
          <div className={classes.pagination} style={{ bottom: 10 }}>
            <Pagination
              size="small"
              total={count}
              defaultCurrent={1}
              onChange={(page) => {
                setQuery({ ...query, page: page - 1 });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default TableList;
