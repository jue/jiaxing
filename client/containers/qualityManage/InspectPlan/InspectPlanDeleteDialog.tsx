import { useContext } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { InspectPlanStatusContext } from '../context/InspectPlanStatusContext';
import Grid from '@material-ui/core/Grid';
import { InspectPlanReqContext } from '../context/InspectPlanReqContext';
import AntdDialog from '../../../components/AntdDialog';
import Button from '@material-ui/core/Button';

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

export const InspectPlanDeleteDialog = () => {
  const { openDeletePlanDialog, setOpenDeletaPlanDialog } = useContext(
    InspectPlanStatusContext
  );
  const { handleInspectPlanDelete } = useContext(InspectPlanReqContext);

  const classes = useStyles({});
  const handleCancle = () => {
    setOpenDeletaPlanDialog('');
  };
  return (
    <AntdDialog
      visible={Boolean(openDeletePlanDialog)}
      hasClose={false}
      dialogTitle={<p className={classes.title}>您确定要删除该检查计划吗？</p>}
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
            handleInspectPlanDelete(openDeletePlanDialog);
          }}
        >
          确认
        </Button>
      </Grid>
    </AntdDialog>
  );
};
