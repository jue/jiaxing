import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid, Typography, IconButton } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import PreViewFile from './index';

import { CloseOutlined, PaperClipOutlined } from '@ant-design/icons';
const useStyles = makeStyles(({ spacing }) => {
  return createStyles({
    files: {
      display: 'flex',
      alignItems: 'center',
    },
    iconButton: {
      fontSize: 12,
    },
  });
});

const FileLists = ({ list, type, info, setInfo, typeForm }) => {
  const [preViewFile, setPreViewFile] = useState('');
  const router = useRouter();

  const { action } = router.query;

  const classes = useStyles({});
  const attachmentType = window.localStorage.getItem('attachmentType');

  return (
    <>
      {list &&
        list.map((item) => (
          <React.Fragment key={item.resourceId}>
            {((attachmentType === item.attachmentType && type === 'create') ||
              (typeForm.attachmentType === item.attachmentType &&
                type === 'view')) && (
              <>
                {action !== 'view' ? (
                  <Grid container spacing={3} key={item.resourceId}>
                    <Grid item md={8} className={classes.files}>
                      {item.resourceName}
                    </Grid>
                    <Grid
                      item
                      md={4}
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      onClick={() => setPreViewFile(item)}
                    >
                      <div
                        style={{
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Visibility color="primary" />
                        <Typography
                          variant="body2"
                          style={{ marginLeft: 5, width: 30 }}
                        >
                          预览
                        </Typography>
                      </div>
                      {type !== 'view' && (
                        <IconButton
                          aria-label="toggle password visibility"
                          className={classes.iconButton}
                          onClick={() => {
                            const deleteFile = info.files.filter(
                              (f) => f.resourceId !== item.resourceId
                            );
                            setInfo({
                              ...info,
                              files: deleteFile,
                            });
                          }}
                        >
                          <CloseOutlined />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                ) : (
                  <div
                    style={{
                      fontSize: 14,
                      color: '#8FC320',
                    }}
                    onClick={() => setPreViewFile(item)}
                  >
                    <IconButton
                      size="small"
                      style={{
                        fontSize: 14,
                        color: '#8FC320',
                      }}
                    >
                      <PaperClipOutlined />
                    </IconButton>

                    {item.resourceName}
                  </div>
                )}
              </>
            )}
          </React.Fragment>
        ))}
      <PreViewFile preViewFile={preViewFile} setPreViewFile={setPreViewFile} />
    </>
  );
};
export default FileLists;
