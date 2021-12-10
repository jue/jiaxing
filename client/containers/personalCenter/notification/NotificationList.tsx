import { useContext, useEffect, useState } from 'react';
import { withRouter } from 'next/router';
import { Empty } from 'antd';
import Pagination from 'antd/lib/pagination';
import InputAdornment from '@material-ui/core/InputAdornment';
import moment from 'moment';
import clsx from 'clsx';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import { Tabs, Tab } from '@material-ui/core';
import { LayoutPageContext } from '../../layout/context/LayoutPageContext';
import AntdTable from '../../../components/AntdTable';
import MessageSvc from '../../../services/MessageSvc';
import { Router } from '../../../../server/next.routes';
import { MuiInput } from '../../../components/Input';
import SearchIcon from '../../../components/Svgs/authority/SearchIcon';

const useStyles = makeStyles(({ spacing, palette }) => {
  return createStyles({
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 14,
    },
    root: {
      width: '100%',
      padding: spacing(2),
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
      width: 'calc(100% - 258px)',
      bottom: 16,
      backgroundColor: '#fff',
      padding: 14,
    },
    buttonI: {
      color: '#0F6EFF',
    },
    muiInput: {
      width: 220,
      height: 34,
    },
  });
});

const NotificationList = () => {
  // Class
  const classes = useStyles({});

  // State
  const [messageData, setMessageData] = useState([]);
  const [currentTab, setCurrentTab] = useState('unread');
  const [pageCount, setpageCount] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [searchQuery, setSearchQuery] = useState(null);

  // Tabs
  const tabList = [
    {
      text: '未读消息',
      value: 'unread',
    },
    {
      text: '历史消息',
      value: 'read',
    },
  ];
  interface StyledTabProps {
    label: string;
    style?: any;
    value: any;
    selected: any;
  }
  const ReactTabs = withStyles({
    root: {},
  })(Tabs);
  const ReactTab = withStyles(({ spacing }) =>
    createStyles({
      root: {
        minWidth: 100,
        marginRight: spacing(5),
      },
    })
  )((props: StyledTabProps) => <Tab disableRipple {...props} />);

  // Table
  const columns = [
    {
      title: '消息名称',
      dataIndex: 'title',
    },
    {
      title: '创建时间',
      render: (text) => {
        return <>{moment(text.createdTime).format('YYYY-MM-DD HH:mm:ss')}</>;
      },
    },
    {
      title: '操作',
      render: (text, record, index) => (
        <button
          className={clsx(classes.button)}
          onClick={() => handleMessageStatus(record.messageId)}
        >
          查看
        </button>
      ),
    },
  ];
  interface MessageQueryI {
    messageId?: string;
    read?: number;
    pageIndex?: number;
    title?: string;
  }
  const messageQuery: MessageQueryI = {
    read: 0,
    pageIndex,
  };
  const getMessageDate = async (params: object) => {
    const res = await MessageSvc.search(params);
    setMessageData(res.data.data);
    setpageCount(res.data.total);
  };
  useEffect(() => {
    getMessageDate(messageQuery);
  }, []);

  // Method
  const switchTab = (value: string) => {
    setCurrentTab(value);
    messageQuery.read = value === 'unread' ? 0 : 1;
    getMessageDate(messageQuery);
  };
  const switchPagination = (value: number) => {
    setPageIndex(value);
    messageQuery.pageIndex = value;
    getMessageDate(messageQuery);
  };
  const handleMessageStatus = async (messageId: string) => {
    const messageParams: MessageQueryI = {
      read: 1,
    };
    const res = await MessageSvc.update(messageId, messageParams);
    if (res.code === 200) {
      Router.pushRoute(`/personalCenter/notificationDetails?id=${messageId}`);
    }
  };
  const handleMessageSearch = async () => {
    const messageParams: MessageQueryI = {
      title: searchQuery,
    };
    getMessageDate(messageParams);
  };

  return (
    <div className={classes.root}>
      {/* Tabs */}
      <div className={classes.toolbar}>
        <ReactTabs
          value={currentTab}
          onChange={(event, newValue) => switchTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          {tabList.map((item) => {
            return (
              <ReactTab
                key={item.value}
                label={item.text}
                value={item.value}
                selected={item.value === currentTab}
              />
            );
          })}
        </ReactTabs>
      </div>
      {/* Search */}
      <div className={classes.muiInput}>
        <MuiInput
          placeholder="请输入消息名称"
          onBlur={(e) => {
            const value = e.target.value.trim();
            setSearchQuery(value);
          }}
          endAdornment={
            <InputAdornment
              position="end"
              onClick={() => handleMessageSearch()}
              style={{ cursor: 'pointer' }}
            >
              <SearchIcon />
            </InputAdornment>
          }
        />
      </div>
      {/* Table */}
      <AntdTable
        columns={columns}
        dataSource={messageData}
        rowKey={(row) => row.messageId}
        pagination={false}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无数据"
            />
          ),
        }}
      ></AntdTable>
      {/* Pagination */}
      <div className={classes.pagination}>
        <Pagination
          size="small"
          current={pageIndex}
          total={pageCount}
          onChange={(page) => switchPagination(page)}
        />
      </div>
    </div>
  );
};

export default withRouter(({ router }) => {
  // 设置面包屑
  const { setParts } = useContext(LayoutPageContext);
  useEffect(() => {
    setParts(['个人中心', '消息列表']);
  }, [router.query]);

  return <NotificationList />;
});
