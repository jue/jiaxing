import { useState, useContext } from 'react';
import { useRouter } from 'next/router';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Button,
  Box,
  Typography,
  Grid,
  CardContent,
  Card,
} from '@material-ui/core';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import { Tooltip } from 'antd';
import Clear from '../../../../components/Svgs/Clear';
import Compile from '../../../../components/Svgs/Compile';
import QualityInspectionDialog from '../QualityInspectionDialog';
import { InspectionContext } from '../../context/InspectionContext';
import QualityInspectionProblemDeleteModal from './ProblemDeleteModal';
import PreViewFile from '../../../../components/FilePreview';
import clsx from 'clsx';

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    index: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: spacing(4),
      lineHeight: '32px',
      paddingLeft: 16,
      background: 'rgba(143, 195, 32, 1)',
      color: '#fff',
    },
    button: {
      height: 26,
      paddingTop: 2,
      float: 'right',
      '& .MuiButton-label': {
        fontWeight: 400,
        color: palette.primary.main,
        fontSize: 12,
      },
      startIcon: {
        marginRight: 4,
      },
    },
    card: {
      flex: '1',
      marginBottom: spacing(3),
      boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.1)',
      border: 'none',
      position: 'relative',
    },
    cardContent: {
      padding: '10px 16px!important',
    },
    typography: {
      width: 310,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    box: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      // marginLeft: spacing(4),
    },
    fab: {
      position: 'absolute',
      bottom: spacing(1),
      right: spacing(1),
      '& .MuiIconButton-label': {
        width: spacing(1),
        height: spacing(1),
      },
    },
    show: {
      float: 'right',
      border: '2px solid rgba(240,242,245,1)',
      display: 'flex',
      width: 112,
      justifyContent: 'center',
      margin: 8,
      // position: 'absolute',
      // right: 28,
      // bottom: 4,
    },
    img: {
      width: '90%',
      height: 56,
      borderRadius: 4,
      margin: 3,
    },
    drag: {
      '& .MuiIconButton-root:hover': {
        background: 'none',
      },
      '& .MuiSvgIcon-root': {
        fontSize: 12,
        color: '#D8D8D8',
      },
      '& .MuiSvgIcon-root:hover': {
        color: '#8FC220',
      },
      '& .MuiSvgIcon-root:active': {
        color: '#8FC220',
      },
    },
    imgList: {
      width: '82%',
      // height: 64,
      overflow: 'hidden',
      display: 'flex',
    },
    imgWrap: {
      flexWrap: 'wrap',
      overflow: 'none',
      height: 'auto',
    },
  })
);

