import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Button,
  Box,
  Typography,
  Grid,
  CardContent,
  Card,
  IconButton,
  InputLabel,
} from '@material-ui/core';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import AddIcon from '@material-ui/icons/Add';
import { Tooltip, Input, Badge } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import { HiddenDangerContext } from '../../context/HiddenDangerContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import NoSsr from '@material-ui/core/NoSsr';
import DehazeIcon from '@material-ui/icons/Dehaze';
import Dropzone from '../../../../components/Dropzone/DropzoneUploadContainer';

import PreViewFile from '../../../../components/FilePreview';
import clsx from 'clsx';
import { AuthContextI, AuthContext } from '../../../../contexts/AuthContext';
import VedioImgViewFile from '../../../../components/VedioImgViewFile';
import VedioImgCreateFile from '../../../../components/VedioImgCreateFile';

const { TextArea } = Input;

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    '@global': {
      '.MuiInputBase-multiline': {
        padding: 0,
        marginTop: '0!important',
      },
    },
    root: {
      background: 'rgba(143, 195, 32, 1)!important',
    },
    closeCiycleIcon: {
      color: '#FF7474',
      width: 14,
      height: 14,
    },
    index: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: spacing(4),
      lineHeight: '32px',
      paddingLeft: 16,
      background: 'rgba(143, 195, 32, .6)',
      color: '#fff',
    },
    button: {
      height: 24,
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
      marginTop: 32,
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
      marginLeft: spacing(4),
      alignItems: 'center',
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
      display: 'flex',
      justifyContent: 'center',
      position: 'absolute',
      right: 28,
      top: 4,
      color: '#1890ff',
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
        color: '#1890ff',
      },
      '& .MuiSvgIcon-root:active': {
        color: '#1890ff',
      },
    },
    btn: {
      position: 'absolute',
      right: 4,
      top: 4,
      color: palette.primary.main,
      border: 0,
      cursor: 'pointer',
      background: 'none',
      outline: 'none',
    },
    imgList: {
      // width: '82%',
      flex: 1,
      overflow: 'hidden',
      display: 'flex',
      // height: 64,
    },
    imgHeight: {
      height: 20,
    },
    imgWrap: {
      flexWrap: 'wrap',
      overflow: 'none',
      height: 'auto',
    },
    cImgList: {
      flex: 1,
      display: 'flex',
      flexWrap: 'wrap',
    },
  })
);

