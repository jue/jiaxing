import React, { useContext, useRef, useState } from 'react';
import { AppBar, Toolbar, Paper } from '@material-ui/core';
import { Result, Button } from 'antd';
import Head from 'next/head';
import axios from 'axios';

import { motion } from 'framer-motion';
import { containerVariants } from '../../client/styles/motionVariants';
import clsx from 'clsx';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import PasswordTexField from '../../client/components/PasswordTextField';
import Notifier from '../../client/components/Notifier';
import BaseSvc from '../../client/services/BaseSvc';
import WxSvc from '../../client/services/wxSvc';
import { useRouter } from 'next/router';
import { message } from 'antd';
message.config({
  top: 60,
});
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
    BindButton: {
      background: 'linear-gradient(45deg, #226B8B 30%, #22883B 90%)',
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(255, 200, 135, .3)',
      color: 'white',
      height: 48,
      padding: '0 30px',
    },
  })
);
interface IbindResult {
  msg: string;
  result: any;
  status: string;
}
declare var WeixinJSBridge;
const defBindResult: IbindResult = { msg: '', result: '', status: 'ok' };
const LoginContainer = () => {
  const classes = useLoginStyles({});
  const [accountName, setAccountName] = useState('');
  const [password, setPassword] = useState('');
  const [showBind, setShowBind] = useState(true);
  const [bindResult, setBindResult] = useState(false);
  const router = useRouter();

  const handleOnClose = () => {
    if (typeof WeixinJSBridge != 'undefined') {
      window.close();
      //安卓手机
      document.addEventListener(
        'WeixinJSBridgeReady',
        function () {
          WeixinJSBridge.call('closeWindow');
        },
        false
      );
      //ios手机
      WeixinJSBridge.call('closeWindow');
    } else {
      window.close();
    }
  };
  return (
    <>
      <Head>
        <title>绑定成功</title>
      </Head>
      <AppBar className={classes.topbar}>
        <Toolbar>BIM+数字化项目管理平台</Toolbar>
      </AppBar>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        style={{ width: '100%' }}
        className={clsx(classes.container)}
      >
        <Result
          status="success"
          title="账号已绑定成功!"
          extra={[
            <Button
              // type="primary"
              style={{ width: '100%' }}
              key="console"
              onClick={handleOnClose}
            >
              关闭
            </Button>,
          ]}
        />
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
