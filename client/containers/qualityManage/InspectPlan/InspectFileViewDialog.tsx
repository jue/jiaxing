import { useContext } from 'react';
import { InspectPlanStatusContext } from '../context/InspectPlanStatusContext';
import AntdDialog from '../../../components/AntdDialog';

export const InspectFileViewDialog = () => {
  const { openFileViewDialog, setOpenFileViewDialog } = useContext(
    InspectPlanStatusContext
  );

  const handleCancle = () => {
    setOpenFileViewDialog('');
  };

  return (
    <AntdDialog
      visible={Boolean(openFileViewDialog)}
      hasClose={true}
      dialogTitle="文件预览"
      hasFooter={false}
      onClose={() => handleCancle()}
      onConfirm
      width={820}
    >
      <iframe
        src={`/api/file/download?idFile=${openFileViewDialog}`}
        frameBorder="0"
        width="100%"
        height="100%"
      />
    </AntdDialog>
  );
};
