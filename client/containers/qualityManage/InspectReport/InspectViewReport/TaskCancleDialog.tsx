import { useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { InspectPlanStatusContext } from '../../context/InspectPlanStatusContext';
import { InspectReportContext } from '../../context/InspectReportContext';

import AntdDialog from '../../../../components/AntdDialog';

const useStyles = makeStyles(() => {
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
  });
});

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const TaskCancleDialog = ({
  openCancleTasktDialog,
  setOpenCancleTasktDialog,
}) => {
  const classes = useStyles({});
  const router = useRouter();
  const { _id } = router.query as { _id: string };

  const { inspectTaskInfos, getTaskList } = useContext(InspectReportContext);

  const { setRectificationDialog } = useContext(InspectPlanStatusContext);

  const [open, setOpen] = useState(false);

  const handleCancle = () => {
    setOpenCancleTasktDialog(false);
  };
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  return (
    <>
      <AntdDialog
        visible={Boolean(openCancleTasktDialog)}
        hasClose={false}
        dialogTitle={<p className={classes.title}>您确定要取消该任务吗？</p>}
        hasFooter={false}
        onClose={() => handleCancle()}
        onConfirm
        width={376}
      >
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
            onClick={() => {
              handleCancle();
              getTaskList(_id);
              if (inspectTaskInfos.status !== 'todo') {
                handleCancle();
                setOpen(true);
              } else {
                handleCancle();
                setRectificationDialog('view');
              }
            }}
          >
            确认
          </Button>
        </Grid>
      </AntdDialog>

      <Snackbar open={open} autoHideDuration={600} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          任务已经开始！
        </Alert>
      </Snackbar>
    </>
  );
};
export default TaskCancleDialog;
