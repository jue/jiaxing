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
    type: 'scatter',
    zoomType: 'xy',
    height: 250,
  },
  title: {
    text: '',
  },
  xAxis: {
    title: {
      enabled: false,
      text: '',
    },
    startOnTick: true,
    endOnTick: true,
    showLastLabel: true,
  },
  yAxis: {
    title: {
      text: '',
    },
  },
  credits: {
    enabled: false,
  },
  legend: {
    layout: 'vertical',
    align: 'left',
    verticalAlign: 'top',
    x: 100,
    y: 70,
    floating: true,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    enabled: false,
    reversed: true,
  },
  plotOptions: {
    scatter: {
      marker: {
        radius: 5,
        states: {
          hover: {
            enabled: true,
            lineColor: 'rgb(100,100,100)',
          },
        },
      },
      states: {
        hover: {
          marker: {
            enabled: false,
          },
        },
      },
      tooltip: {
        // headerFormat: '<b>{series.name}</b><br>',
        // pointFormat: '{point.x} cm, {point.y} kg'
      },
    },
  },
  series: [
    {
      // name: '女',
      // color: 'blue',
      data: [
        [161.2, 51.6],
        [167.5, 59.0],
        [159.5, 49.2],
        [157.0, 63.0],
        [155.8, 53.6],
        [170.0, 59.0],
        [159.1, 47.6],
        [166.0, 69.8],
        [176.2, 66.8],
        [160.2, 75.2],
        [172.5, 55.2],
        [170.9, 54.2],
        [172.9, 62.5],
        [153.4, 42.0],
        [160.0, 50.0],
        [147.2, 49.8],
        [168.2, 49.2],
        [175.0, 73.2],
        [157.0, 47.8],
        [167.6, 68.8],
      ],
    },
  ],
};

const QualityReport = () => {
  const classes = useStyles({});

  return (
    <>
      <div className={classes.title}>
        <div>质量问题报告</div>
        <div>(个)</div>
      </div>

      <div className={classes.echarts}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </>
  );
};

export default QualityReport;
