import { useContext, useEffect } from 'react';
import clsx from 'clsx';

import { Row, Col, Empty } from 'antd';
import HighchartsDesignChange from '../components/HighchartsDesignChange';
import { WorkBenchContext } from '../context/WorkBenchContext';
import { DateSelect } from '../components';
import PieCharts from '../components/PieCharts';
import TableList from '../TableList';

const QualityStatistical = ({ classes, tabIndex }) => {
  const { qualityColumn, qualityPie, completionCase } = useContext(
    WorkBenchContext
  );

  //colunmSeries
  const qualitySeries = [
    {
      name: '检查次数',
      data: qualityColumn.inspectCounts,
      color: '#8FDAFF',
    },
    {
      name: '整改次数',
      data: qualityColumn.rectifyCounts,
      color: '#B6DD61',
    },
    {
      name: '延期整改次数',
      data: qualityColumn.delayCounts,
      color: '#FFD564',
    },
  ];
  //Pie
  const qualityPieSeries = [
    {
      name: '已整改',
      y: qualityPie.rectifyCount,
      color: '#8FDAFF',
    },
    {
      name: '整改中',
      y: qualityPie.doingCount,
      color: '#8FC320',
    },
    {
      name: '已延期',
      y: qualityPie.delayCount,
      color: '#E8E2D7',
    },
  ];

  return (
    <Row gutter={16} className={classes.row}>
      <Col span={12}>
        <div
          style={{ color: 'rgba(0,0,0,0.65)', marginBottom: 16 }}
          className={classes.font}
        >
          质量检查统计
        </div>
        <div className={classes.progress} style={{ padding: 0 }}>
          <div
            className={clsx(classes.title, classes.font)}
            style={{ padding: 16, marginBottom: 0 }}
          >
            <span className={classes.circle} style={{ left: 8, top: 22 }} />
            质量检查统计
          </div>
          <HighchartsDesignChange data={qualityColumn} series={qualitySeries} />
        </div>
      </Col>
      <Col span={6}>
        <DateSelect
          title="整改完成度统计"
          classes={classes}
          onSlect={(v) => completionCase(tabIndex, v)}
        />
        <div className={classes.progress} style={{ padding: 0, marginTop: 2 }}>
          <div
            className={clsx(classes.title, classes.font)}
            style={{ padding: 16 }}
          >
            <span className={classes.circle} style={{ left: 8, top: 22 }} />
            任务完成情况
          </div>
          {JSON.stringify(qualityPie) !== '{}' && (
            <PieCharts data={qualityPieSeries} qualityPie={qualityPie} />
          )}
        </div>
      </Col>
      <Col span={6}>
        <div
          className={classes.font}
          style={{ color: 'rgba(0,0,0,0.65)', marginBottom: 16 }}
        >
          待整改问题项统计
        </div>
        <div
          className={classes.progress}
          style={{ padding: '0 2px', height: 233 }}
        >
          <TableList type="quality" />
        </div>
      </Col>
    </Row>
  );
};
export default QualityStatistical;
