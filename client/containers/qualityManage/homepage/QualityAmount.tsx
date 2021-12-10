import { createStyles, makeStyles } from '@material-ui/core/styles';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const useStyles = makeStyles(() => {
  return createStyles({
    title: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 40,
      '& :nth-child(1)': {
        paddingLeft: 5,
      },
    },
    echarts: {
      height: 240,
      overflow: 'hidden',
    },
  });
});

const options = {
  chart: {
    type: 'column',
    height: 250,
  },
  title: {
    text: '',
  },
  xAxis: {
    categories: [
      // '一月',
      // '二月',
      // '三月',
      // '四月',
      // '五月',
      // '六月',
      // '七月',
      // '八月',
      // '九月',
      // '十月',
      // '十一月',
      // '十二月',
    ],
    crosshair: true,
  },
  yAxis: {
    min: 0,
    title: {
      text: '',
    },
    tickPositions: [0, 100],
  },
  credits: {
    enabled: false,
  },
  legend: {
    enabled: false,
    reversed: true,
  },
  tooltip: {
    // head + 每个 point + footer 拼接成完整的 table
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat:
      '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
    footerFormat: '</table>',
    shared: true,
    useHTML: true,
  },
  plotOptions: {
    column: {
      borderWidth: 0,
    },
    series: {
      borderRadius: 8,
    },
  },
  series: [
    {
      name: '东京',
      data: [
        49.9,
        71.5,
        6.4,
        29.2,
        44.0,
        76.0,
        35.6,
        48.5,
        16.4,
        94.1,
        95.6,
        54.4,
      ],
    },
  ],
};

const QualityAmount = () => {
  const classes = useStyles({});

  return (
    <>
      <div className={classes.title}>
        <div>质量问题数量</div>
        <div>(个)</div>
      </div>

      <div className={classes.echarts}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </>
  );
};

export default QualityAmount;
