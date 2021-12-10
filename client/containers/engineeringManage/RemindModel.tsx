import { Modal, Button } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';

function Remind(title, content) {
  Modal.info({
    title: title,
    centered: true,
    content: content,
    icon: <CloseCircleFilled style={{ color: '#F5222D' }} />,
    okText: '确定',
    onOk() {},
  });
}
export default Remind;
