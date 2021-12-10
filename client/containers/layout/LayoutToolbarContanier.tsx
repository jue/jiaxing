import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  MenuItem,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';

import { Popover, Badge } from 'antd';

import { LayoutPageContext } from './context/LayoutPageContext';
import Search from '../../components/Svgs/Search';
import Notification from '../../components/Svgs/Notification';
import { AuthContext } from '../../contexts/AuthContext';
import accountSvc from '../../services/accountSvc';
import MessageSvc from '../../services/MessageSvc';
import { Router } from '../../../server/next.routes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: '#FFFFFF',
      boxShadow: '0px 1px 4px 0px rgba(0,0,0,0.1)',
      '& .MuiTypography-noWrap': {
        overflow: 'visible',
      },
    },
    toolBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    logo: {
      display: 'none',
      color: 'black',
      [theme.breakpoints.up('sm')]: {
        display: 'flex',
        alignItems: 'center',
        width: 174,
        height: '100%',
        '& img': {
          width: '100%',
          height: '44px',
        },
      },
    },
    hide: {
      display: 'none',
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    user: {
      display: 'flex',
      alignItems: 'center',
      '& img': {
        width: 24,
        height: 24,
      },
      '& svg:nth-of-type(2)': {
        margin: '0 24px',
      },
    },
    userName: {
      marginLeft: 8,
      color: 'rgba(0,0,0,0.65)',
      fontSize: 14,
    },
    miniButton: {
      display: 'flex',
      alignItems: 'center',
      paddingRight: 20,
      cursor: 'pointer',
      paddingTop: 5,
      '& svg': {
        width: 18,
        height: 18,
      },
      '& .badge': {
        position: 'absolute',
        width: 20,
        height: 20,
        backgroundColor: '#ff4d4f',
        borderRadius: '50%',
      },
    },
  })
);

export default function LayoutToolbarContanier() {
  const classes = useStyles();
  const { setOpenSideBar, openSideBar } = useContext(LayoutPageContext);
  const { account } = useContext(AuthContext);
  const [unread, setUnRead] = useState(0);

  useEffect(() => {
    MessageSvc.search({
      read: 0,
      pageIndex: 1,
    }).then(data => {
      if (data.code === 200) {
        const { total } = data.data;
        setUnRead(total);
      }
    });
  }, []);

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => {
            setOpenSideBar(!openSideBar);
          }}
          edge="start"
          className={clsx(classes.menuButton, {
            // [classes.hide]: openSideBar,
          })}
        >
          <MenuIcon />
        </IconButton>
        <div className={classes.toolBar}>
          <Typography className={classes.logo} component="div" noWrap>
            <img src="/static/images/logo.png" />
          </Typography>
          <Typography className={classes.user} component="div" noWrap>
            <div className={classes.miniButton}>
              <Search />
            </div>

            <div
              className={classes.miniButton}
              onClick={() =>
                Router.pushRoute(`/personalCenter/notificationList`)
              }
              style={{
                position: 'relative',

                paddingRight: unread > 0 ? 34 : 20,
              }}
            >
              <Badge count={unread} offset={[unread < 10 ? 3 : 7, 0]}>
                <Notification />
              </Badge>
            </div>

            <Popover
              // title={account.userName}
              placement="bottomRight"
              trigger="click"
              content={
                <>
                  <MenuItem
                    onClick={async () => {
                      await accountSvc.logout();
                      Router.replace('/login');
                    }}
                  >
                    <ExitToAppIcon color="inherit" />
                    退出
                  </MenuItem>
                </>
              }
            >
              <div>
                <img src="/static/images/avatar.png" />
                <span className={classes.userName}>
                  {account && account.userName}
                </span>
              </div>
            </Popover>
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
}
