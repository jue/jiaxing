import { Modal } from 'antd';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => {
  return createStyles({
    closeIcon: {
      // display: 'flex',
      // justifyContent: 'flex-end',
      color: '#9B9B9B',
      cursor: 'pointer',
      position: 'absolute',
      top: 16,
      right: 16,
    },
    bottom: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 54,
    },
    cancelConfirm: {
      color: '#000000 !important',
      boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.1)',
      width: 88,
      height: 34,
      border: 0,
      background: '#fff',
      marginRight: 60,
      cursor: 'pointer',
      outline: 'none',
    },
    confirmBotton: {
      width: 88,
      height: 34,
    },
    '@global': {
      '.ant-modal': {
        position: 'static',
        top: 0,
        margin: 0,
      },
      '.ant-modal-wrap': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      '.ant-modal-content': {
        borderRadius: 4,
      },
      '.ant-modal-body': {
        padding: '26px 32px',
      },
    },
  });
});

const AntdDialog = ({
  visible, // 是否open弹窗
  onClose, // 点击关闭弹窗
  hasClose, // 是否有关闭x按钮
  dialogTitle, // 标题
  children,
  hasFooter, // 是否有底部确定取消按钮
  onConfirm, // 点击确定按钮
  width,
  height = 'auto',
}) => {
  const classes = useStyles({});

  return (
    <Modal visible={visible} closable={false} footer={null} width={width}>
      {hasClose && (
        <div className={classes.closeIcon} onClick={() => onClose()}>
          <CloseIcon />
        </div>
      )}

      {dialogTitle && dialogTitle}

      {children}

      {hasFooter && (
        <div className={classes.bottom}>
          <button className={classes.cancelConfirm} onClick={() => onClose()}>
            取消
          </button>
          <Button
            color="primary"
            variant="contained"
            className={classes.confirmBotton}
            onClick={onConfirm}
          >
            确定
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default AntdDialog;
