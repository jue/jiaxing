import { Progress, Modal } from 'antd';

function FileTypeModal(fileTypeModal, setFileTypeModal) {
  return (
    <Modal
      className="dialog"
      visible={Boolean(fileTypeModal)}
      onCancel={() => setFileTypeModal(false)}
      style={{ top: '20%' }}
      width="50%"
      destroyOnClose
    >
      不支持该文件格式上传，请选择其他格式
    </Modal>
  );
}

export default FileTypeModal;
