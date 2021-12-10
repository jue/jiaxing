import React, { useContext, useState, useEffect } from 'react';
import clsx from 'clsx';

import { makeStyles, createStyles } from '@material-ui/core/styles';

import { Divider, Typography, InputAdornment, Button } from '@material-ui/core';
import { EngineeringContext } from '../context/EngineeringContext';
import { MuiInput } from '../../../components/Input';
import SearchIcon from '../../../components/Svgs/authority/SearchIcon';
import modelSvc from '../../../services/modelSvc';
import ModelDIffDialog from './ModelDiffDialog';
const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    root: {
      margin: spacing(2.5, 3),
      display: 'flex',
      flexDirection: 'column',
      height: 'calc( 100% - 40px)',
    },
    typography: {
      color: 'rgba(0,0,0,0.85)',
      fontWeight: 400,
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: spacing(4),
      height: '100%',
      overflow: 'auto',
    },
    modelContainer: {
      width: '50%',
      marginLeft: spacing(1),
    },
    current: {
      marginBottom: 115,
    },
    already: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      marginBottom: spacing(2),
    },
    li: {
      height: spacing(3),
      lineHeight: '24px',
      fontSize: 14,
      color: 'rgba(0,0,0,0.65)',
      cursor: 'pointer',
      '&:hover': {
        color: '#8FC220',
      },
      '&:active': {
        color: '#8FC220',
      },
      '&:focus': {
        color: '#8FC220',
      },
    },
    cur: {
      color: '#8FC220',
    },
    muiInput: {
      width: 220,
      height: 32,
    },
    cancleButton: {
      width: 106,
      height: 36,
      float: 'right',
      '& .MuiButton-label': {
        color: 'rgba(0,0,0,0.3)',
      },
    },
  })
);

interface OpenBIMFile {
  letfBIM: any;
  rightBIM: any;
}

const BIMCompared = () => {
  const classes = useStyles();
  const {
    setOpenBIM,
    engineeringInfo,
    handleViewQuery,
    diffModelFile,
  } = useContext(EngineeringContext);
  const [openBIMFile, setOpenBIMFIle] = useState<OpenBIMFile>({
    letfBIM: {},
    rightBIM: {},
  });
  //BIM预览
  const [openCompared, setOpenCompared] = useState(false);
  const [modelTableLeft, setModelTableLeft] = useState<any>([]);
  const [modelTableRight, setModelTableRight] = useState<any>([]);
  const [queryName, setQueryName] = useState('');
  const [indexLeft, setIndexLeft] = useState('');
  const [indexRight, setIndexRight] = useState('');

  const queryModelTable = async () => {
    try {
      const data = await modelSvc.query({});
      setModelTableLeft(data.data);
      setModelTableRight(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    queryModelTable();
  }, []);

  useEffect(() => {
    if (
      JSON.stringify(openBIMFile.letfBIM) !== '{}' &&
      JSON.stringify(openBIMFile.rightBIM) !== '{}'
    ) {
      setOpenCompared(true);
      handleViewQuery(openBIMFile);
    }
  }, [openBIMFile]);
  let list: any =
    diffModelFile === 'BIMModel'
      ? engineeringInfo.BIMModel
      : engineeringInfo.changeDrawings;

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.typography}>
        BIM模型对比
      </Typography>
      <Divider />

      <div className={classes.container}>
        <div
          className={classes.modelContainer}
          style={{ borderRight: '1px solid rgba(245,245,245,1)' }}
        >
          <div className={classes.current}>
            <Typography
              className={classes.typography}
              style={{ fontSize: 16, marginBottom: 16 }}
            >
              当前模型选择
            </Typography>
            <ul>
              {list.map((item) => {
                return (
                  <li
                    key={item._id}
                    className={clsx(
                      classes.li,
                      indexLeft === item._id && classes.cur
                    )}
                    onClick={() => {
                      setOpenBIMFIle({
                        ...openBIMFile,
                        letfBIM: item,
                      });
                      setIndexLeft(item._id);
                    }}
                  >
                    {item.originalname}
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <div className={classes.already}>
              <Typography
                className={classes.typography}
                style={{ fontSize: 16, width: '57%', lineHeight: '32px' }}
              >
                已有模型选择
              </Typography>
              <div className={classes.muiInput}>
                <MuiInput
                  placeholder="请输入"
                  onBlur={(e) => {
                    const value = e.target.value.trim();
                    setQueryName(value);
                  }}
                  endAdornment={
                    <InputAdornment
                      position="end"
                      onClick={async () => {
                        const data = await modelSvc.query({
                          name: queryName,
                        });
                        setModelTableLeft(data.data);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <SearchIcon />
                    </InputAdornment>
                  }
                />
              </div>
            </div>
            <ul>
              {modelTableLeft &&
                modelTableLeft.length !== 0 &&
                modelTableLeft.map((item) => (
                  <li
                    key={item._id}
                    className={clsx(
                      classes.li,
                      indexLeft === item._id && classes.cur
                    )}
                    onClick={() => {
                      setOpenBIMFIle({
                        ...openBIMFile,
                        letfBIM: item.files,
                      });
                      setIndexLeft(item._id);
                    }}
                  >
                    {item.files.originalname}
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className={classes.modelContainer} style={{ paddingLeft: 12 }}>
          <div className={classes.current}>
            <Typography
              className={classes.typography}
              style={{ fontSize: 16, marginBottom: 16 }}
            >
              当前模型选择
            </Typography>
            <ul>
              {list.map((item) => {
                return (
                  <li
                    key={item._id}
                    className={clsx(
                      classes.li,
                      indexRight === item._id && classes.cur
                    )}
                    onClick={() => {
                      setOpenBIMFIle({
                        ...openBIMFile,
                        rightBIM: item,
                      });
                      setIndexRight(item._id);
                    }}
                  >
                    {item.originalname}
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <div className={classes.already}>
              <Typography
                className={classes.typography}
                style={{ fontSize: 16, width: '57%', lineHeight: '32px' }}
              >
                已有模型选择
              </Typography>
              <div className={classes.muiInput}>
                <MuiInput
                  placeholder="请输入"
                  onBlur={(e) => {
                    const value = e.target.value.trim();
                    setQueryName(value);
                  }}
                  endAdornment={
                    <InputAdornment
                      position="end"
                      onClick={async () => {
                        const data = await modelSvc.query({
                          name: queryName,
                        });
                        setModelTableRight(data.data);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <SearchIcon />
                    </InputAdornment>
                  }
                />
              </div>
            </div>
            <ul>
              {modelTableRight &&
                modelTableRight.length !== 0 &&
                modelTableRight.map((item) => (
                  <li
                    key={item._id}
                    className={clsx(
                      classes.li,
                      indexRight === item._id && classes.cur
                    )}
                    onClick={() => {
                      setOpenBIMFIle({
                        ...openBIMFile,
                        rightBIM: item.files,
                      });
                      setIndexRight(item._id);
                    }}
                  >
                    {item.files.originalname}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      <div style={{ width: '100%' }}>
        <Button
          onClick={() => {
            setOpenBIM(false);
          }}
          variant="outlined"
          color="primary"
          className={classes.cancleButton}
        >
          取消
        </Button>
      </div>
      <ModelDIffDialog
        setOpenCompared={setOpenCompared}
        setOpenBIMFIle={setOpenBIMFIle}
        openCompared={openCompared}
      />
    </div>
  );
};
export default BIMCompared;
