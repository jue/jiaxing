import React, { useContext, useRef, useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  AppBar,
  Toolbar,
  Paper,
} from '@material-ui/core';

import Head from 'next/head';
import axios from 'axios';

import { motion } from 'framer-motion';
import { containerVariants } from '../client/styles/motionVariants';
import clsx from 'clsx';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import PasswordTexField from '../client/components/PasswordTextField';
import Notifier from '../client/components/Notifier';
import BaseSvc from '../client/services/BaseSvc';
import { useRouter } from 'next/router';

export const useLoginStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      'div#__next': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        placeContent: 'center',
      },
    },

    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',

      maxWidth: 960,
      maxHeight: 640,
    },

    topbar: {
      fontSize: 18,
      padding: theme.spacing(0, 2),
    },

    paper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: theme.spacing(4),
      [theme.breakpoints.up('md')]: {
        alignItems: 'left',
      },
      [theme.breakpoints.down('sm')]: {
        alignItems: 'center',
      },
    },

    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },

    submit: {
      height: 50,
      fontSize: 16,
      background: '#3F51B5',
      color: '#fff',
      '&:hover': {
        width: '100%',
        height: 50,
        fontSize: 16,
        background: '#3F51B5',
        color: '#fff',
      },
    },
    loginTitle: {
      fontSize: 20,
      fontWeight: 400,
      color: '#212529',
    },
    agree: {
      color: '#9EA0A5',
      fontSize: 14,
      marginLeft: -20,
    },
    agreement: {
      color: '#56575A',
      borderBottom: '1px solid #56575A',
      fontWeight: 400,
    },
  })
);

const LoginContainer = () => {
  const classes = useLoginStyles({});
  const [accountName, setAccountName] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  let title = 'HAN-TRAM';

  const onLogin = async () => {
    await axios.post('/api/account/login', {
      userName: accountName,
      password,
    });
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>登录</title>
      </Head>
      <AppBar className={classes.topbar}>
        <Toolbar>BIM+数字化项目管理平台</Toolbar>
      </AppBar>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className={clsx(classes.container)}
      >
        <Paper className={clsx(classes.paper)}>
          <div>
            <Typography className={classes.loginTitle}>登录您的账户</Typography>
          </div>
          <form className={classes.form} noValidate>
            <TextField
              id="username"
              label="用户名"
              autoComplete="username"
              margin="normal"
              variant="outlined"
              fullWidth
              onChange={(e) => {
                setAccountName(e.target.value.trim());
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <PasswordTexField
              onChange={(e) => {
                setPassword(e.target.value.trim());
              }}
            />

            <Button
              fullWidth
              variant="outlined"
              color="primary"
              className={classes.submit}
              onClick={() => onLogin()}
            >
              登录
            </Button>
          </form>
        </Paper>
      </motion.div>
    </>
  );
};

export default () => {
  return (
    <>
      <LoginContainer />
      <Notifier />
    </>
  );
};
