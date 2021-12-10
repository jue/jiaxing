import { useContext } from 'react';

import { Button } from '@material-ui/core';
import { Box, IconButton } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import NoSsr from '@material-ui/core/NoSsr';
import DehazeIcon from '@material-ui/icons/Dehaze';

import Popover from 'antd/lib/popover';
import Progress from 'antd/lib/progress';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { useRouter } from 'next/router';
import moment from 'moment';

import { InspectPlanStatusContext } from '../context/InspectPlanStatusContext';
import { InspectPlanReqContext } from '../context/InspectPlanReqContext';
import CloseIcon from '../../../components/Svgs/CloseIcon';
import EditIcon from '../../../components/Svgs/EditIcon';

import { InspectionMethod, InspectionFrequency, InspectionType } from './enums';

const useStyles = makeStyles(() => {
  return createStyles({
    '@global': {
      '.ant-popover': {
        zIndex: 999,
      },
      '.ant-popover-inner': {
        borderRadius: '0',
        boxShadow: 'none',
      },
      '.ant-popover-inner-content': {
        padding: 0,
      },
      '.ant-popover-arrow': {
        display: 'none',
      },
    },

    inspectPlanSubjectItem: {
      display: 'flex',
      fontSize: 12,
      fontFamily: 'PingFangSC-Regular,PingFang SC',
      fontWeight: 400,
      color: '#555',
      marginBottom: 20,
    },
    subjectContent: {
      width: '98%',
      display: 'flex',
      boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.1)',
    },
    svgIcon: {
      fontSize: 12,
      opacity: 0.25,
    },
    subjectListContanier: {
      width: '40%',
      height: '100%',
      overflow: 'auto',
    },
    subjectDetail: {
      padding: 10,
      width: '100%',
      lineHeight: '20px',
      marginBottom: 11,
    },
    quarterCircle: {
      width: 40,
      height: 40,
      borderRadius: '0 0 100% 0 ',
      background: '#8FC220',
      boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.1)',
      fontSize: 14,
      fontFamily: 'PingFangSC-Medium,PingFang SC',
      fontWeight: 500,
      color: '#fff',
      lineHeight: '40px',
      textAlign: 'center',
    },
    createdButton: {
      width: 70,
      height: 26,
      borderRadius: 4,
      lineHeight: '13px',
      fontSize: 12,
      fontWeight: 400,
      padding: 0,
    },
    operating: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    operatingButton: {
      width: 56,
      height: 20,
      background: '#fff !important',
      boxShadow:
        '0px 0px 3px 0px rgba(0,0,0,0.1),0px 0px 0px 1px rgba(0,0,0,0.05)',
      borderRadius: 2,
      fontSize: 12,
      fontWeight: 400,
      lineHeight: '10px',
      padding: '0 !important',
      '& .MuiButton-label': {
        color: '#555555 ',
      },
    },
    icon: {
      marginLeft: 4,
    },
    addIcon: {
      width: 13,
      height: 13,
      marginRight: 10,
    },
    process: {
      width: '98%',
      height: 40,
      borderRadius: 4,
      padding: '10px 16px',
      boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.1)',
      margin: '14px 0 24px 0',
      fontSize: 14,
      display: 'flex',
      alignItems: 'center',
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
  });
});

