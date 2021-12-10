import React, { useContext, useState } from 'react';

import Box from '@material-ui/core/Box';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { PaperClipOutlined, DownloadOutlined } from '@ant-design/icons';
import { Progress, Modal } from 'antd';

import Dropzone from '../../../components/Dropzone/DropzoneUploadContainer';
// import UpLoad from '../../../../components/Svgs/upLoad';
import PreViewFileResource from '../../../components/FilePreview/PreViewFileResource';
import { ContractManageContext } from '../context/ContractManageContext';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    iconButton: {
      margin: theme.spacing(0, 1),
    },
    root: {
      display: 'flex',
      width: '50%',
      border: '1px solid #d9d9d9',
    },
    meetingBg: {
      border: '1px solid rgba(75,151,218,1)',
      backgroundColor: 'rgba(203,232,254,0.6)',
    },
    dropzone: {
      height: 32,
      width: 106,
      backgroundColor: '#fff',
      borderRadius: 4,
      border: '1px solid #D9D9D9',
      cursor: 'pointer',
      '& div': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 32,
      },
      '& span': {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: 400,
        color: '#000',
        opacity: 0.65,
      },
    },
    accpect: {
      fontSize: 14,
      fontWeight: 400,
      color: '#000',
      opacity: 0.45,
      margin: '10px 0',
    },
  });
});

const FilesList = ({ saveFiles, vfileLists, ...rest }) => {
  const classes = useStyles({});
  const { handleDeleteFile, progress } = useContext(ContractManageContext);

  const [preViewFile, setPreViewFile] = useState('');
  const [fileTypeModal, setFileTypeModal] = useState(false);
  const fileType = [
    '.jpg',
    '.png',
    '.pdf',
    '.doc',
    '.docx',
    '.ppt',
    '.pptx',
    '.xlsx',
    '.txt',
  ];

  return (
    <>
      <div className={classes.dropzone}>
        <Dropzone
          files={[]}
          setFiles={files => {
            // setProgress(0);
            files.filter(fs => {
              const name = fs.name.substring(fs.name.length - 4);
              const fileUpload = fileType.filter(f => f.includes(name));
              if (fileUpload.length) {
                saveFiles(files, '1');
              } else {
                setFileTypeModal(true);
              }
            });
          }}
          accept={'.jpg,.png,.pdf,.doc,.docx,.ppt,.pptx,.xlsx,.txt'}
          maxSize={10}
        >
          {/* <UpLoad /> */}
          <span>上传文件</span>
        </Dropzone>
      </div>
      <div className={classes.accpect}>
        支持扩展名：.jpg,.png,.pdf,.doc,.docx,.ppt,.pptx,.xlsx,.txt
      </div>
      {vfileLists && vfileLists.length !== 0 && (
        <Box className={classes.root}>
          <Box
            flex="1"
            style={{
              height: vfileLists.length ? 100 : 34,
              overflow: 'auto',
            }}
          >
            <Box height="100%" p={0.5}>
              {(vfileLists || []).map((item, key) => {
                // 文件上传进度条
                // const newPregress = find(progress, v => v._id === item._id) || {
                //   progressItem: 0,
                // };

                return (
                  <React.Fragment key={item.resourceId}>
                    <Box width="100%" display="flex">
                      <Box
                        flex="1"
                        onClick={() => {
                          // if (newPregress.progressItem === 100) {
                          setPreViewFile(item);
                          // }
                        }}
                        style={{
                          cursor: 'pointer',
                        }}
                      >
                        <IconButton size="small">
                          <PaperClipOutlined
                            style={{
                              fontSize: 14,
                              // color:
                              //   newPregress.progressItem === 100
                              //     ? 'rgba(43, 163, 253, 1)'
                              //     : '',
                            }}
                          />
                        </IconButton>
                        <span
                          style={{
                            fontSize: 12,
                            // color:
                            //   newPregress.progressItem === 100
                            //     ? 'rgba(43, 163, 253, 1)'
                            //     : '',
                          }}
                        >
                          {item.resourceName}
                        </span>
                      </Box>
                      {/* <a
                        href={`/api/file/${item.resourceId}`}
                        download
                        style={{ color: '#000' }}
                      >
                        <IconButton
                          size="small"
                          className={classes.iconButton}
                          style={{ margin: 0 }}
                        >
                          <DownloadOutlined style={{ fontSize: 14 }} />
                        </IconButton>
                      </a> */}

                      <IconButton size="small" className={classes.iconButton}>
                        <CloseIcon
                          style={{ fontSize: 14 }}
                          onClick={() => {
                            handleDeleteFile(vfileLists[key]);
                          }}
                        />
                      </IconButton>
                    </Box>
                    {/* <div style={{ width: '100%' }}>
                      {newPregress.progressItem !== 0 && (
                        <Progress
                          percent={newPregress.progressItem || 0}
                          size="small"
                          strokeColor="#FA6400"
                        />
                      )}
                    </div> */}
                  </React.Fragment>
                );
              })}
            </Box>
          </Box>
        </Box>
      )}

      <PreViewFileResource
        preViewFile={preViewFile}
        setPreViewFile={setPreViewFile}
      />

      <Modal
        className="dialog"
        visible={Boolean(fileTypeModal)}
        // onCancel={() => setFileTypeModal(false)}
        centered={true}
        destroyOnClose
        okText="确定"
        onOk={() => setFileTypeModal(false)}
        cancelText="取消"
      >
        不支持该文件格式上传，请选择其他格式
      </Modal>
    </>
  );
};

export default FilesList;
