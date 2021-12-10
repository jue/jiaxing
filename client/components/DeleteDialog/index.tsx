import AntdDialog from '../AntdDialog';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    action: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    cancel: {
      outline: 'none',
      width: 65,
      height: 32,
      background: '#fff',
      color: 'rgba(0,0,0,0.65)',
      borderRadius: 4,
      cursor: 'pointer',
      border: '1px solid #D9D9D9',
      marginRight: 8,
    },
    confirm: {
      outline: 'none',
      width: 65,
      height: 32,
      border: 0,
      background: ' linear-gradient(to right, #2E9BFF, #1ECFF7)',
      color: '#fff',
      borderRadius: 4,
      cursor: 'pointer',
    },
    title: {
      display: 'flex',
    },
    titleInner: {
      fontSize: 16,
      color: '#000',
      fontWeight: 500,
    },
    msg: {
      width: 22,
      height: 22,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '100%',
      background: '#FAAD14',
      color: '#fff',
      fontWeight: 500,
      marginRight: 16,
    },
    content: {
      fontSize: 14,
      color: 'rgba(0,0,0,0.65)',
      margin: '12px 0 46px 36px',
    },
  });
});

const DeleteDialog = ({ open, closeDialog, onConfrim, title }) => {
  const classes = useStyles({});

  return (
    <AntdDialog
      visible={open}
      onClose={closeDialog}
      hasClose={false}
      dialogTitle=""
      hasFooter={false}
      onConfirm={() => {
        closeDialog();
      }}
      width={430}
    >
      <div>
        <div className={classes.title}>
          <div className={classes.msg}>?</div>
          <Typography className={classes.titleInner}>
            确认要删除该{title}吗？
          </Typography>
        </div>
        <Typography className={classes.content}>
          删除后该{title}将会从您的列表中消失哦~
        </Typography>
      </div>

      <div className={classes.action}>
        <button className={classes.cancel} onClick={() => closeDialog()}>
          取消
        </button>
        <button
          className={classes.confirm}
          onClick={() => {
            onConfrim();
            closeDialog();
          }}
        >
          确定
        </button>
      </div>
    </AntdDialog>
  );
};

export default DeleteDialog;
