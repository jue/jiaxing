import React, { useContext } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { InboxOutlined, PaperClipOutlined } from '@ant-design/icons';
import Dropzone from 'react-dropzone';
import { ModelManageContext } from './context/ModelManageContext';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';

const useStyles = makeStyles(() => {
  return createStyles({
    flex: {
      height: '84%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      '& p': {
        marginBottom: 0,
      },
    },
    dropzone: {
      width: 384,
      height: 194,
      border: '1px dashed rgba(0,0,0,0.15)',
      background: 'rgba(0,0,0,0.02)',
      borderRadius: 4,
      marginBottom: 30,
    },
    filesLit: {
      maxHeight: 230,
      // width: '30%',
      overflow: 'auto',
    },

    tips: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      '& p': {
        color: '#000',
        fontSize: 14,
        opacity: 0.43,
        fontWeight: 400,
        marginBottom: 0,
      },
      '& p:nth-of-type(1)': {
        color: '#000',
        fontSize: 16,
        opacity: 0.85,
        fontWeight: 400,
        margin: '20px 0 4px',
      },
    },
    inboxOutlined: {
      fontSize: 50,
      color: '#8FC320',
    },

    fileItem: {
      display: 'flex',
      alignItems: 'center',
      marginTop: 10,
      justifyContent: 'space-between',
      width: 384,
      fontSize: 14,
      color: 'rgba(0,0,0,0.65)',
    },
    close: {
      marginLeft: 10,
    },
  });
});

function ModelUploadFile() {
  const { saveFiles, setFilesList } = useContext(ModelManageContext);
  const classes = useStyles({});

  return (
    <Dropzone
      onDrop={acceptedFiles => {
        saveFiles(acceptedFiles);
        setFilesList(acceptedFiles);
      }}
      accept=".zip, .rvt, .nwd, .nwc, .fbx, .obj, .dwg, .prt, .asm, .3ds, .skp, .ifc, .max"
      multiple={false}
    >
      {({ getRootProps, getInputProps }) => (
        <div className={classes.flex}>
          <div className={classes.dropzone}>
            <div {...getRootProps()} className={classes.tips}>
              <input {...getInputProps()} />
              <InboxOutlined className={classes.inboxOutlined} />
              <p>点击或将文件拖拽到这里上传</p>
              <p>支持扩展名：.zip,.rvt,.nwd,.nwc,.fbx,.obj,.dwg</p>
              <p>.prt,.asm,.3ds,.skp,.ifc,.max</p>
            </div>
          </div>
          <FilesList />
        </div>
      )}
    </Dropzone>
  );
}

function FilesList() {
  const classes = useStyles({});
  const {
    createModelInfo,
    setCreateModelInfo,
    filesList,
    setFilesList,
    isLoading,
  } = useContext(ModelManageContext);
  const list = createModelInfo.files;

  return (
    <>
      {list._id && (
        <div className={classes.filesLit}>
          <div className={classes.fileItem}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <PaperClipOutlined />
              <p>{list.originalname}</p>
            </div>
            <div>
              <CloseOutlined
                className={classes.close}
                onClick={() => {
                  setCreateModelInfo({ ...createModelInfo, files: {} });
                  setFilesList([...filesList]);
                }}
              />
            </div>
          </div>
        </div>
      )}
      {isLoading && <LoadingOutlined style={{ fontSize: 30, opacity: 0.45 }} />}
    </>
  );
}

export default ModelUploadFile;
