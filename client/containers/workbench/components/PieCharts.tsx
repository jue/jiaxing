import Highcharts from 'highcharts';
import highcharts3d from 'highcharts/highcharts-3d';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';

function PieCharts({ data, qualityPie }) {
  const [info, setInfo] = useState<any>({});

  // options.series[0].data = data;

  useEffect(() => {
    // console.log(qualityPie);

    // setTimeout(() => {
    //   // options.series[0].setData(data);
    //   setInfo({
    //     ...options,
    //     series: [
    //       {
    //         data: data,
    //       },
    //     ],
    //   });
    // }, 1000);
    // if (JSON.stringify(qualityPie) !== '{}') {
    let optionsPie = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        // width: '270',
        height: 185,
        options3d: {
          enabled: true,
          alpha: 45,
        },
      },

      title: {
        text: '',
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}个</b>',
      },
      accessibility: {
        point: {
          valueSuffix: '',
        },
      },

      plotOptions: {
        pie: {
          innerSize: 30,
          depth: 30,
          cursor: 'pointer',
          allowPointSelect: true,
          dataLabels: {
            enabled: true,
            distance: -10,
            format: '<b>{point.y}</b>',
          },
          showInLegend: true,
        },
      },
      series: [
        {
          type: 'pie',
          size: '120%',
          innerSize: '50%',
          name: '',
          data: data,
        },
      ],
    };
    setInfo(optionsPie);
    // }
  }, [qualityPie]);
  if (typeof Highcharts === 'object') {
    highcharts3d(Highcharts);
  }
  return (
    <HighchartsReact
      highcharts={Highcharts}
      // constructorType={'chart'}
      options={info}
    />
  );
}

export default PieCharts;
