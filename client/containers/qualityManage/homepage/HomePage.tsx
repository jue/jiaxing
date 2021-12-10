import { Grid, Paper } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useContext, useEffect } from 'react';

import Efficiency from './Efficiency';
import HomeBim from './HomeBim';
import { LayoutPageContext } from '../../layout/context/LayoutPageContext';
import QualityAmount from './QualityAmount';
import QualityReport from './QualityReport';
import QualityType from './QualityType';
import RangePickers from '../../../components/Datepicker/RangePicker';
import { withRouter } from 'next/router';

const useStyles = makeStyles((theme) => {
  return createStyles({
    '@global': {
      '#__next': {
        overflow: 'hidden',
      },
    },
    dataAnalysis: {
      background: '#fff',
      padding: 16,
      boxShadow: '0px 2px 4px 0px rgba(239,242,247,1)',
      borderRadius: 4,
      color: '#666',
      height: '40%',
      minHeight: 380,
    },
    analiysisTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 32,
      marginBottom: 14,
    },
    data: {
      color: '#476590',
      fontSize: 14,
      fontWeight: 600,
    },
    echarts: {
      height: '88%',
      display: 'flex',
    },
    echartDetail: {
      padding: theme.spacing(1),
      boxShadow: '0px 1px 3px 1px rgba(31,31,31,0.12)',
      height: 300,
    },
  });
});

export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);
  const classes = useStyles({});

  useEffect(() => {
    setParts(['质量管理', '首页']);
  }, [router.query]);

  return (
    <>
      <div className={classes.dataAnalysis}>
        <div className={classes.analiysisTop}>
          <span className={classes.data}>数据分析</span>
          <RangePickers />
        </div>

        <Grid container spacing={2}>
          <Grid item sm={3} xs={6}>
            <Paper className={classes.echartDetail}>
              <QualityAmount />
            </Paper>
          </Grid>
          <Grid item sm={3} xs={6}>
            <Paper className={classes.echartDetail}>
              <QualityType />
            </Paper>
          </Grid>
          <Grid item sm={3} xs={6}>
            <Paper className={classes.echartDetail}>
              <QualityReport />
            </Paper>
          </Grid>
          <Grid item sm={3} xs={6}>
            <Paper className={classes.echartDetail}>
              <Efficiency />
            </Paper>
          </Grid>
        </Grid>
      </div>

      <HomeBim />
    </>
  );
});
