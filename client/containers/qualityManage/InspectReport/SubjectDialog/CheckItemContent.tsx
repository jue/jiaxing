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
} from '@material-ui/core';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import { Tooltip } from 'antd';
import Clear from '../../../../components/Svgs/Clear';
import Compile from '../../../../components/Svgs/Compile';
import CheckContentDialog from '../CheckContentDialog';
import { InspectReportContext } from '../../context/InspectReportContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import NoSsr from '@material-ui/core/NoSsr';
import DehazeIcon from '@material-ui/icons/Dehaze';

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    index: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: spacing(5),
      height: spacing(5),
      borderRadius: '0 0 100% 0',
      background: palette.primary.main,
      color: '#fff',
      padding: spacing(1),
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
      marginTop: spacing(3),
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
      marginLeft: spacing(4),
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
      border: '2px solid rgba(240,242,245,1)',
      display: 'flex',
      width: 112,
      justifyContent: 'center',
      position: 'absolute',
      right: 28,
      bottom: 4,
    },
    img: {
      width: 48,
      height: 48,
      borderRadius: 4,
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
  })
);

const CheckItemContent = () => {
  const {
    inspectCheckList,
    setInspectCheckList,
    setInspectCheckItemCreated,
  } = useContext(InspectReportContext);
  const classes = useStyles({});
  const [checkContentDialog, setCheckContentDialog] = useState('');

  const [checked, setChecked] = useState({ id: '' });
  const { query } = useRouter();

  return (
    <Box width="40%" height="100%">
      <NoSsr>
        <DragDropContext
          onDragEnd={(result) => {
            const { source, destination, draggableId } = result;

            if (!destination) {
              return;
            }

            let arr = Array.from(inspectCheckList);
            const [remove] = arr.splice(source.index, 1);

            arr.splice(destination.index, 0, remove);
            setInspectCheckList(arr);
          }}
        >
          <Grid container spacing={3}>
            <Grid item md={8}>
              检查内容
            </Grid>
            <Grid item md={4}>
              {query.action !== 'view' && (
                <Button
                  color="primary"
                  variant="outlined"
                  size="small"
                  className={classes.button}
                  startIcon={<AddCircleOutline style={{ fontSize: 14 }} />}
                  onClick={() => setCheckContentDialog('created')}
                >
                  添加检查项
                </Button>
              )}

              <CheckContentDialog
                checkContentDialog={checkContentDialog}
                setCheckContentDialog={setCheckContentDialog}
              />
            </Grid>
          </Grid>

          <Droppable
            droppableId="draggableId"
            isDropDisabled={query.action !== 'view' ? false : true}
          >
            {(provided, snapshot) => (
              <div
                style={{ height: '100%', overflow: 'hidden', marginTop: 20 }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div style={{ height: '100%' }}>
                  {Boolean(inspectCheckList && inspectCheckList.length)
                    ? inspectCheckList.map((item, index) => {
                        let result = '';
                        switch (item.result) {
                          case 'pass':
                            result = '通过';
                            break;
                          case 'notPass':
                            result = '待整改';
                            break;
                          default:
                            result = '';
                        }
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
                              >
                                <Card
                                  className={classes.card}
                                  variant="outlined"
                                >
                                  <CardContent className={classes.cardContent}>
                                    <Typography className={classes.index}>{`0${
                                      index + 1
                                    }`}</Typography>
                                    <Box className={classes.box}>
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        component="p"
                                      >
                                        检查项：
                                      </Typography>

                                      <Tooltip title="扩大杭嘉湖南排八堡排水扩大杭嘉湖南排八堡排水">
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
                                      >
                                        结果：
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        component="p"
                                      >
                                        {result}
                                      </Typography>
                                    </Box>

                                    <Box className={classes.box}>
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        component="p"
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
                                      >
                                        图片：
                                      </Typography>
                                      {Boolean(
                                        item.files && item.files.length
                                      ) &&
                                        item.files.map((item) => (
                                          <Box>
                                            <div
                                              key={item._id}
                                              style={{
                                                width: 48,
                                                height: 48,
                                                marginRight: 10,
                                              }}
                                            >
                                              <img
                                                src={`/api/file/download?idFile=${item._id}`}
                                                alt=""
                                                className={classes.img}
                                              />
                                            </div>
                                          </Box>
                                        ))}
                                    </Box>

                                    {query.action !== 'view' && (
                                      <IconButton
                                        onClick={() => {
                                          setChecked({ id: index + 1 });

                                          if (checked.id == index + 1) {
                                            setChecked({ id: '' });
                                          }
                                        }}
                                        className={classes.fab}
                                        size="small"
                                      >
                                        <MoreHoriz fontSize="inherit" />
                                      </IconButton>
                                    )}

                                    {checked.id == index + 1 && (
                                      <Box className={classes.show}>
                                        <Typography
                                          variant="body2"
                                          color="textSecondary"
                                          component="div"
                                          onClick={() => {
                                            // setCheckContentDialog('update');
                                            setCheckContentDialog('edit');
                                            setInspectCheckItemCreated(item);
                                          }}
                                        >
                                          <Compile />
                                          编辑
                                        </Typography>
                                        <span style={{ margin: '0 4px' }}>
                                          |
                                        </span>
                                        <Typography
                                          variant="body2"
                                          color="textSecondary"
                                          component="div"
                                          onClick={() => {
                                            setInspectCheckList(
                                              inspectCheckList.filter(
                                                (_, _index) => _index !== index
                                              )
                                            );
                                          }}
                                        >
                                          <Clear />
                                          删除
                                        </Typography>
                                      </Box>
                                    )}
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
    </Box>
  );
};
export default CheckItemContent;
