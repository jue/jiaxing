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
  credits: {
    enabled: false,
  },
  xAxis: {
    categories: [],
    reversed: false,
  },
  yAxis: {
    min: 0,
    title: {
      text: '',
      enabled: false,
    },
    stackLabels: {
      // 堆叠数据标签
      enabled: true,
      style: {
        fontWeight: 'bold',
        color: 'gray',
      },
    },
  },
  colors: ['#8FC320', '#4E93F0'],
  legend: {
    align: 'right',
    x: -30,
    verticalAlign: 'top',
    y: 25,
    floating: true,
    backgroundColor: 'white',
    borderColor: '#CCC',
    borderWidth: 1,
    shadow: false,
  },
  tooltip: {
    formatter: function () {
      return (
        '<b>' +
        this.x +
        '</b><br/>' +
        this.series.name +
        ': ' +
        this.y +
        '<br/>' +
        '总量: ' +
        this.point.stackTotal
      );
    },
  },
  plotOptions: {
    column: {
      stacking: 'normal',
      pointWidth: 15,
      dataLabels: {
        enabled: true,
        color: 'white',
        style: {
          // 如果不需要数据标签阴影，可以将 textOutline 设置为 'none'
          textOutline: '1px 1px black',
        },
      },
    },
  },
  series: [
    {
      name: '小张',
      data: [5, 3, 4, 7, 2],
      borderRadius: 8,
    },
    {
      name: '小彭',
      data: [2, 2, 3, 2, 1],
    },
  ],
};

const Efficiency = () => {
  const classes = useStyles({});

  return (
    <div style={{ height: '100%' }}>
      <div className={classes.title}>
        <div>整改效率</div>
        <div>(个)</div>
      </div>

      <div className={classes.echarts}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default Efficiency;
