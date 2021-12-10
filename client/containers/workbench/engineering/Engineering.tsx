import { useContext } from 'react';
import clsx from 'clsx';

import { Row, Col, Divider } from 'antd';

import HighchartsDesignChange from '../components/HighchartsDesignChange';
import { WorkBenchContext } from '../context/WorkBenchContext';
import { DateSelect } from '../components';
import PieCharts from '../components/PieCharts';

const Engineering = ({ classes }) => {
  const {
    engineeringAmountCount,
    engineeringChangeCost,
    changeLevelPercent,
    changeTypePercent,
  } = useContext(WorkBenchContext);
  const engineeringSerires = [
    {
      name: '变更金额（百万元）',
      data: engineeringAmountCount.amounts,
      color: '#8FDAFF',
    },
    {
      name: '变更次数',
      data: engineeringAmountCount.counts,
      color: '#FFD564',
    },
  ];
  //Pie
  const levelPieSeries = [
    {
      name: '重大变更',
      y: changeLevelPercent.greatAmounts,
      color: '#FFD564',
    },
    {
      name: '一般变更',
      y: changeLevelPercent.commonAmounts,
      color: '#8FC320',
    },
  ];
  const typePieSeries = [
    {
      name: '施工变更',
      y: changeTypePercent.constructionAmounts,
      color: '#FFD564',
    },
    {
      name: '设计变更',
      y: changeTypePercent.designAmounts,
      color: '#8FC320',
    },
    {
      name: '其它变更',
      y: changeTypePercent.otherAmounts,
      color: '#FF9898',
    },
    // {
    //   name: '监理变更',
    //   y: changeTypePercent.otherAmounts,
    //   color: '#8FDAFF',
    // },
  ];
  return (
    <Row className={classes.row}>
      <Col span={24} className={classes.col}>
        <div className={clsx(classes.col, classes.statistics)}>
          <div className={classes.font} style={{ fontSize: 16 }}>
            工程变更概况
          </div>
          <Divider style={{ margin: '16px 0' }} />
          <Row gutter={16} className={classes.row}>
            <Col span={12}>
              <div
                className={classes.font}
                style={{ color: 'rgba(0,0,0,0.65)', marginBottom: 16 }}
              >
                变更费用与次数统计
              </div>
              <div className={classes.progress} style={{ padding: 0 }}>
                <div
                  className={clsx(classes.title, classes.font)}
                  style={{ padding: 16, marginBottom: 0 }}
                >
                  <span
                    className={classes.circle}
                    style={{ left: 8, top: 22 }}
                  />
                  变更费用与次数统计
                </div>
                <HighchartsDesignChange
                  data={engineeringAmountCount}
                  series={engineeringSerires}
                />
              </div>
            </Col>
            <Col span={6}>
              <DateSelect
                title="变更费用"
                classes={classes}
                onSlect={(v) => engineeringChangeCost('level', v)}
              />
              <div
                className={classes.progress}
                style={{ padding: 0, marginTop: 2 }}
              >
                <div
                  className={clsx(classes.title, classes.font)}
                  style={{ padding: 16 }}
                >
                  <span
                    className={classes.circle}
                    style={{ left: 8, top: 22 }}
                  />
                  变更费用（百万元）
                </div>
                {JSON.stringify(changeLevelPercent) !== '{}' && (
                  <PieCharts
                    data={levelPieSeries}
                    qualityPie={changeLevelPercent}
                  />
                )}
              </div>
            </Col>
            <Col span={6}>
              <DateSelect
                title="变更类别统计"
                classes={classes}
                onSlect={(v) => engineeringChangeCost('type', v)}
              />
              <div
                className={classes.progress}
                style={{ padding: 0, marginTop: 2 }}
              >
                <div
                  className={clsx(classes.title, classes.font)}
                  style={{ padding: 16 }}
                >
                  <span
                    className={classes.circle}
                    style={{ left: 8, top: 22 }}
                  />
                  变更类别统计
                </div>
                {JSON.stringify(changeTypePercent) !== '{}' && (
                  <PieCharts
                    data={typePieSeries}
                    qualityPie={changeTypePercent}
                  />
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
};
export default Engineering;
