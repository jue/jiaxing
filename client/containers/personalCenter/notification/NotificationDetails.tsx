import { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import clsx from 'clsx';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import { useRouter, withRouter } from 'next/router';
import { LayoutPageContext } from '../../layout/context/LayoutPageContext';
import MessageSvc from '../../../services/MessageSvc';

// 使用 engineeringManage 中的组件
import FileDetialLists from '../../engineeringManage/components/FileDetialLists';
import { AuthContextI, AuthContext } from '../../../contexts/AuthContext';
import accountSvc from '../../../services/accountSvc';
import { Button } from '@material-ui/core';

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
      height: 'calc( 100% - 50px )',
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
    cellItem: {
      display: 'flex',
      lineHeight: '30px',
    },
    cellLabel: {
      width: 120,
      textAlign: 'right',
      fontWeight: 700,
    },
    cellContent: {
      flex: 1,
    },
    cellTitle: {
      fontSize: 20,
    },
    cellTag: {
      display: 'inline-block',
      height: '30px',
      border: '1px solid rgba(217,217,217,1)',
      paddingLeft: 5,
      paddingRight: 5,
      borderRadius: 4,
      marginRight: 10,
      color: 'rgba(143,195,32,1)',
      marginBottom: 10,
      background: 'rgba(143,195,32,0.13)',
    },
  });
});

const NotificationDetails = () => {
  const classes = useStyles({});
  const router = useRouter();
  const id = router.query.id;

  // State
  interface DataContextI {
    title: string;
    dept: string;
    createdName: string;
    createdTime: string;
    content: string;
    receivers: Array<any>;
    cc: Array<any>;
    attachments: Array<any>;
    company: string;
  }
  interface MessageQueryI {
    messageId: string | string[];
  }
  const dataContext: DataContextI = {
    title: '',
    dept: '',
    createdName: '',
    createdTime: '',
    content: '',
    receivers: [],
    cc: [],
    attachments: [],
    company: '',
  };
  const [messageData, setMessageData] = useState(dataContext);
  const [receiversExpan, setReceiversExpan] = useState(false);
  const [carbonCopyExpan, setCarbonCopyExpan] = useState(false);
  const expanLimit = 5; // 通知和抄送对象，默认限制 5 条

  const messageQuery: MessageQueryI = {
    messageId: id,
  };
  const getMessageDate = async () => {
    const res = await MessageSvc.query(messageQuery);
    setMessageData(res.data);
  };
  useEffect(() => {
    getMessageDate();
  }, [id]);

  const {
    title,
    dept,
    createdName,
    createdTime,
    content,
    receivers,
    cc,
    attachments,
    company,
  } = messageData;
  useEffect(() => {
    accountSvc
      .search({})
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <div className={classes.root}>
        <div className={classes.cellItem}>
          <div className={classes.cellLabel}>消息主题：</div>
          <div className={classes.cellContent}>
            <span className={classes.cellTitle}>{title}</span>
          </div>
        </div>
        <div className={classes.cellItem}>
          <div className={classes.cellLabel}>发送单位：</div>
          <div className={classes.cellContent}>{company}</div>
        </div>
        <div className={classes.cellItem}>
          <div className={classes.cellLabel}>发送人：</div>
          <div
            className={classes.cellContent}
          >{`${createdName}（${dept}）`}</div>
        </div>
        <div className={classes.cellItem}>
          <div className={classes.cellLabel}>发送时间：</div>
          <div className={classes.cellContent}>
            {moment(createdTime).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        </div>
        <div className={classes.cellItem}>
          <div className={classes.cellLabel}>通知对象：</div>
          <div className={classes.cellContent}>
            {(receivers && receivers.length) > expanLimit &&
              !receiversExpan &&
              receivers.map((item, index) => {
                return (
                  index <= expanLimit &&
                  item.receiverName && (
                    <span key={index} className={classes.cellTag}>
                      {item.receiverName}
                    </span>
                  )
                );
              })}
            {((receivers && receivers.length < 5) || receiversExpan) &&
              receivers.map((item, index) => {
                return (
                  item.receiverName && (
                    <span key={index} className={classes.cellTag}>
                      {item.receiverName}
                    </span>
                  )
                );
              })}
            {(receivers && receivers.length) > expanLimit && (
              <button
                className={clsx(classes.button)}
                onClick={() => setReceiversExpan(!receiversExpan)}
                style={{ color: 'rgba(0,0,0,0.65)' }}
              >
                {receiversExpan ? '收起' : '展开'}
              </button>
            )}
          </div>
        </div>
        <div className={classes.cellItem}>
          <div className={classes.cellLabel}>抄送对象：</div>
          <div className={classes.cellContent}>
            {(cc && cc.length) > expanLimit &&
              !carbonCopyExpan &&
              cc.map((item, index) => {
                return (
                  item.receiverName && (
                    <span key={index} className={classes.cellTag}>
                      {item.receiverName}
                    </span>
                  )
                );
              })}
            {((cc && cc.length) < expanLimit || carbonCopyExpan) &&
              cc.map((item, index) => {
                return (
                  item.receiverName && (
                    <span key={index} className={classes.cellTag}>
                      {item.receiverName}
                    </span>
                  )
                );
              })}
            {(cc && cc.length) > expanLimit && (
              <button
                className={clsx(classes.button)}
                onClick={() => setCarbonCopyExpan(!carbonCopyExpan)}
              >
                {carbonCopyExpan ? '收起' : '展开'}
              </button>
            )}
          </div>
        </div>
        <hr />
        <div className={classes.cellItem}>
          <div className={classes.cellLabel}>内容：</div>
          <div className={classes.cellContent}>{content}</div>
        </div>
        <div className={classes.cellItem}>
          <div className={classes.cellLabel}>附件：</div>
          <div className={classes.cellContent}>
            <FileDetialLists list={attachments} type="changeAccordingFile" />
          </div>
        </div>
      </div>
      <Button
        variant="contained"
        color="primary"
        style={{ height: 30, float: 'right', margin: 10 }}
        onClick={() => router.push('/personalCenter/notificationList')}
      >
        返回
      </Button>
    </>
  );
};

export default withRouter(({ router }) => {
  // 设置面包屑
  const { setParts } = useContext(LayoutPageContext);
  useEffect(() => {
    setParts(['个人中心', '消息详情页']);
  }, [router.query]);

  return <NotificationDetails />;
});
