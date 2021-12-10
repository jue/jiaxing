import { createStyles, makeStyles } from '@material-ui/core/styles';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Select } from 'antd';
import shortid from 'shortid';

import Datepicker from '../../../components/Datepicker';
import QualityBlackList from '../../../components/Svgs/QualityBlackList';
import QualityRedList from '../../../components/Svgs/QualityRedList';

const useStyles = makeStyles(() => {
  return createStyles({
    bim: {
      width: '50%',
      height: 'calc(100%)',
      background: '#fff',
      padding: '10px 14px',
      marginRight: 10,
      boxShadow: '0px 2px 4px 0px rgba(239,242,247,1)',
      borderRadius: 4,
      display: 'flex',
      '&>div': {
        width: '50%',
      },
    },
    title: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 32,
      marginBottom: 10,
    },
    redList: {
      boxShadow: '0px 2px 4px 0px rgba(212,212,212,0.5)',
      width: '100%',
      height: '75%',
      padding: '14px 4px',
      overflowY: 'hidden',
    },
    titleList: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '13%',
      padding: '0 15px',
    },
    data: {
      color: '#476590',
      fontSize: 14,
      fontWeight: 600,
    },
    listTitle: {
      display: 'flex',
      alignItems: 'center',
      color: '#476590',
    },
    checkList: {
      height: 38,
      fontSize: 12,
      color: '#666',
      padding: 10,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      '&:hover': {
        height: 38,
        fontSize: 12,
        color: '#023692',
        background: '#F5F7FA',
        padding: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
      },
    },
    listNo: {
      display: 'inline-block',
      width: 16,
      marginRight: 12,
    },
  });
});

const QualityRedBlack = () => {
  const classes = useStyles({});

  const data = [];
  for (let i = 0; i < 15; i++) {
    data.push({
      name: '检查主题一',
      time: new Date(),
    });
  }

  return (
    <div className={classes.bim} style={{ margin: 0 }}>
      <div style={{ marginRight: 24, height: '100%' }}>
        <div className={classes.title}>
          <div className={classes.data}>质量红黑榜</div>
          <Datepicker
            placeholder="请选择录入时间查询"
            onChange={() => {}}
            bordered={true}
          />
        </div>

        <div className={classes.redList}>
          <div className={classes.titleList}>
            <div className={classes.listTitle}>
              <QualityRedList />
              <div style={{ marginLeft: 16 }}>质量检查红榜</div>
            </div>
            <div className={classes.listTitle}>
              <span>更多</span>
              <KeyboardArrowRightIcon />
            </div>
          </div>

          <div style={{ height: '90%', overflow: 'scroll', paddingBottom: 10 }}>
            {data.map((item, index) => {
              return (
                <div
                  className={classes.checkList}
                  key={index + shortid.generate()}
                >
                  <div>
                    <span className={classes.listNo}>{index + 1}</span>
                    <span>{item.name}</span>
                  </div>

                  <div>2020.04.20</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ height: '100%' }}>
        <div className={classes.title}>
          <Select
            style={{ width: '100%' }}
            placeholder="请选择检查类型"
            onChange={() => {}}
          />
        </div>

        <div className={classes.redList}>
          <div className={classes.titleList}>
            <div className={classes.listTitle} style={{ color: '#000' }}>
              <QualityBlackList />
              <div style={{ marginLeft: 16 }}>质量检查黑榜</div>
            </div>
            <div className={classes.listTitle} style={{ color: '#000' }}>
              <span>更多</span>
              <KeyboardArrowRightIcon />
            </div>
          </div>

          <div style={{ height: '90%', overflow: 'scroll', paddingBottom: 10 }}>
            {data.map((item, index) => {
              return (
                <div
                  className={classes.checkList}
                  key={index + shortid.generate()}
                >
                  <div>
                    <span style={{ marginRight: 12 }}>{index + 1}</span>
                    <span>{item.name}</span>
                  </div>

                  <div>2020.04.20</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityRedBlack;
