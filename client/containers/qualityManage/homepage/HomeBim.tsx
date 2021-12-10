import { createStyles, makeStyles } from '@material-ui/core/styles';

import QualityRedBlack from './QualityRedBlack';

const useStyles = makeStyles(() => {
  return createStyles({
    data: {
      color: '#476590',
      fontSize: 14,
      fontWeight: 600,
    },
    bimDetails: {
      marginTop: 10,
      display: 'flex',
      justifyContent: 'space-between',
    },
    bim: {
      width: '50%',
      background: '#fff',
      padding: '10px 14px',
      marginRight: 10,
      boxShadow: '0px 2px 4px 0px rgba(239,242,247,1)',
      borderRadius: 4,
    },
    bimModel: {
      background: 'gray',
      width: '100%',
      height: 'calc(100% - 29px)',
      marginTop: 10,
      borderRadius: 4,
    },
    tips: {
      position: 'absolute',
      top: 10,
      right: 10,
      background: '#fff',
      padding: 10,
    },
    tipDetail: {
      width: '100%',
      marginBottom: 20,
      display: 'flex',
      alignItems: 'center',
      '&>div': {
        width: '50%',
      },
    },
    tipRight: {
      color: '#1E55A4',
      marginLeft: 10,
    },
    outPosition: {
      width: 10,
      height: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'rgba(124,198,0,0.2)',
      borderRadius: '100%',
    },
    position: {
      width: 6,
      height: 6,
      background: 'rgba(143,195,32,1)',
      borderRadius: '100%',
    },
  });
});

const HomeBim = () => {
  const classes = useStyles({});

  return (
    <div className={classes.bimDetails}>
      <div className={classes.bim}>
        <div className={classes.data}>BIM模型</div>
        <div style={{ height: '100%', position: 'relative' }}>
          <div className={classes.bimModel}>1212</div>
          <div className={classes.tips}>
            <div className={classes.tipDetail}>
              <div>编号：</div>
              <div className={classes.tipRight}>04</div>
            </div>

            <div className={classes.tipDetail}>
              <div>问题名称：</div>
              <div className={classes.tipRight}>B线市政管网</div>
            </div>

            <div className={classes.tipDetail}>
              <div>标段：</div>
              <div className={classes.tipRight}>二级园路</div>
            </div>

            <div className={classes.tipDetail}>
              <div>截止日期：</div>
              <div className={classes.tipRight}>2020-01-24</div>
            </div>

            <div className={classes.tipDetail}>
              <div>问题状态：</div>
              <div className={classes.tipRight}>处理中</div>
            </div>

            <div className={classes.tipDetail}>
              <div>创建人：</div>
              <div className={classes.tipRight}>黄严锋</div>
            </div>

            <div className={classes.tipDetail}>
              <div>审批人：</div>
              <div className={classes.tipRight}>张浩然</div>
            </div>

            <div className={classes.tipDetail}>
              <div>创建时间：</div>
              <div className={classes.tipRight}>2020-01-24</div>
            </div>

            <div className={classes.tipDetail}>
              <div>完成时间：</div>
              <div className={classes.tipRight}>2020-01-24</div>
            </div>

            <div className={classes.tipDetail}>
              <div>定位：</div>
              <div className={classes.tipRight}>
                <div className={classes.outPosition}>
                  <div className={classes.position} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QualityRedBlack />
    </div>
  );
};

export default HomeBim;
