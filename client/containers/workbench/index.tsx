import { useContext, useEffect, useRef, useState } from 'react';
import { withRouter, useRouter } from 'next/router';
import clsx from 'clsx';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import { Row, Col, Divider, Select } from 'antd';

import { LayoutPageContext } from '../layout/context/LayoutPageContext';
import TodoIcon from '../../components/Svgs/WorkBench/Todo';
import DoneIcon from '../../components/Svgs/WorkBench/Done';
import UnreadIcon from '../../components/Svgs/WorkBench/Unread';
import HaveReadIcon from '../../components/Svgs/WorkBench/HaveRead';
import { routData } from './RouteList';

import WorkBenchContextProvider, {
  WorkBenchContext,
} from './context/WorkBenchContext';

import { DocumentModel } from './DocumentModel';
import { TodoList } from './components';
import ReactTabs, { ReactTab } from './components/WorkAntdTab';
import { WorkBenchType, WorkBenchDesc } from '../../../constants/enums';
import Engineering from './engineering/Engineering';
import QualityStatistical from './qualityStatistical/QualityStatistical';
import DataStatistical from './dataStatistical';

const { Option } = Select;
const useStyles = makeStyles(({ spacing }) => {
  return createStyles({
    '@global': {
      '.makeStyles-contentContainer-40,.makeStyles-contentContainer-184': {
        backgroundColor: 'rgba(0,0,0,0)!important',
      },

      '.ant-progress-text': {
        position: 'absolute',
        left: '10%',
        top: '20%',
        color: '#fff',
      },
      '.MuiTableCell-head': {
        fontWeight: 400,
      },
    },
    root: {
      color: 'rgba(0, 0, 0, 0.85)',
    },
    row: {
      margin: spacing(1, 0),
    },
    col: {
      height: 365,
      background: 'white',
      padding: '8px 0',
    },
    todoCol: {
      height: 60,
      display: 'flex',
      alignItems: 'center',
      padding: 0,
      borderRadius: 4,
    },
    statistics: {
      height: 203,
      padding: spacing(2, 2),
    },
    span: {
      display: 'inline-block',
      width: 2,
      height: '100%',
      background: '#FFA166',
      padding: ' -8px 0',
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
    },
    doneIcon: {
      background: '#8FC320',
    },
    unReadIcon: {
      background: '#FF8E8E',
    },
    haveReadIcon: {
      background: '#418CFF',
    },
    progress: {
      background: ' #FFFFFF',
      boxShadow: '0px 1px 10px 4px rgba(81, 81, 81, 0.07)',
      borderRadius: 4,
      padding: spacing(2),
    },
    title: {
      width: '100%',
      position: 'relative',
    },
    circle: {
      position: 'absolute',
      left: '-8px',
      top: '6px',
      width: 6,
      height: 6,
      borderRadius: '50%',
      backgroundColor: '#418CFF',
      display: 'inline-block',
    },
    green: {
      backgroundColor: '#8FC320',
    },
    date: {
      marginTop: 8,
      fontSize: 12,
      color: 'rgba(0, 0, 0, 0.65)',
    },
    left: {
      float: 'left',
    },
    right: {
      float: 'right',
    },
    font: {
      fontSize: 12,
      fontFamily: 'PingFangSC-Medium PingFang SC',
      fontWeight: 500,
      color: 'rgba(0, 0, 0, 0.85)',
    },
  });
});

