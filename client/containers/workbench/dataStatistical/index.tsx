import clsx from 'clsx';
import { Row, Col, Progress } from 'antd';
import TableList from '../TableList';
import { DateSelect } from '../components';
import { useContext } from 'react';
import { WorkBenchContext } from '../context/WorkBenchContext';
import PieCharts from '../components/PieCharts';

const DataStatistical = ({ classes }) => {
  const {
    progressTask,
    progressCarryOut,
    progressDelay,
    progressTotalTaskRate,
    progerssProjectDate,
    progressDelayTop,
  } = useContext(WorkBenchContext);
  const carryOutPieSeries = [
    {
      name: '未开始',
      y: progressCarryOut.todoCounts,
      color: '#8FDAFF',
    },
    {
      name: '进行中',
      y: progressCarryOut.doingCounts,
      color: '#8FC320',
    },
    {
      name: '已完成',
      y: progressCarryOut.doneCount,
      color: '#E8E2D7',
    },
  ];
  const delayPieSeries = [
    {
      name: '延期',
      y: progressDelay.noDelayCounts,
      color: '#FFD564',
    },
    {
      name: '未延期',
      y: progressDelay.delayCounts,
      color: '#3AA9F0',
    },
    {
      name: '严重延期',
      y: progressDelay.seriousDelayCounts,
      color: '#FF9898',
    },
  ];
  return (
    <Row gutter={16} className={classes.row}>
      <Col span={6}>
        <div
          style={{ color: 'rgba(0,0,0,0.65)', marginBottom: 16 }}
          className={classes.font}
        >
          进度概况
        </div>
        <div className={classes.progress}>
          <div style={{ marginBottom: 52 }}>
            <p className={clsx(classes.title, classes.font)}>
              <span className={classes.circle} />
              项目工期
            </p>
            <Progress
              percent={progerssProjectDate && progerssProjectDate.proportion}
              showInfo={true}
              strokeColor="#418CFF"
              strokeWidth={18}
              trailColor="#EFEFEF"
            />
            <div>
              <span className={clsx(classes.date, classes.left)}>
                {progerssProjectDate && progerssProjectDate.startDate}
              </span>
              <span className={clsx(classes.date, classes.right)}>
                {progerssProjectDate && progerssProjectDate.endDate}
              </span>
            </div>
          </div>
          <div style={{ marginBottom: 51 }}>
            <p className={clsx(classes.title, classes.font)}>
              <span
                className={clsx(classes.circle, classes.green, classes.font)}
              />
              总任务完成率
            </p>
            <Progress
              percent={
                progressTotalTaskRate && progressTotalTaskRate.completion
              }
              showInfo={true}
              strokeColor="#8FC320"
              strokeWidth={18}
              trailColor="#EFEFEF"
            />
            <div>
              <span className={clsx(classes.date, classes.left)}>0</span>
              <span className={clsx(classes.date, classes.right)}>
                {progressTotalTaskRate && progressTotalTaskRate.sumCount}
              </span>
            </div>
          </div>
        </div>
      </Col>
      <Col span={6}>
        <div
          className={classes.font}
          style={{
            color: 'rgba(0,0,0,0.65)',
            marginBottom: 16,
          }}
        >
          任务情况
        </div>

        <div className={classes.progress} style={{ padding: 0 }}>
          <div
            className={clsx(classes.title, classes.font)}
            style={{ padding: 16 }}
          >
            <span className={classes.circle} style={{ left: 8, top: 22 }} />
            任务完成情况
          </div>
          {JSON.stringify(progressCarryOut) !== '{}' && (
            <PieCharts data={carryOutPieSeries} qualityPie={progressCarryOut} />
          )}
        </div>
      </Col>
      <Col span={6}>
        <DateSelect
          title=""
          classes={classes}
          onSlect={(v) => {
            progressTask('done', v);
            progressTask('delay', v);
            progressDelayTop(v);
          }}
        />
        <div className={classes.progress} style={{ padding: 0, marginTop: 2 }}>
          <div
            className={clsx(classes.title, classes.font)}
            style={{ padding: 16 }}
          >
            <span className={classes.circle} style={{ left: 8, top: 22 }} />
            任务延期情况
          </div>
          {/* <ExtensionCharts /> */}
          {JSON.stringify(progressDelay) !== '{}' && (
            <PieCharts data={delayPieSeries} qualityPie={progressDelay} />
          )}
        </div>
      </Col>
      <Col span={6}>
        <div
          className={classes.font}
          style={{
            color: 'rgba(0,0,0,0.65)',
            marginBottom: 16,
          }}
        >
          任务延期TOP10
        </div>
        <div
          className={classes.progress}
          style={{ padding: '0 2px', height: 233 }}
        >
          <TableList type="dataStatistical" />
        </div>
      </Col>
    </Row>
  );
};
export default DataStatistical;
