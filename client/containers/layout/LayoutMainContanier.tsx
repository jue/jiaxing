import {
  Breadcrumbs,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Select } from 'antd';
import { motion } from 'framer-motion';
import HtmlTitle from '../../components/HtmlTitle';
import { LayoutPageContext } from './context/LayoutPageContext';
import { fadeInUpVariants } from '../../styles/motionVariants';
import { useRouter } from 'next/router';
import clsx from 'clsx';

const { Option } = Select;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      '.ant-select-arrow': {
        minWidth: 22,
      },
    },
    workBench: {
      backgroundColor: 'rgba(0,0,0,0)!important',
    },
    toolbar: theme.mixins.toolbar,
    main: {
      padding: 10,
      [theme.breakpoints.up('sm')]: {
        marginLeft: 240,
      },
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
    },

    breadcrumb: {
      fontSize: 14,
      '& li:nth-of-type(1) p': {
        opacity: 0.45,
      },
      '& .MuiBreadcrumbs-separator': {
        opacity: 0.45,
        margin: 0,
      },
    },
    contanier: {
      flex: 1,
      display: 'grid',
      gridTemplateColumns: 'repeat(2,50%)',
      gridGap: 10,
      marginLeft: 10,
      marginRight: 10,
    },
    subTitle: {
      opacity: 1,
      fontSize: 14,
      fontFamily: 'PingFangSC-Regular',
      lineHeight: '40px',
      color: '#000000',
      height: 40,
    },
    title: {
      padding: '0 24px 24px ',
      backgroundColor: '#fff',
      fontSize: 20,
      fontWeight: 500,
    },

    motion: {
      margin: '10px 0 0',
    },
    contentContainer: {
      marginTop: 50,
      overflowX: 'hidden',
      overflowY: 'auto',
      backgroundColor: 'white',
    },
    name: {
      opacity: 0.65,
      width: theme.spacing(5),
      whiteSpace: 'nowrap',
    },
    divider: {
      width: 1,
      height: 10,
      backgroundColor: '#000',
      marginLeft: 11,
      opacity: 0.65,
    },
    paper: {
      padding: theme.spacing(0, 1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      display: 'flex',
      alignItems: 'center',
      height: '100%',
    },
    separator: {
      padding: '0px 3px',
    },
  })
);

export default function LayoutMainContanier(props: {
  children: React.ReactNode;
}) {
  const classes = useStyles();
  const { parts, setParts } = useContext(LayoutPageContext);

  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const router = useRouter();
  let IsWorhBench = router.pathname.includes('/workBench');

  let IsHome = router.pathname === '/';

  const setSize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setScreenSize({ width, height });
  };

  useEffect(() => {
    setSize();
    window.addEventListener('resize', setSize);
    return () => {
      window.removeEventListener('resize', setSize);
    };
  }, []);

  return (
    <main className={classes.main}>
      <HtmlTitle title={parts[0] || ''} />
      <div className={classes.toolbar} />
      <div
        style={{
          width: 'calc(100% - 260px)',
          position: 'fixed',
        }}
      >
        <Grid container spacing={2}>
          <Grid item sm={6}>
            <Paper className={classes.paper}>
              <Breadcrumbs
                separator="/"
                aria-label="breadcrumb"
                className={classes.breadcrumb}
                classes={{ separator: classes.separator }}
              >
                {parts.map((part, index) => {
                  let p = {};
                  if (index === parts.length - 1) {
                    p = { color: 'textPrimary' };
                  }
                  return (
                    <Typography key={index} {...p} className={classes.subTitle}>
                      {part}
                    </Typography>
                  );
                })}
              </Breadcrumbs>
            </Paper>
          </Grid>

          <Grid item sm={3}>
            <Paper className={classes.paper}>
              <div className={classes.name}>项目</div>
              <Divider className={classes.divider} />
              <Select
                defaultValue="jx"
                style={{ color: 'rgba(0, 0, 0, 0.8)', width: '88%' }}
                bordered={false}
              >
                <Option value="jx">嘉兴有轨电车一期工程</Option>
              </Select>
            </Paper>
          </Grid>

          <Grid item sm={3}>
            <Paper className={classes.paper}>
              <div className={classes.name}>标段</div>
              <Divider className={classes.divider} />

              <Select
                defaultValue="jx"
                style={{ color: 'rgba(0, 0, 0, 0.8)', width: '88%' }}
                bordered={false}
              >
                <Option value="jx">嘉兴市有轨电车T1线一期工程</Option>
                <Option value="jx1">
                  嘉兴市有轨电车T2线一期工程(月河北站-环城南路站)
                </Option>
                <Option value="jx2">嘉兴市有轨电车一期工程市政配套项目</Option>
                <Option value="jx3">
                  嘉兴市有轨电车庆丰路车辆基地综合开发上盖基础项目
                </Option>
                <Option value="jx4">嘉兴市庆丰路公交枢纽配套用房</Option>
              </Select>
            </Paper>
          </Grid>
        </Grid>
      </div>
      <motion.div
        initial="exit"
        animate="enter"
        exit="exit"
        variants={fadeInUpVariants}
        className={classes.motion}
      >
        <div
          className={clsx(
            classes.contentContainer,
            (IsWorhBench || IsHome) && classes.workBench
          )}
          style={{ height: screenSize.height - 140 || 800 }}
        >
          {props.children}
        </div>
      </motion.div>
    </main>
  );
}