const Problem = () => {
  const {
    hiddenDangerProblem,
    setHiddenDangerProblem,
    problemData,
    setProblemData,
  } = useContext(InspectionContext);
  const classes = useStyles({});
  const [hiddenDialog, setHiddenDialog] = useState('');

  const [visible, setVisible] = useState(false);
  const [preViewFile, setPreViewFile] = useState<any>();
  const { query } = useRouter();
  const [imgOpen, setImgOpen] = useState(false);
  return (
    <Box width="48%" height="100%">
      {/* 问题列表拖拽，暂时不需要 */}

      <Grid container spacing={3}>
        <Grid item md={8}>
          问题项：
        </Grid>
        <Grid item md={4}>
          {query.action !== 'view' && (
            <Button
              color="primary"
              variant="outlined"
              size="small"
              className={classes.button}
              startIcon={<AddCircleOutline style={{ fontSize: 14 }} />}
              onClick={() => {
                setHiddenDialog('created');
                setProblemData({});
              }}
            >
              添加问题项
            </Button>
          )}

          <QualityInspectionDialog
            hiddenDialog={hiddenDialog}
            setHiddenDialog={setHiddenDialog}
          />
        </Grid>
      </Grid>
      <div
        style={{
          height: '90%',
          overflow: 'auto',
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        <div style={{ height: '100%' }}>
          {Boolean(hiddenDangerProblem && hiddenDangerProblem.length)
            ? hiddenDangerProblem.map((item, index) => {
                return (
                  <div key={index} style={{ marginBottom: 20 }}>
                    <Box mr={3} display="flex">
                      <Card className={classes.card} variant="outlined">
                        <CardContent className={classes.cardContent}>
                          <Typography className={clsx(classes.index)}>{`0${
                            index + 1
                          }`}</Typography>
                          <Box className={classes.box} mt={3}>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="p"
                              style={{ width: 60, textAlign: 'right' }}
                            >
                              问题项：
                            </Typography>

                            <Tooltip title={item.name}>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                component="p"
                                className={classes.typography}
                              >
                                {item.name}
                              </Typography>
                            </Tooltip>
                          </Box>
                          <Box className={classes.box}>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="p"
                              style={{ width: 60, textAlign: 'right' }}
                            >
                              备注：
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="p"
                            >
                              {item.remark}
                            </Typography>
                          </Box>
                          <Box className={classes.box}>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="p"
                              style={{ width: 60, textAlign: 'right' }}
                            >
                              图片：
                            </Typography>
                            <div
                              className={clsx(
                                classes.imgList,
                                imgOpen && classes.imgWrap
                              )}
                            >
                              {Boolean(
                                item.nodeFiles && item.nodeFiles.length
                              ) &&
                                item.nodeFiles.map((item) => {
                                  let fileArray =
                                    (item.resourceName &&
                                      item.resourceName.split('.')) ||
                                    [];
                                  let fileType = fileArray[1];
                                  const imgType = ['jpg', 'png', 'jpeg'];
                                  return (
                                    <Box
                                      key={item.resourceId}
                                      style={{
                                        flex: '0 0 20%',
                                        display: 'flex',
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: '94%',
                                          // height: '94%',
                                          marginRight: 10,
                                          cursor: 'pointer',
                                          marginBottom: 10,
                                          border: '1px solid rgba(0,0,0,.1)',
                                        }}
                                        onClick={() => {
                                          setPreViewFile(item);
                                        }}
                                      >
                                        {imgType.includes(fileType) ? (
                                          <img
                                            src={`/api/file/preview/${item.resourceId}/${item.resourceName}`}
                                            alt=""
                                            className={classes.img}
                                          />
                                        ) : (
                                          <video
                                            src={`/api/file/preview/${item.resourceId}/${item.resourceName}`}
                                            // autoPlay
                                            loop
                                            controls
                                            style={{
                                              width: '90%',
                                              height: '90%',
                                            }}
                                          />
                                        )}
                                      </div>
                                    </Box>
                                  );
                                })}
                            </div>
                          </Box>
                          {Boolean(
                            item.nodeFiles && item.nodeFiles.length > 5
                          ) && (
                            <div
                              style={{
                                width: 100,
                                color: 'rgba(24, 144, 255, 1)',
                                paddingLeft: 16,
                                position: 'absolute',
                                right: '-45px',
                                bottom: ' 22%',
                              }}
                              onClick={() => setImgOpen(!imgOpen)}
                            >
                              {imgOpen ? `收起` : `展开`}
                            </div>
                          )}
                          <Box className={classes.show}>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="div"
                              onClick={() => {
                                setProblemData(item);
                                setHiddenDialog('edit');
                              }}
                            >
                              <Compile />
                              编辑
                            </Typography>
                            <span style={{ margin: '0 4px' }}>|</span>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="div"
                              onClick={() => {
                                setVisible(true);
                              }}
                            >
                              <Clear />
                              删除
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                    {/* )} */}
                    <QualityInspectionProblemDeleteModal
                      visible={visible}
                      setVisible={() => setVisible(false)}
                      deleteProblem={() => {
                        setHiddenDangerProblem(
                          hiddenDangerProblem.filter(
                            (_, _index) => _index !== index
                          )
                        );
                        setVisible(false);
                      }}
                    />
                  </div>
                );
              })
            : []}
        </div>
      </div>

      <PreViewFile preViewFile={preViewFile} setPreViewFile={setPreViewFile} />
    </Box>
  );
};
export default Problem;
