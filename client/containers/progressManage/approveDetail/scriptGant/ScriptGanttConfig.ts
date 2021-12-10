export const getZoomConfig = (gantt) => ({
  levels: [
    {
      name: 'day',
      scale_height: 27,
      min_column_width: 80,
      scales: [{ unit: 'day', step: 1, format: '%d %M' }],
    },
    {
      // name: 'week',
      // scale_height: 50,
      // min_column_width: 50,
      // scales: [
      //   {
      //     unit: 'week',
      //     step: 1,
      //     format: function (date) {
      //       var dateToStr = gantt.date.date_to_str('%d %M');
      //       var endDate = gantt.date.add(date, -6, 'day');
      //       var weekNum = gantt.date.date_to_str('%W')(date);
      //       return (
      //         '#' +
      //         weekNum +
      //         ', ' +
      //         dateToStr(date) +
      //         ' - ' +
      //         dateToStr(endDate)
      //       );
      //     },
      //   },
      //   { unit: 'day', step: 1, format: '%j %D' },
      // ],
    },
    {
      name: 'month',
      scale_height: 50,
      min_column_width: 120,
      scales: [
        { unit: 'month', format: '%F, %Y' },
        { unit: 'week', format: 'Week #%W' },
      ],
    },
    {
      name: 'quarter',
      height: 50,
      min_column_width: 90,
      scales: [
        { unit: 'month', step: 1, format: '%M' },
        {
          unit: 'quarter',
          step: 1,
          format: function (date) {
            var dateToStr = gantt.date.date_to_str('%M');
            var endDate = gantt.date.add(
              gantt.date.add(date, 3, 'month'),
              -1,
              'day'
            );
            return dateToStr(date) + ' - ' + dateToStr(endDate);
          },
        },
      ],
    },
    {
      name: 'year',
      scale_height: 50,
      min_column_width: 30,
      scales: [{ unit: 'year', step: 1, format: '%Y' }],
    },
  ],
});

export const getScaleConfigs = (gantt) => [
  // decades
  {
    scales: [
      {
        subscale_unit: 'year',
        unit: 'year',
        step: 10,
        template: function (date) {
          var dateToStr = gantt.date.date_to_str('%Y');
          var endDate = gantt.date.add(
            gantt.date.add(date, 10, 'year'),
            -1,
            'day'
          );
          return dateToStr(date) + ' - ' + dateToStr(endDate);
        },
      },
      {
        unit: 'year',
        step: 100,
        template: function (date) {
          var dateToStr = gantt.date.date_to_str('%Y');
          var endDate = gantt.date.add(
            gantt.date.add(date, 100, 'year'),
            -1,
            'day'
          );
          return dateToStr(date) + ' - ' + dateToStr(endDate);
        },
      },
    ],
  },
  // years
  {
    scales: [
      { subscale_unit: 'year', unit: 'year', step: 1, date: '%Y' },
      {
        unit: 'year',
        step: 5,
        template: function (date) {
          var dateToStr = gantt.date.date_to_str('%Y');
          var endDate = gantt.date.add(
            gantt.date.add(date, 5, 'year'),
            -1,
            'day'
          );
          return dateToStr(date) + ' - ' + dateToStr(endDate);
        },
      },
    ],
  },
  // quarters
  {
    scales: [
      { subscale_unit: 'month', unit: 'year', step: 3, format: '%Y' },
      {
        unit: 'month',
        step: 3,
        template: function (date) {
          var dateToStr = gantt.date.date_to_str('%M');
          var endDate = gantt.date.add(
            gantt.date.add(date, 3, 'month'),
            -1,
            'day'
          );
          return dateToStr(date) + ' - ' + dateToStr(endDate);
        },
      },
    ],
  },
  // months
  {
    scales: [
      { subscale_unit: 'month', unit: 'year', step: 1, format: '%Y' },
      { unit: 'month', step: 1, format: '%M' },
    ],
  },
  // weeks
  {
    scales: [
      { subscale_unit: 'week', unit: 'month', step: 1, date: '%F' },
      {
        unit: 'week',
        step: 1,
        template: function (date) {
          var dateToStr = gantt.date.date_to_str('%d %M');
          var endDate = gantt.date.add(
            gantt.date.add(date, 1, 'week'),
            -1,
            'day'
          );
          return dateToStr(date) + ' - ' + dateToStr(endDate);
        },
      },
    ],
  },
  // days
  {
    scales: [
      { subscale_unit: 'day', unit: 'month', step: 1, format: '%F' },
      { unit: 'day', step: 1, format: '%j' },
    ],
  },
  // // hours
  // {
  //   scales: [
  //     { subscale_unit: 'hour', unit: 'day', step: 1, format: '%j %M' },
  //     { unit: 'hour', step: 1, format: '%H:%i' },
  //   ],
  // },
  // // minutes
  // {
  //   scales: [
  //     { subscale_unit: 'minute', unit: 'hour', step: 1, format: '%H' },
  //     { unit: 'minute', step: 1, format: '%H:%i' },
  //   ],
  // },
];
