import { Modal, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    modelContanier: {
      '& .ant-modal-content': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        WebkitBoxShadow: 'none',
      },
    },
  })
);

function LoadingDialog({ visible, copyWriting }) {
  const classes = useStyles({});
  return (
    <Modal
      visible={visible}
      closable={false}
      footer={null}
      centered
      className={classes.modelContanier}
    >
      <div style={{ textAlign: 'center' }}>
        <Spin indicator={<LoadingOutlined />} style={{ color: '#fff' }}></Spin>
      </div>
    </Modal>
  );
}

export default LoadingDialog;
