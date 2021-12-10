import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { InspectReportContext } from '../../context/InspectReportContext';
import AntdDialog from '../../../../components/AntdDialog';
import { Box, Typography, Button, Slider } from '@material-ui/core';

import inspectTaskSvc from '../../../../services/InspectTaskSvc';
import { AuthContext, AuthContextI } from '../../../../contexts/AuthContext';

const useStyles = makeStyles(({ spacing }) => {
  return createStyles({
    title: {
      fontSize: 16,
      fontFamily: 'PingFangSC-Medium,PingFang SC',
      fontWeight: 500,
      color: 'rgba(0,0,0,0.8)',
      lineHeight: '22px',
      textAlign: 'center',
      marginBottom: 36,
    },
    buttonGroup: {
      textAlign: 'center',
      '& button': {
        width: 88,
        height: 34,
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.1)',
      },
      '& button:nth-of-type(1)': {
        marginRight: 60,
        '& .MuiButton-label': {
          fontWeight: 400,
          color: 'rgba(0,0,0,0.3)',
        },
      },
    },
    radioGroup: {
      justifyContent: 'space-between',
      marginBottom: spacing(9),
    },
    typography: {
      lineHeight: '42px',
    },
    progress: {
      width: 120,
      height: 6,
      background: 'rgba(245,245,245,1)',
      borderRadius: 8,
    },
    slider: {
      height: 12,
      display: 'block',
    },
  });
});

const ProgressSlider = withStyles({
  root: {
    color: '#8FC220',
    height: 8,
    flex: 1,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
    background: 'rgba(221,221,221,1)',
  },
})(Slider);
const TaskProgressDialog = ({ openTaskProgress, setTaskOpenProgress }) => {
  const {
    inspectTaskInfos,
    setInspectTaskInfos,
    getTaskList,
    handleUpdateReport,
    inspectReportEdit,
    setInspectReportEdit,
  } = useContext(InspectReportContext);
  const classes = useStyles({});

  const handleCancle = () => {
    setTaskOpenProgress(false);
  };
  const router = useRouter();

  const reportId = router.query._id;
  const { account } = useContext<AuthContextI>(AuthContext);
  useEffect(() => {
    if (inspectTaskInfos.progress === 100) {
      setInspectReportEdit({
        ...inspectReportEdit,
        state: 'acceptance',
      });
    }
  }, [inspectTaskInfos.progress]);
  return (
    <AntdDialog
      visible={Boolean(openTaskProgress)}
      hasClose={true}
      dialogTitle={<p className={classes.title}>优先级设置</p>}
      hasFooter={false}
      onClose={() => handleCancle()}
      onConfirm
      width={800}
    >
      <Box mx={15}>
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.typography}
        >
          进度
        </Typography>

        <Box display="flex" alignItems="center" mb={10}>
          <ProgressSlider
            valueLabelDisplay="auto"
            aria-label="pretto slider"
            value={inspectTaskInfos.progress}
            onChange={(e, value) => {
              setInspectTaskInfos({
                ...inspectTaskInfos,
                progress: value,
              });
            }}
          />
          <Box width={40} ml={2.5}>
            {`${inspectTaskInfos.progress}%`}
          </Box>
        </Box>
      </Box>
      <Grid className={classes.buttonGroup}>
        <Button
          onClick={() => {
            handleCancle();
          }}
        >
          取消
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={async () => {
            const taskContent = {
              userId: account._id,
              userName: account.userName,
              atCreated: new Date(),
              content: `反馈了最新进度${inspectTaskInfos.progress}%`,
            };

            await inspectTaskSvc.update({
              _id: inspectTaskInfos._id,
              progress: inspectTaskInfos.progress,
              content: taskContent,
              status:
                inspectTaskInfos.progress === 100
                  ? 'done'
                  : inspectTaskInfos.progress === 0
                  ? 'todo'
                  : 'doing',
            });
            handleUpdateReport();
            getTaskList(reportId);
            handleCancle();
          }}
        >
          确认
        </Button>
      </Grid>
    </AntdDialog>
  );
};
export default TaskProgressDialog;
