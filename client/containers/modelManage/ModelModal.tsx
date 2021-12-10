import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export function ModelModal(msg, id?, func?) {
  Modal.confirm({
    icon: <ExclamationCircleOutlined />,
    content: msg,
    okText: '确定',
    cancelText: '取消',
    centered: true,
    okButtonProps: {
      style: {
        backgroundColor: '#8FC320',
        width: 65,
        height: 32,
        borderColor: '#8FC320',
      },
    },
    cancelButtonProps: {
      style: {
        width: 65,
        height: 32,
        borderColor: '#8FC320',
        color: '#8FC320',
      },
    },
    onOk: () => {
      if (id && func) {
        func(id);
      }
    },
  });
}

export function ModelRemindModal(msg) {
  Modal.warning({
    icon: <ExclamationCircleOutlined />,
    content: msg,
    okText: '确定',
    centered: true,
    okButtonProps: {
      style: {
        backgroundColor: '#8FC320',
        width: 65,
        height: 32,
        borderColor: '#8FC320',
      },
    },
  });
}
