import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Box } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    buttonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 20,
      '& button': { width: 64, height: 30 },
      '& .MuiButton-label': {
        fontSize: 14,
        fontWeight: 400,
      },
    },
    cancleButton: {
      marginRight: spacing(4),
      '& .MuiButton-label': {
        color: 'rgba(0,0,0,0.3)',
      },
    },
  })
);

function ProblemDeleteModal({ visible, setVisible, deleteProblem }) {
  const classes = useStyles({});

  return (
    <Modal visible={visible} footer={null}>
      <p>
        <ExclamationCircleOutlined
          style={{ color: '#faad14', marginRight: 15 }}
        />
        确定删除吗？
      </p>
      <Box className={classes.buttonGroup}>
        <Button
          variant="outlined"
          className={classes.cancleButton}
          onClick={setVisible}
        >
          取消
        </Button>
        <Button variant="contained" color="primary" onClick={deleteProblem}>
          确定
        </Button>
      </Box>
    </Modal>
  );
}

export default ProblemDeleteModal;
