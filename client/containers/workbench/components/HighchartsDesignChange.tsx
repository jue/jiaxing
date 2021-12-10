import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function HighchartsColumn({ data, series }) {
  const options = {
    chart: {
      type: 'column',
      height: 184,
    },
    title: {
      text: '',
    },
    subtitle: {
      text: '',
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories: data._ids,
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: '',
      },
    },
    // legend: {
    //   //设置图例
    //   layout: 'vertical',
    //   align: 'center',
    //   verticalAlign: 'top',
    //   x: 0,
    //   y: 0,
    // },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        borderWidth: 0,
      },
    },
    series: series,
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default HighchartsColumn;
