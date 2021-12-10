import React, { useContext, useEffect } from 'react';
import { LayoutPageContext } from '../layout/context/LayoutPageContext';
import { withRouter } from 'next/router';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ModelManageContextProvider, {
  ModelManageContext,
} from './context/ModelManageContext';
import Button from '@material-ui/core/Button';
import ModelUploadFile from './ModelUploadFile';
import ModelEntryInformation from './ModelEntryInformation';
import { ModelRemindModal } from './ModelModal';

const useStyles = makeStyles(() => {
  return createStyles({
    modelUpload: {
      height: '85%',
      margin: '58px 38px',
    },
  });
});

function ModelUpload() {
  const classes = useStyles({});
  const { handleCreateModelInfo, createModelInfo, disabled } = useContext(
    ModelManageContext
  );

  return (
    <div className={classes.modelUpload}>
      <ModelEntryInformation />
      <ModelUploadFile />
      <Button
        color="primary"
        variant="contained"
        style={{ float: 'right' }}
        disabled={disabled}
        onClick={() => {
          if (!Boolean(createModelInfo.idEngineering)) {
            ModelRemindModal('请选择工程名称');
            return;
          }
          if (!Boolean(createModelInfo.idContract)) {
            ModelRemindModal('请选择合同名称');
            return;
          }
          if (!Boolean(createModelInfo.name)) {
            ModelRemindModal('请选择或输入模型名称');
            return;
          }
          if (!Boolean(createModelInfo.version)) {
            ModelRemindModal('请输入版本号');
            return;
          }
          if (!Boolean(createModelInfo.files._id)) {
            ModelRemindModal('请上传文件');
            return;
          }
          handleCreateModelInfo();
        }}
      >
        确定上传
      </Button>
    </div>
  );
}

export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);

  useEffect(() => {
    setParts(['模型管理', '模型上传']);
  }, [router.query]);

  return (
    <ModelManageContextProvider>
      <ModelUpload />
    </ModelManageContextProvider>
  );
});
