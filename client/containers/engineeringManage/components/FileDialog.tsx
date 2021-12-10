import React, { useContext, useEffect } from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, Button } from '@material-ui/core';

import AntdDialog from '../../../components/AntdDialog';
import { EngineeringContext } from '../context/EngineeringContext';
import { UnderlineInput } from '../../../components/Input/UnderlineInput';
import Dropzone from '../../../components/Dropzone/DropzoneUploadContainer';
import FileList from './FileLists';
import modelSvc from '../../../services/modelSvc';
import ModelModal from './ModelModal';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import LoadingDialog from '../../../components/AntdDialog/LoadingDialog';

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    title: {
      fontSize: 16,
      fontFamily: 'PingFangSC-Medium,PingFang SC',
      fontWeight: 500,
      color: 'rgba(0,0,0,0.8)',
      lineHeight: '20px',
    },
    formControl: {
      width: '100%',
      marginBottom: 20,
    },
    required: {
      color: '#FF3B30',
      marginLeft: 5,
    },
    submitButton: {
      width: 92,
      height: 32,
    },
    fileContent: {
      borderBottom: '1px solid #B2B2B2',
      fontSize: 14,
      minHeight: 30,
      display: 'flex',
      flexDirection: 'row',
    },
    uploadBtn: {
      color: palette.primary.main,
      fontSize: 12,
      borderBottom: '1px dashed #8FC220',
      height: 28,
      lineHeight: '32px',
      marginTop: 8,
    },
  })
);

const FileDialog = () => {
  const classes = useStyles({});
  const {
    fileDialog,
    setFileDialog,
    createModelInfo,
    saveBImfiles,
    setCreateModelInfo,
    engineeringInfo,
    setEngineeringInfo,
    isLoading,
  } = useContext(EngineeringContext);

  const handleCreateModelInfo = () => {
    let BIMModel: any = engineeringInfo.BIMModel || [];
    let changeDrawings: any = engineeringInfo.changeDrawings || [];

    if (!createModelInfo.idEngineering) {
      ModelModal('请选择工程名称');
      return;
    }
    if (!createModelInfo.idContract) {
      ModelModal('请选择合同名称');
      return;
    }
    if (!createModelInfo.name) {
      ModelModal('请选择或输入模型名称');
      return;
    }
    if (!createModelInfo.version) {
      ModelModal('请输入版本号');
      return;
    }
    if (JSON.stringify(createModelInfo.files) === '{}') {
      ModelModal('请上传文件');
      return;
    }
    modelSvc
      .create({
        ...createModelInfo,
      })
      .then(data => {
        if (data.code === 1003) {
          ModelModal('版本已存在，请修改');
          return;
        }
        if (fileDialog === 'BIMModel') {
          BIMModel.push(data.files);
          setEngineeringInfo({
            ...engineeringInfo,
            BIMModel,
          });
        } else {
          changeDrawings.push(data.files);

          setEngineeringInfo({
            ...engineeringInfo,
            changeDrawings,
          });
        }
        setCreateModelInfo({
          files: {},
          idEngineering: createModelInfo.idEngineering,
          idContract: createModelInfo.idContract,
        });
        setFileDialog('');
      })
      .catch(data => {
        const res = data.response;
        if (res.status === 500) {
          ModelModal('模型上传失败');
          return;
        }
      });
  };
  let data = [];

  if (createModelInfo.files !== {}) {
    data = [createModelInfo.files];
  }

  return (
    <AntdDialog
      visible={Boolean(fileDialog)}
      hasClose={true}
      dialogTitle={
        <p className={classes.title}>
          上传{fileDialog === 'BIMModel' ? '模型' : '图纸'}文件
        </p>
      }
      hasFooter={false}
      onClose={() => {
        setFileDialog('');
        // setCreateModelInfo({ files: {} });
      }}
      onConfirm
      width={532}
    >
      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="rectification-name">
          名称
          <span className={classes.required}>*</span>
        </InputLabel>
        <UnderlineInput
          value={createModelInfo.name || ''}
          placeholder="请输入名称"
          onChange={e => {
            const { value } = e.target;
            setCreateModelInfo({
              ...createModelInfo,
              name: value,
            });
          }}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="rectification-name">
          版本
          <span className={classes.required}>*</span>
        </InputLabel>
        <UnderlineInput
          value={createModelInfo.version || ''}
          placeholder="请输入版本"
          onChange={e => {
            const { value } = e.target;
            setCreateModelInfo({
              ...createModelInfo,
              version: value,
            });
          }}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <div>
          文件
          <span className={classes.required}>*</span>
        </div>
        <div className={classes.fileContent}>
          <div style={{ flexGrow: 1, width: '90%' }}>
            <FileList list={data} type="model" />
          </div>
          <div style={{ width: 62, marginLeft: '10%', textAlign: 'center' }}>
            <Dropzone
              files={[]}
              setFiles={files => {
                saveBImfiles(files);
              }}
              accept=".zip,.rvt,.nwd,.nwc,.fbx,.obj,.dwg,.prt,.asm,.3ds,.skp,.ifc,.max"
              maxSize={10}
            >
              <div className={classes.uploadBtn}>点击上传</div>
            </Dropzone>
          </div>
        </div>
        <LoadingDialog visible={isLoading} copyWriting="上传中..." />
      </FormControl>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleCreateModelInfo();
          }}
          className={classes.submitButton}
        >
          确认上传
        </Button>
      </div>
      {/* {isLoading && <LoadingOutlined style={{ fontSize: 30, opacity: 0.45 }} />} */}
    </AntdDialog>
  );
};
export default FileDialog;
