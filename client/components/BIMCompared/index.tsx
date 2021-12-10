import React, { useContext, useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Divider, Typography, InputAdornment, Button } from '@material-ui/core';
import { MuiInput } from '../Input';
import SearchIcon from '../Svgs/authority/SearchIcon';
import ModelDIffDialog from './ModelDIffDialog';
import forgeSvc from '../../services/forgeSvc';

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

const handleModelDiff = async modelId => {
  const data = await forgeSvc.modelDiff({
    primaryId: modelId.letfBIM._id,
    diffId: modelId.rightBIM._id,
  });
  return data;
};

const BIMCompared = ({ modelInfo, modelInfos, func, queryAllModel }) => {
  const classes = useStyles();
  const [openBIMFile, setOpenBIMFIle] = useState<OpenBIMFile>({
    letfBIM: {},
    rightBIM: {},
  });
  //BIM预览
  const [openCompared, setOpenCompared] = useState('');
  const [queryName, setQueryName] = useState('');
  const [indexLeft, setIndexLeft] = useState('');
  const [indexRight, setIndexRight] = useState('');

  useEffect(() => {
    if (
      JSON.stringify(openBIMFile.letfBIM) !== '{}' &&
      JSON.stringify(openBIMFile.rightBIM) !== '{}'
    ) {
      handleModelDiff(openBIMFile).then(m => {
        setOpenCompared(m);
      });
    }
  }, [openBIMFile]);

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
              <li
                className={clsx(
                  classes.li,
                  indexLeft === modelInfo._id && classes.cur
                )}
                onClick={() => {
                  setOpenBIMFIle({
                    ...openBIMFile,
                    letfBIM: modelInfo.files,
                  });
                  setIndexLeft(modelInfo._id);
                }}
              >
                {modelInfo.name}&nbsp;&nbsp;版本:{modelInfo.version}
              </li>
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
                  onBlur={e => {
                    const value = e.target.value.trim();
                    setQueryName(value);
                  }}
                  endAdornment={
                    <InputAdornment
                      position="end"
                      onClick={async () => {
                        queryAllModel('', queryName);
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
              {modelInfos &&
                modelInfos.length !== 0 &&
                modelInfos.map(item => (
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
                    {item.name}&nbsp;&nbsp;版本:{item.version}
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
              <li
                className={clsx(
                  classes.li,
                  indexRight === modelInfo._id && classes.cur
                )}
                onClick={() => {
                  setOpenBIMFIle({
                    ...openBIMFile,
                    rightBIM: modelInfo.files,
                  });
                  setIndexRight(modelInfo._id);
                }}
              >
                {modelInfo.name}&nbsp;&nbsp;版本:{modelInfo.version}
              </li>
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
                  onBlur={e => {
                    const value = e.target.value.trim();
                    setQueryName(value);
                  }}
                  endAdornment={
                    <InputAdornment
                      position="end"
                      onClick={async () => {
                        queryAllModel('', queryName);
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
              {modelInfos &&
                modelInfos.length !== 0 &&
                modelInfos.map(item => (
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
                    {item.name}&nbsp;&nbsp;版本:{item.version}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      <div style={{ width: '100%' }}>
        <Button
          onClick={() => {
            func({});
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
