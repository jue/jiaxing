import { useContext } from 'react';
import { useRouter } from 'next/router';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { InspectPlanStatusContext } from '../../context/InspectPlanStatusContext';
import Grid from '@material-ui/core/Grid';
import { InspectReportContext } from '../../context/InspectReportContext';
import AntdDialog from '../../../../components/AntdDialog';
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from '@material-ui/core';

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
  });
});

const TaskLevelDialog = ({ openTaskLevel, setTaskOpenLevel }) => {
  const { account } = useContext<AuthContextI>(AuthContext);

  const { inspectTaskInfos, setInspectTaskInfos, getTaskList } = useContext(
    InspectReportContext
  );

  const router = useRouter();

  const reportId = router.query._id;

  const classes = useStyles({});
  const handleCancle = () => {
    setTaskOpenLevel(false);
  };
  return (
    <AntdDialog
      visible={Boolean(openTaskLevel)}
      hasClose={true}
      dialogTitle={<p className={classes.title}>优先级设置</p>}
      hasFooter={false}
      onClose={() => handleCancle()}
      onConfirm
      width={820}
    >
      <Box ml={10}>
        <FormLabel
          component="legend"
          style={{ width: 95, lineHeight: '42px', fontSize: 14 }}
        >
          优先级设置
        </FormLabel>
        <RadioGroup
          row
          aria-label="position"
          className={classes.radioGroup}
          name="position"
          value={inspectTaskInfos.level || ''}
          onChange={(e) => {
            const { value } = e.target;

            setInspectTaskInfos({
              ...inspectTaskInfos,
              level: value,
            });
          }}
        >
          <FormControlLabel
            value="common"
            control={<Radio color="primary" />}
            label="普通"
          />
          <FormControlLabel
            value="important"
            control={<Radio color="primary" />}
            label="重要"
          />
          <FormControlLabel
            value="emergency"
            control={<Radio color="primary" />}
            label="紧急"
          />
        </RadioGroup>
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
            let levelI = '';
            switch (inspectTaskInfos.level) {
              case 'common':
                levelI = '普通';
                break;
              case 'important':
                levelI = '重要';
                break;
              case 'emergency':
                levelI = '紧急';
                break;
              default:
            }
            const taskContent = {
              userId: account._id,
              userName: account.userName,
              atCreated: new Date(),
              content: `设置整改等级为${levelI}`,
            };
            await inspectTaskSvc.update({
              _id: inspectTaskInfos._id,
              level: inspectTaskInfos.level,
              content: taskContent,
            });
            handleCancle();
            getTaskList(reportId);
          }}
        >
          确认
        </Button>
      </Grid>
    </AntdDialog>
  );
};
export default TaskLevelDialog;
