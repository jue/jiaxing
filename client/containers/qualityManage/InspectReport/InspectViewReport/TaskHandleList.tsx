import { useState, useContext, useEffect } from 'react';
import moment from 'moment';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { InspectReportContext } from '../../context/InspectReportContext';
import Dropzone from '../../../../components/Dropzone/DropzoneUploadContainer';
import { DialogueContent } from '../../../../../typings/quality_inspect_task';
import inspectTaskSvc from '../../../../services/InspectTaskSvc';
import FileIcon from '../../../../components/Svgs/FileIcon';
import TaskLevelDialog from './TaskLevelDialog';
import TaskProgressDialog from './TaskProgressDialog';
import { AuthContext, AuthContextI } from '../../../../contexts/AuthContext';
import TaskCancleDialog from './TaskCancleDialog';
import TaskAcceptanceDialog from './TaskAcceptanceDialog';
import TaskAddPersonDialog from './TaskAddPersonDialog';
import {
  Box,
  Button,
  Paper,
  Divider,
  TextField,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { OrganizationContext } from '../../context/OrganizationContext';

const useStyles = makeStyles(({ palette, spacing }) => {
  return createStyles({
    title: {
      fontSize: 24,
      fontFamily: 'PingFangSC-Medium,PingFang SC',
      fontWeight: 500,
      color: 'rgba(0,0,0,0.8)',
      lineHeight: '22px',
      textAlign: 'center',
    },
    paper: {
      padding: spacing(2.5, 2),
      height: '89%',
      '& .MuiInput-underline:before': {
        border: 'none',
      },
      // '& .MuiInput-underline:after': {
      //   border: 'none',
      // },
    },
    date: {
      color: 'rgba(155,155,155,1)',
      fontSize: 10,
    },
    content: {
      color: 'rgba(85,85,85,1)',
      marginBottom: spacing(2.5),
    },
    divider: {
      margin: '32px -16px 0',
    },
    send: {
      '& .MuiButton-label': {
        color: 'rgba(85,85,85,1)',
        fontSize: 12,
      },
    },
    textField: {
      width: '100%',
      border: 'none',
    },
    button: {
      height: 26,
      width: 80,
      padding: 0,
      '& .MuiButton-label': {
        color: '#8FC220',
        fontWeight: 400,
        fontSize: 12,
      },
      background: 'rgba(143,194,32,0.1)',
      marginRight: 20,
    },
  });
});

const TaskHandleList = () => {
  const { account } = useContext<AuthContextI>(AuthContext);

  const {
    inspectTaskInfos,
    inspectReportCreated,
    getTaskList,
    saveFiles,
  } = useContext(InspectReportContext);

  const classes = useStyles({});

  const [openTaskLevel, setTaskOpenLevel] = useState(false);
  const [openTaskProgress, setTaskOpenProgress] = useState(false);
  const [openCancleTasktDialog, setOpenCancleTasktDialog] = useState(false);
  const [openAcceptanceDialog, setOpenAcceptanceDialog] = useState('');
  const [openAddPerson, setOpenAddPerson] = useState(false);

  const [taskInfo, setTaskInfo] = useState<DialogueContent>({
    userId: '',
    userName: '',
    atCreated: null,
    content: '',
  });

  return (
    // <OrganizationContextProvider>
    <Box width="40%">
      <Box mb={2.5}>
        {account.company && account.company.type === 'constructionUnit' && (
          <>
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              size="small"
              onClick={() => setTaskOpenLevel(true)}
            >
              优先级设置
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              size="small"
              onClick={() => setTaskOpenProgress(true)}
            >
              进度反馈
            </Button>
          </>
        )}

        {account.company && account.company.type === 'buildingUnit' && (
          <>
            {inspectReportCreated.state === 'normal' && (
              // inspectTaskInfos.status === 'todo' &&
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  size="small"
                  onClick={() => setOpenCancleTasktDialog(true)}
                >
                  取消任务
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  size="small"
                  onClick={() => {
                    setOpenAddPerson(true);
                  }}
                >
                  添加参与人
                </Button>
              </>
            )}

            {inspectReportCreated.state === 'acceptance' && (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  size="small"
                  onClick={() => setOpenAcceptanceDialog('验收通过')}
                >
                  验收通过
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  size="small"
                  onClick={() => setOpenAcceptanceDialog('验收不通过')}
                >
                  验收不通过
                </Button>
              </>
            )}
          </>
        )}
      </Box>
      <Paper className={classes.paper}>
        <div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ height: 375, overflow: 'auto' }}>
              <div style={{ height: '100%' }}>
                {inspectTaskInfos.content &&
                  inspectTaskInfos.content.map((item, key) => {
                    return (
                      <Box key={key}>
                        <Box>
                          {account._id !== item.userId &&
                            account.userName !== item.userName && (
                              <Box>
                                <div className={classes.date}>
                                  <span
                                    style={{
                                      color: '#555555',
                                      marginRight: 4,
                                      fontSize: 14,
                                    }}
                                  >
                                    {item.userName}
                                  </span>

                                  <span style={{ fontSize: 12 }}>
                                    {moment(item.atCreated).format(
                                      'YYYY-MM-DD'
                                    )}
                                  </span>
                                </div>
                                <div className={classes.content}>
                                  {item.content}
                                </div>
                              </Box>
                            )}
                        </Box>

                        <Box>
                          {account._id === item.userId &&
                            account.userName === item.userName && (
                              <Box
                                flex="1"
                                display="flex"
                                flexDirection="column"
                                alignItems="flex-end"
                              >
                                <div className={classes.date}>
                                  <span style={{ fontSize: 12 }}>
                                    {moment(item.atCreated).format(
                                      'YYYY-MM-DD'
                                    )}
                                  </span>
                                  <span
                                    style={{
                                      color: '#555555',
                                      marginLeft: 4,
                                      fontSize: 14,
                                    }}
                                  >
                                    {item.userName}
                                  </span>
                                </div>
                                <div className={classes.content}>
                                  {item.content}
                                </div>
                              </Box>
                            )}
                        </Box>
                      </Box>
                    );
                  })}
              </div>
            </div>
            <Divider className={classes.divider} />
            <Box mt={2}>
              <Tooltip title="上传文件" placement="bottom-end">
                <Dropzone
                  files={[]}
                  setFiles={(files) => {
                    saveFiles('task', files);
                  }}
                  accept=".rvt,.nwd, .png, .jpg, .jpeg, .docx, .txt, .md, .xlsx, .pdf"
                  maxSize={10}
                >
                  <IconButton style={{ padding: 0 }}>
                    <FileIcon />
                  </IconButton>
                </Dropzone>
              </Tooltip>

              <Box flex="1" my={1}>
                <TextField
                  id="outlined-multiline-static"
                  placeholder="请输入任务消息..."
                  multiline
                  rows={1}
                  value={taskInfo.content || ''}
                  onChange={(e) => {
                    setTaskInfo({
                      ...taskInfo,
                      content: e.target.value,
                    });
                  }}
                  className={classes.textField}
                />
              </Box>
              <Box display="flex" flexDirection="column" alignItems="flex-end">
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.send}
                  size="small"
                  onClick={async () => {
                    await inspectTaskSvc.update({
                      _id: inspectTaskInfos._id,
                      content: {
                        ...taskInfo,
                        userId: account._id,
                        userName: account.userName,
                        atCreated: new Date(),
                      },
                    });
                    getTaskList(inspectTaskInfos.idReport);

                    setTaskInfo({
                      ...taskInfo,
                      content: '',
                    });
                  }}
                >
                  发送
                </Button>
              </Box>
            </Box>
          </div>
        </div>
      </Paper>

      <TaskAcceptanceDialog
        openAcceptanceDialog={openAcceptanceDialog}
        setOpenAcceptanceDialog={setOpenAcceptanceDialog}
      />

      <TaskCancleDialog
        openCancleTasktDialog={openCancleTasktDialog}
        setOpenCancleTasktDialog={setOpenCancleTasktDialog}
      />
      <TaskAddPersonDialog
        openAddPerson={openAddPerson}
        setOpenAddPerson={setOpenAddPerson}
      />
      <TaskLevelDialog
        openTaskLevel={openTaskLevel}
        setTaskOpenLevel={setTaskOpenLevel}
      />
      <TaskProgressDialog
        openTaskProgress={openTaskProgress}
        setTaskOpenProgress={setTaskOpenProgress}
      />
    </Box>
    // </OrganizationContextProvider>
  );
};
export default TaskHandleList;
