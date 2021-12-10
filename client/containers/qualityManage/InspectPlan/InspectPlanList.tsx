import { useContext } from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import Pagination from 'antd/lib/pagination';
import Tooltip from 'antd/lib/tooltip';

import moment from 'moment';

import AntdTable from '../../../components/AntdTable';
import Datepicker from '../../../components/Datepicker';
import Finished from '../../../components/Svgs/Finished';
import InProgress from '../../../components/Svgs/InProgress';
import { InspectPlanReqContext } from '../context/InspectPlanReqContext';
import { InspectPlanStatusContext } from '../context/InspectPlanStatusContext';
import NotStarted from '../../../components/Svgs/NotStarted';
import OverTime from '../../../components/Svgs/OverTime';

import { Router } from '../../../../server/next.routes';

const useStyles = makeStyles(() => {
  return createStyles({
    tableBox: {
      width: '100%',
      // borderRadius: 4,
      // boxShadow:
      //   '0px 0px 3px 0px rgba(0,0,0,0.1),0px 0px 0px 1px rgba(0,0,0,0.05)',
      // background: '#fff',
      // padding: 14,
    },
    tableTitle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 14,
    },
    createAdd: {
      width: 20,
      height: 20,
      border: '1px solid #fff',
      borderRadius: '100%',
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
    planName: {
      width: 200,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    planProgress: {
      width: 300,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    progress: {
      width: 120,
      height: 6,
      background: 'rgba(245,245,245,1)',
      borderRadius: 8,
    },
    progressGray: {
      height: 6,
      background: 'rgba(0,0,0,0.45)',
      borderRadius: 8,
    },
    progressGreen: {
      height: 6,
      background: '#8FC220',
      borderRadius: 8,
    },
    progressIcon: {
      display: 'flex',
      alignItems: 'center',
    },
    editButton: {
      backdropFilter: '#fff',
      border: 0,
      color: '#597EF7',
      padding: '0 10px',
      cursor: 'pointer',
    },
    overtime: {
      color: '#FF3B30',
      display: 'flex',
      alignItems: 'center',
    },
    progressing: {
      color: '#597EF7',
      display: 'flex',
      alignItems: 'center',
    },
    progressed: {
      color: '#8FC220',
      display: 'flex',
      alignItems: 'center',
    },
    started: {
      color: 'rgba(0,0,0,0.45)',
      display: 'flex',
      alignItems: 'center',
    },
  });
});

const TabelList = () => {
  const { inspectListPlan, getPlanList, query, setQuery, count } = useContext(
    InspectPlanReqContext
  );
  const { setOpenDeletaPlanDialog } = useContext(InspectPlanStatusContext);

  const classes = useStyles({});
  const status = {
    notstart: '未开始',
    ongoing: '进行中',
    complete: '已完成',
    timeout: '已超期',
  };

  const dateForm = 'YYYY-MM-DD';
  const columns = [
    {
      title: '序号',
      dataIndex: 'name',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '计划名称',
      render: (text, record, index) => (
        <Tooltip
          title={text.name}
          overlayStyle={{ background: '#fff' }}
          className={classes.planName}
        >
          {text.name}
        </Tooltip>
      ),
    },
    {
      title: '计划编号',
      dataIndex: 'number',
    },
    {
      title: '计划起止日期',
      render: (text, record, index) => (
        <>
          <span>{moment(text.startTime).format(dateForm)}</span>
          <span style={{ margin: '0 4px' }}>-</span>
          <span>{moment(text.endTime).format(dateForm)}</span>
        </>
      ),
    },
    {
      title: '创建日期',
      render: (text) => moment(text.atCreated).format(dateForm),
    },
    {
      title: '计划进度',

      render: (text, record, index) => (
        <div className={classes.planProgress}>
          <div className={classes.progress}>
            <div
              className={
                record.schedule === 0
                  ? classes.progressGray
                  : classes.progressGreen
              }
              style={{
                width: record.schedule === 0 ? 8 : `${record.schedule}%`,
              }}
            />
          </div>
          <div>{record.schedule}%</div>
          <div className={classes.progressIcon}>
            {record.schedule === 0 && new Date(record.endTime) > new Date() && (
              <>
                <NotStarted /> 未开始
              </>
            )}
            {record.schedule !== 0 && (
              <>
                <InProgress /> 进行中
              </>
            )}
            {record.schedule === 100 && (
              <>
                <Finished /> 已完成
              </>
            )}
            {new Date(record.endTime) < new Date() && (
              <>
                <OverTime /> 已超期
              </>
            )}
          </div>
        </div>
      ),
    },
    {
      title: '操作',
      render: (text, record, index) => (
        <div className={classes.planProgress} style={{ width: 100 }}>
          <button
            className={classes.editButton}
            style={{ borderRight: '1px solid rgba(0,0,0,0.3)' }}
            onClick={(e) => {
              e.stopPropagation();
              Router.pushRoute(`/quality/inspectPlan/edit/${record._id}`);
              getPlanList(record._id);
            }}
          >
            编辑
          </button>
          <button
            className={classes.editButton}
            onClick={(e) => {
              e.stopPropagation();
              setOpenDeletaPlanDialog(record._id);
            }}
          >
            删除
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AntdTable
        onChange={() => console.warn(111)}
        columns={columns}
        dataSource={inspectListPlan}
        rowKey={(row) => row._id}
        pagination={false}
        onRow={(record) => {
          return {
            onClick: () => {
              Router.pushRoute(`/quality/inspectPlan/view/${record._id}`);
            },
          };
        }}
      />
      <div className={classes.pagination}>
        <Pagination
          size="small"
          total={count}
          defaultCurrent={1}
          onChange={(page) => {
            setQuery({ ...query, page: page - 1 });
          }}
        />
      </div>
    </div>
  );
};

const InspectListPlan = () => {
  const classes = useStyles({});
  const { query, setQuery } = useContext(InspectPlanReqContext);
  return (
    <div className={classes.tableBox}>
      <div className={classes.tableTitle}>
        <Datepicker
          placeholder="请选择创建时间"
          bordered={true}
          onChange={(d) =>
            setQuery({ ...query, atCreated: moment(d).format('YYYY-MM-DD') })
          }
        />

        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            Router.pushRoute('/quality/inspectPlan/create');
          }}
        >
          <AddCircleOutlineIcon style={{ marginRight: 8 }} />
          <span>创建检查计划</span>
        </Button>
      </div>

      <div>
        <TabelList />
      </div>
    </div>
  );
};

export default InspectListPlan;
