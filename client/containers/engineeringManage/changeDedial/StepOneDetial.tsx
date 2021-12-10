import { useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';

import { EngineeringContext } from '../context/EngineeringContext';

import { Grid, FormControl, InputLabel } from '@material-ui/core';

import { engineeringStyles, OutlineInput } from '../styles';

const StepOneDedial = () => {
  const router = useRouter();
  const { engineeringInfo } = useContext(EngineeringContext);
  const classes = engineeringStyles({});

  return (
    <div className={classes.root}>
      <div className={classes.row}>
        <Grid container spacing={3}>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                工程名称：
              </InputLabel>
              <div className={clsx(classes.select, classes.detial)}>
                {engineeringInfo.engineeringName}
              </div>
            </FormControl>
          </Grid>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                合同名称：
              </InputLabel>
              <div className={clsx(classes.select, classes.detial)}>
                {engineeringInfo.contractName}
              </div>
            </FormControl>
          </Grid>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                建设单位：
              </InputLabel>
              <div className={clsx(classes.select, classes.detial)}>
                {engineeringInfo.constructionUnit}
              </div>
            </FormControl>
          </Grid>
        </Grid>
      </div>

      <div className={classes.row}>
        <Grid container spacing={3}>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                施工单位：
              </InputLabel>
              <div className={clsx(classes.select, classes.detial)}>
                {engineeringInfo.constructionExectionUnit}
              </div>
            </FormControl>
          </Grid>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                设计单位：
              </InputLabel>
              <div className={clsx(classes.select, classes.detial)}>
                {engineeringInfo.designUnit}
              </div>
            </FormControl>
          </Grid>
          <Grid item xs={8} sm={4}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink className={classes.inputLabel}>
                监理单位：
              </InputLabel>
              <div className={clsx(classes.select, classes.detial)}>
                {engineeringInfo.constructionControlUnit}
              </div>
            </FormControl>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
export default StepOneDedial;
