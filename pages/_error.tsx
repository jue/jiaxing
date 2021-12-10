import React from 'react';
import Head from 'next/head';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import IconKeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';

const useStyles = makeStyles(() =>
  createStyles({
    error: {
      color: '#000',
      background: '#fff',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
);

export default function ErrorPage() {
  const classes = useStyles();
  return (
    <>
      <Head>
        <title>出错啦</title>
      </Head>
      <div className={classes.error}>
        <Button
          onClick={() => {
            window.history.back();
          }}
        >
          <IconKeyboardArrowLeft />
          后退
        </Button>
      </div>
    </>
  );
}