const WorkBench = () => {
  const classes = useStyles({});
  const router = useRouter();
  const {
    todoCount,
    doneCount,
    unReadCount,
    haveReadCount,
    selectCategory,
    documentCategorys,
    setSelectCategory,
    documents,
    setDocuments,
    // queryDocuments,
    setQueryDocument,
    queryDocument,
    countDocument,
    tabIndex,
    setTabIndex,
  } = useContext(WorkBenchContext);
  const scrollEl = useRef(null);

  return (
    <div className={classes.root}>
      <Row gutter={16} className={classes.row}>
        <Col span={6}>
          <TodoList
            icon={<TodoIcon />}
            label="待办事件"
            iconColor=""
            count={todoCount}
            onClick={() => router.push('/personalCenter/todoList')}
            classes={classes}
          />
        </Col>
        <Col span={6}>
          <TodoList
            icon={<DoneIcon />}
            label="已办事件"
            iconColor={classes.doneIcon}
            count={doneCount}
            onClick={() => router.push('/personalCenter/todoList')}
            classes={classes}
          />
        </Col>
        <Col span={6}>
          <TodoList
            icon={<UnreadIcon />}
            label="未读消息"
            iconColor={classes.unReadIcon}
            count={unReadCount}
            onClick={() => router.push('/personalCenter/notificationList')}
            classes={classes}
          />
        </Col>
        <Col span={6}>
          <TodoList
            icon={<HaveReadIcon />}
            label="已读消息"
            iconColor={classes.haveReadIcon}
            count={haveReadCount}
            onClick={() => router.push('/personalCenter/notificationList')}
            classes={classes}
          />
        </Col>
      </Row>
      <Row gutter={16} className={classes.row}>
        <Col span={18}>
          <div className={clsx(classes.col, classes.statistics)}>
            <div className={classes.font} style={{ fontSize: 16 }}>
              常用入口
            </div>
            <Divider style={{ margin: '16px 0' }} />
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                overflow: 'auto',
                marginTop: '4%',
              }}
            >
              {routData.map((item) => (
                <div
                  key={item.id}
                  style={{ flex: '0 0 11.111%' }}
                  onClick={() => router.push(item.router)}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: '#FFFFFF',
                      boxShadow: '0px 2px 14px -8px rgba(0, 0, 0, 0.64)',
                      borderRadius: 14,
                      lineHeight: '50px',
                      textAlign: 'center',
                    }}
                  >
                    {item.icon}
                  </div>
                  <div style={{ width: '100%', marginTop: 12 }}>
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className={clsx(classes.col, classes.statistics)}>
            <div style={{ display: 'flex' }}>
              <div style={{ width: 80, fontSize: 16 }} className={classes.font}>
                表单模版
              </div>
              <Select
                value={(selectCategory && selectCategory.name) || ''}
                onChange={(value) => {
                  let newSelect = documentCategorys.filter(
                    (item) => item._id === value
                  );
                  setSelectCategory(newSelect[0]);
                  // queryDocuments(newSelect[0]._id);
                }}
                bordered={null}
                style={{
                  flex: 1,
                  margin: 0,
                  height: 30,
                  lineHeight: '32px',
                }}
              >
                {documentCategorys.map((item) => (
                  <Option key={item._id} value={item._id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div
              style={{
                width: '100%',
                height: 120,
                overflow: 'auto',
              }}
              onScroll={() => {
                if (
                  !(
                    scrollEl.current.scrollHeight -
                      scrollEl.current.clientHeight >
                    scrollEl.current.scrollTop
                  )
                ) {
                  //已到底部

                  countDocument / 10 >= queryDocument.page &&
                    setQueryDocument({
                      ...queryDocument,
                      page: queryDocument.page + 1,
                    });
                }
              }}
              ref={scrollEl}
            >
              <DocumentModel documents={documents} />
            </div>
          </div>
        </Col>
      </Row>
      <Row className={classes.row}>
        <Col span={24} className={classes.col}>
          <div className={clsx(classes.col, classes.statistics)}>
            <div style={{ fontSize: 16 }} className={classes.font}>
              数据统计
            </div>
            <Divider style={{ margin: '16px 0' }} />
            <DataStatistical classes={classes} />
          </div>
        </Col>
      </Row>
      <Row className={classes.row}>
        <Col span={24} className={classes.col}>
          <div className={clsx(classes.col, classes.statistics)}>
            <div style={{ position: 'relative' }}>
              <ReactTabs
                value={tabIndex}
                onChange={(_, value) => {
                  setTabIndex(value);
                }}
                style={{ alignItems: 'center' }}
              >
                {Object.keys(WorkBenchType).map((item) => {
                  return (
                    <ReactTab
                      key={item}
                      label={WorkBenchDesc[WorkBenchType[item]]}
                      value={WorkBenchType[item]}
                      // selected={WorkBenchType[item] === tabIndex}
                    />
                  );
                })}
              </ReactTabs>
            </div>
            <span
              style={{
                position: 'absolute',
                left: 128,
                top: 32,
                color: 'rgba(0,0,0,0.65)',
                fontSize: 20,
              }}
            >
              |
            </span>
            <Divider style={{ margin: '-25px 0 16px 0' }} />
            <QualityStatistical classes={classes} tabIndex={tabIndex} />
          </div>
        </Col>
      </Row>

      <Engineering classes={classes} />
    </div>
  );
};
export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);

  useEffect(() => {
    setParts(['个人中心', '工作台']);
  }, [router.query]);

  return (
    <WorkBenchContextProvider idParent="dangan">
      <WorkBench />
    </WorkBenchContextProvider>
  );
});
