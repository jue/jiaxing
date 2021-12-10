import React, { useContext, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import GetApp from '@material-ui/icons/GetApp';

import AntdDialog from '../../components/AntdDialog';
import { Tooltip } from 'antd';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    download: {
      backgroundColor: 'rgba(0,0,0,0.7)',
      height: '100%',
      width: '100%',
      overflow: 'auto',
      padding: theme.spacing(1.5),
    },
    img: {
      width: '100%',
      minHeight: '100%',
    },
  })
);

export const PreviewFile = ({ visible, fileName, onClose }) => {
  const classes = useStyles({});
  let imgName = (fileName && fileName.split('.')) || [];

  const type = imgName.length ? imgName[1] : '';
  const imgType = ['jpg', 'png', 'jpeg'];
  let applicationForm = `/api/file/preview/${visible}/${fileName}`;

  return (
    <AntdDialog
      visible={visible !== ''}
      onClose={() => onClose()}
      hasClose={true}
      dialogTitle=""
      hasFooter={false}
      onConfirm={() => {}}
      width={'55%'}
    >
      <div style={{ padding: 20, height: 'calc(100vh - 220px)' }}>
        {imgType.includes(type) ? (
          <div className={classes.download}>
            <span style={{ color: '#fff', float: 'left' }}>{fileName}</span>
            <IconButton size="small" style={{ color: '#fff', float: 'right' }}>
              <GetApp />
            </IconButton>
            <img className={classes.img} src={applicationForm} />
          </div>
        ) : (
          <iframe
            style={{ width: '100%', height: '100%' }}
            src={applicationForm}
          />
        )}
      </div>
    </AntdDialog>
  );
};
export function DocumentModel({ documents }) {
  const classes = useStyles();
  const [openPreview, setOpenPreview] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  return (
    <div className={classes.root}>
      {documents &&
        documents.length > 0 &&
        documents.map((item) => (
          <div
            style={{ height: 22 }}
            key={item._id}
            onClick={() => {
              setOpenPreview(item.idFile);
              setFileName(item.name);
            }}
          >
            <Tooltip title={item.name}>
              <div
                style={{
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.name}
              </div>
            </Tooltip>
          </div>
        ))}
      <PreviewFile
        visible={openPreview}
        fileName={fileName}
        onClose={() => setOpenPreview('')}
      />
    </div>
  );
}