const SubjectList = () => {
  const classes = useStyles({});
  const { query } = useRouter();
  const action = query.action;
  const {
    inspectPlanSubjectList,
    setInspectPlanSubjectList,
    setSubjectDeleteDialog,
    queryTaskStatus,
    handleUpdateSubjects,
    setInspectCreatedPlanSubject,
    dragList,
  } = useContext(InspectPlanReqContext);
  const { setCreatedSubjectDialog } = useContext(InspectPlanStatusContext);
  const delayCount = queryTaskStatus.delayCount;
  return (
    <NoSsr>
      <DragDropContext
        onDragEnd={(result) => {
          const { source, destination, draggableId } = result;
          let newIndex = destination && destination.index;
          let oldIndex = source.index;

          let pos: number = Math.pow(2, 14);
          const subjectList = inspectPlanSubjectList;

          const subjectListLength = inspectPlanSubjectList.length;
          if (!destination) {
            return;
          }

          let arr = Array.from(inspectPlanSubjectList);
          const [remove] = arr.splice(source.index, 1);

          if (newIndex === 0 && oldIndex > 0) {
            remove.pos = subjectList[0].pos / 2;
          } else if (subjectListLength - 1 === newIndex && newIndex >= 0) {
            remove.pos = subjectList[newIndex].pos * subjectListLength + pos;
          } else if (oldIndex === 0 && newIndex > 0) {
            remove.pos =
              (subjectList[newIndex + 1].pos + subjectList[oldIndex + 1].pos) /
              2;
          } else if (subjectListLength - 1 === oldIndex && newIndex > 0) {
            const endIndex = newIndex - 1;
            remove.pos =
              (subjectList[endIndex].pos + subjectList[endIndex + 1].pos) / 2;
          } else {
            remove.pos =
              (subjectList[newIndex - 1].pos + subjectList[newIndex + 1].pos) /
              2;
          }

          if (action === 'edit') {
            handleUpdateSubjects(remove);
          }

          arr.splice(destination.index, 0, remove);
          setInspectPlanSubjectList(arr);
        }}
      >
        <div
          style={{
            padding: '0 6px',
          }}
        >
          {action !== 'create' && (
            <div className={classes.process}>
              <span>任务进度：</span>

              <Progress
                percent={queryTaskStatus.progressAvg}
                strokeColor="#8FC220"
                trailColor="rgba(0,0,0,0.15)"
                style={{ width: delayCount !== 0 ? '63%' : '87%' }}
              />
              {delayCount !== 0 && (
                <span
                  style={{ color: '#FF3B30', fontSize: 12, marginLeft: 10 }}
                >
                  *{delayCount}个检查主题已超期
                </span>
              )}
            </div>
          )}
          <Droppable
            droppableId="draggableId"
            isDropDisabled={action !== 'view' ? false : true}
          >
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {inspectPlanSubjectList &&
                  inspectPlanSubjectList.map((item, index) => {
                    {
                      provided.placeholder;
                    }

                    return (
                      <Draggable
                        draggableId={item._id}
                        index={index}
                        key={item._id}
                      >
                        {(p) => (
                          <div
                            key={item._id}
                            className={classes.inspectPlanSubjectItem}
                            ref={p.innerRef}
                            {...p.draggableProps}
                            {...p.dragHandleProps}
                          >
                            <div className={classes.subjectContent}>
                              <div className={classes.quarterCircle}>
                                {index < 9 ? `0${index + 1}` : index + 1}
                              </div>
                              <div className={classes.subjectDetail}>
                                <div>
                                  <label>检查主题：</label>
                                  {item.name}
                                </div>

                                <div>
                                  <label>检查时间：</label>
                                  {moment(item.startTime).format('YYYY-MM-DD')}-
                                  {moment(item.endTime).format('YYYY-MM-DD')}
                                </div>
                                <div>
                                  <label>检查方式：</label>
                                  {InspectionMethod[item.method]}
                                </div>
                                <div>
                                  <label>检查类型：</label>
                                  {InspectionType[item.type]}
                                </div>
                                <div>
                                  <label>检查频率：</label>
                                  {InspectionFrequency[item.frequency]}
                                </div>
                                <div className={classes.operating}>
                                  <div>
                                    <label>分配对象：</label>
                                    {item.allocateObjects}
                                  </div>
                                  {action !== 'view' && (
                                    <Popover
                                      placement="leftBottom"
                                      title=""
                                      content={
                                        <>
                                          {action === 'create' && (
                                            <Button
                                              onClick={() => {
                                                setCreatedSubjectDialog('edit');
                                                setInspectCreatedPlanSubject(
                                                  item
                                                );
                                              }}
                                              className={
                                                classes.operatingButton
                                              }
                                            >
                                              <EditIcon />
                                              <span className={classes.icon}>
                                                编辑
                                              </span>
                                            </Button>
                                          )}

                                          <Button
                                            onClick={() => {
                                              setSubjectDeleteDialog(item._id);
                                            }}
                                            className={classes.operatingButton}
                                          >
                                            <CloseIcon />
                                            <span className={classes.icon}>
                                              删除
                                            </span>
                                          </Button>
                                        </>
                                      }
                                      trigger="click"
                                    >
                                      <div
                                        style={{
                                          opacity: 0.19,
                                          cursor: 'pointer',
                                        }}
                                      >
                                        ...
                                      </div>
                                    </Popover>
                                  )}
                                </div>
                              </div>
                            </div>
                            {action !== 'view' && (
                              <Box
                                mt={2.5}
                                width={2}
                                className={classes.drag}
                                style={{ marginTop: 0 }}
                              >
                                <IconButton aria-label="up" size="small">
                                  <DehazeIcon />
                                </IconButton>
                              </Box>
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </NoSsr>
  );
};

export default SubjectList;