const CheckItemContent = () => {
  const {
    hiddenDangerProblem,
    setHiddenDangerProblem,
    hiddenDangerSubject,
    updateProblemData,
    setUpdateProblemData,
    saveFiles,
  } = useContext(HiddenDangerContext);
  const classes = useStyles({});
  const [replay, setReplay] = useState('');
  const { query } = useRouter();
  const handleUploadCheckLists = (id, fileLIst) => {
    let newProblem = hiddenDangerProblem || [];
    let aaa =
      updateProblemData.replyFile !== undefined
        ? updateProblemData.replyFile
        : [];
    newProblem.map((val) => {
      if (val._id === id) {
        val.replyContent = updateProblemData.replyContent;
        val.replyFile = val.replyFile.concat(aaa);
      }

      setHiddenDangerProblem(newProblem);
    });

    setReplay('');
    setUpdateProblemData({});
  };
  const [show, setShow] = useState(false);
  const { account } = useContext<AuthContextI>(AuthContext);
  const [preViewFile, setPreViewFile] = useState<any>();
  const [crim, setCrim] = useState(false);
  const [isColor, setIsColor] = useState('');
  const [imgOpen, setImgOpen] = useState(false);

  return (
    <Box width="54%" height="100%" overflow="auto">
      <NoSsr>
        <DragDropContext
          onDragEnd={(result) => {
            const { source, destination, draggableId } = result;

            if (!destination) {
              return;
            }

            let arr = Array.from(hiddenDangerProblem);
            const [remove] = arr.splice(source.index, 1);

            arr.splice(destination.index, 0, remove);
            setHiddenDangerProblem(arr);
          }}
        >
          <Grid container spacing={3}>
            <Grid item md={8}>
              问题项：
            </Grid>
          </Grid>

          <Droppable
            droppableId="draggableId"
            isDropDisabled={query.action !== 'view' ? false : true}
          >
            {(provided, snapshot) => (
              <div
                style={{ height: '100%', marginTop: 20 }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div style={{ height: '100%' }}>
                  {Boolean(hiddenDangerProblem && hiddenDangerProblem.length)
                    ? hiddenDangerProblem.map((item, index) => {
                        let fileLIst: any =
                          item.replyFile && item.replyFile.length > 0
                            ? item.nodeFiles.concat(item.replyFile)
                            : item.nodeFiles;

                        return (
                          <Draggable
                            draggableId={item._id}
                            index={index}
                            key={item._id}
                          >
                            {(p) => (
                              <Box
                                key={index}
                                mr={3}
                                display="flex"
                                ref={p.innerRef}
                                {...p.draggableProps}
                                {...p.dragHandleProps}
                                // onClick={() => setIsColor(item._id)}
                              >
                                <Card
                                  className={classes.card}
                                  variant="outlined"
                                  onClick={() => setIsColor(item._id)}
                                >
                                  <CardContent className={classes.cardContent}>
                                    <Typography
                                      className={clsx(
                                        classes.index,
                                        isColor === item._id && classes.root
                                      )}
                                    >{`0${index + 1}`}</Typography>
                                    {/* <button
                                      className={classes.btn}
                                      onClick={() => {}}
                                    >
                                      查看模型锚点
                                    </button> */}
                                    <Box className={classes.box} height={24}>
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        component="p"
                                        style={{ width: 76, textAlign: 'end' }}
                                      >
                                        问题类别：
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
                                    <Box className={classes.box} height={24}>
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        component="p"
                                        style={{ width: 76, textAlign: 'end' }}
                                      >
                                        问题描述：
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        component="p"
                                      >
                                        {item.remark}
                                      </Typography>
                                    </Box>
                                    <Box
                                      // mt={
                                      //   fileLIst && fileLIst.length === 0
                                      //     ? 0
                                      //     : 1
                                      // }
                                      display="flex"
                                      position="relative"
                                    >
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        component="div"
                                        style={{ width: 108, textAlign: 'end' }}
                                      >
                                        图片：
                                      </Typography>
                                      <Box
                                        minHeight={20}
                                        style={{
                                          width: '75%',
                                          display: 'flex',
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          // marginBottom:
                                          //   fileLIst && fileLIst.length === 0
                                          //     ? 0
                                          //     : 8,
                                        }}
                                      >
                                        <div
                                          className={clsx(
                                            classes.imgList,
                                            fileLIst &&
                                              fileLIst.length === 0 &&
                                              classes.imgHeight,
                                            imgOpen && classes.imgWrap
                                          )}
                                        >
                                          {fileLIst &&
                                            fileLIst.length !== 0 &&
                                            fileLIst.map((_item, _index) => {
                                              return (
                                                <>
                                                  {_item && (
                                                    <VedioImgViewFile
                                                      list={_item}
                                                      setPreViewFile={
                                                        setPreViewFile
                                                      }
                                                      classes={classes}
                                                    />
                                                  )}
                                                </>
                                              );
                                            })}
                                        </div>
                                      </Box>
                                      {Boolean(
                                        fileLIst && fileLIst.length > 5
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
                                    </Box>

                                    {/* isColor === item._id */}
                                    {((show && item.replyContent !== '') ||
                                      !hiddenDangerSubject.isAuth ||
                                      (hiddenDangerSubject.isAuth &&
                                        item.replyContent !== '')) && (
                                      <Box
                                        className={classes.box}
                                        minHeight={26}
                                      >
                                        <Typography
                                          variant="body2"
                                          color="textSecondary"
                                          component="p"
                                          style={{
                                            width: 76,
                                            textAlign: 'end',
                                          }}
                                        >
                                          回复内容：
                                        </Typography>
                                        <Tooltip title={item.replyContent}>
                                          <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            component="p"
                                            className={classes.typography}
                                          >
                                            {item.replyContent ||
                                              updateProblemData.replyContent}
                                          </Typography>
                                        </Tooltip>
                                      </Box>
                                    )}

                                    {replay === item._id && (
                                      <>
                                        <Box
                                          className={classes.box}
                                          // height={24}
                                        >
                                          <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            component="p"
                                            style={{
                                              width: 76,
                                              textAlign: 'end',
                                            }}
                                          >
                                            回复内容：
                                          </Typography>
                                          <TextArea
                                            placeholder="请输入回复内容"
                                            autoSize={{
                                              minRows: 1,
                                              maxRows: 2,
                                            }}
                                            value={
                                              updateProblemData.replyContent
                                            }
                                            onChange={(e) => {
                                              const { value } = e.target;
                                              setUpdateProblemData({
                                                ...updateProblemData,
                                                replyContent: value,
                                              });
                                            }}
                                            style={{ width: '70%' }}
                                          />
                                        </Box>
                                        <Box display="flex" mt={1}>
                                          <div style={{ width: 108 }} />
                                          <Dropzone
                                            files={[]}
                                            setFiles={(files) => {
                                              saveFiles('replay', files, '1');
                                            }}
                                            accept="image/jpg,image/png,video/*"
                                            maxSize={10}
                                          >
                                            <Button
                                              className={classes.button}
                                              size="small"
                                              variant="outlined"
                                              color="primary"
                                              startIcon={
                                                <AddIcon
                                                  style={{ color: '#1890ff' }}
                                                />
                                              }
                                            >
                                              上传图片
                                            </Button>
                                          </Dropzone>
                                        </Box>
                                        <Box ml={13} mt={1} display="flex">
                                          {Boolean(
                                            updateProblemData &&
                                              updateProblemData.replyFile &&
                                              updateProblemData.replyFile
                                                .length > 0
                                          ) &&
                                            updateProblemData.replyFile.map(
                                              (_item) => (
                                                <VedioImgCreateFile
                                                  list={_item}
                                                  classes={classes}
                                                  info={
                                                    updateProblemData.replyFile
                                                  }
                                                  onClick={(replyFiles) =>
                                                    setUpdateProblemData({
                                                      ...updateProblemData,
                                                      replyFile: replyFiles,
                                                    })
                                                  }
                                                />
                                              )
                                            )}
                                        </Box>
                                      </>
                                    )}
                                    {/* {checked.id == index + 1 && ( */}
                                    {account.company &&
                                      hiddenDangerSubject.accountExecutor &&
                                      account.company._id ===
                                        hiddenDangerSubject.accountExecutor
                                          .company._id &&
                                      hiddenDangerSubject.isAuth && (
                                        <Box className={classes.show}>
                                          {replay === item._id ? (
                                            <Typography
                                              variant="body2"
                                              component="div"
                                              onClick={() => {
                                                handleUploadCheckLists(
                                                  item._id,
                                                  fileLIst
                                                );
                                                setShow(true);
                                              }}
                                              style={{
                                                color: '#fff',
                                                width: 32,
                                                height: '100%',
                                              }}
                                            >
                                              保存
                                            </Typography>
                                          ) : (
                                            <Typography
                                              variant="body2"
                                              component="div"
                                              onClick={() => {
                                                if (
                                                  isColor === item._id ||
                                                  item.replyContent !== ''
                                                ) {
                                                  setUpdateProblemData({
                                                    ...updateProblemData,
                                                    replyContent:
                                                      item.replyContent,
                                                  });
                                                }

                                                setReplay(item._id);
                                                setCrim(true);
                                              }}
                                              style={{
                                                color: '#fff',
                                                width: 32,
                                                height: '100%',
                                              }}
                                            >
                                              {crim &&
                                              (isColor === item._id ||
                                                item.replyContent !== '')
                                                ? '编辑'
                                                : '回复'}
                                            </Typography>
                                          )}
                                        </Box>
                                      )}
                                    {/* )} */}
                                  </CardContent>
                                </Card>
                                {query.action !== 'view' && (
                                  <Box
                                    mt={2.5}
                                    width={2}
                                    className={classes.drag}
                                  >
                                    <IconButton aria-label="up" size="small">
                                      <DehazeIcon />
                                    </IconButton>
                                  </Box>
                                )}
                              </Box>
                            )}
                          </Draggable>
                        );
                      })
                    : []}
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </NoSsr>
      <PreViewFile preViewFile={preViewFile} setPreViewFile={setPreViewFile} />
    </Box>
  );
};
export default CheckItemContent;
