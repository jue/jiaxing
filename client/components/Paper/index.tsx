import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      borderRadius: 4,
      boxShadow:
        '0px 0px 3px 0px rgba(0,0,0,0.1),0px 0px 0px 1px rgba(0,0,0,0.05)',
      background: '#fff',
      padding: 14,
    },
  })
);

export function MuiPaper(props) {
  const classes = useStyles();

  return <Paper {...props} className={classes.root} />;
}
