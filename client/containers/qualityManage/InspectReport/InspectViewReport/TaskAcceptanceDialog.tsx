import { useContext, useEffect } from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Box, FormControl, InputLabel } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';

import { InspectReportContext } from '../../context/InspectReportContext';
import { AuthContext, AuthContextI } from '../../../../contexts/AuthContext';

import AntdDialog from '../../../../components/AntdDialog';

import inspectTaskSvc from '../../../../services/InspectTaskSvc';

import { OutlineInput } from '../../../../styles/resetStyles';

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
    formControl: {
      width: '100%',
      // margin: spacing(9, 0),
    },
  });
});

const TaskAcceptanceDialog = ({
  openAcceptanceDialog,
  setOpenAcceptanceDialog,
}) => {
  const classes = useStyles({});
  const {
    inspectReportCreated,
    setInspectReportCreated,
    inspectReportEdit,
    setInspectReportEdit,
    handleUpdateReport,
    inspectTaskInfos,
    getTaskList,
  } = useContext(InspectReportContext);
  const handleCancle = () => {
    setOpenAcceptanceDialog('');
  };
  useEffect(() => {
    if (openAcceptanceDialog === '验收通过') {
      setInspectReportEdit({
        ...inspectReportEdit,
        state: 'passed',
        acceptResult: 'pass',
      });
    } else {
      setInspectReportEdit({
        ...inspectReportEdit,
        state: 'normal',
        acceptResult: 'nopass',
      });
    }
  }, [openAcceptanceDialog]);
  const { account } = useContext<AuthContextI>(AuthContext);

  return (
    <AntdDialog
      visible={Boolean(openAcceptanceDialog)}
      hasClose={false}
      dialogTitle={<p className={classes.title}>{openAcceptanceDialog}</p>}
      hasFooter={false}
      onClose={() => handleCancle()}
      onConfirm
      width={800}
    >
      {openAcceptanceDialog === '验收通过' && (
        <Box display="flex">
          <Typography variant="body1">验收评价:</Typography>
          <Rating
            name="simple-controlled"
            value={Number(inspectReportCreated.acceptEvaluation) || null}
            onChange={(event, newValue) => {
              setInspectReportCreated({
                ...inspectReportCreated,
                acceptEvaluation: newValue,
              });
              setInspectReportEdit({
                ...inspectReportEdit,
                acceptEvaluation: newValue,
              });
            }}
          />
        </Box>
      )}

      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="inspection-desc">
          {openAcceptanceDialog === '验收不通过' ? '验收意见' : ''}
        </InputLabel>
        <OutlineInput
          id="nspection-desc"
          value={inspectReportCreated.acceptOpinion || ''}
          placeholder="请输入..."
          multiline
          onChange={(e) => {
            const { value } = e.target;
            setInspectReportCreated({
              ...inspectReportCreated,
              acceptOpinion: value,
            });
            setInspectReportEdit({
              ...inspectReportEdit,
              acceptOpinion: value,
            });
          }}
        />
      </FormControl>

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
            const result =
              openAcceptanceDialog === '验收通过'
                ? `反馈整改任务为验收通过`
                : `反馈整改任务为验收不通过`;
            const taskContent = {
              userId: account._id,
              userName: account.userName,
              atCreated: new Date(),
              content: result,
            };
            handleCancle();
            handleUpdateReport();

            await inspectTaskSvc.update({
              _id: inspectTaskInfos._id,
              content: taskContent,
            });
            getTaskList(inspectReportCreated._id);
            setInspectReportEdit({});
          }}
        >
          确认
        </Button>
      </Grid>
    </AntdDialog>
  );
};
export default TaskAcceptanceDialog;
