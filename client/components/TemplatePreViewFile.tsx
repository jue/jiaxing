import React, { useState, useRef, useEffect } from 'react';
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import GetApp from '@material-ui/icons/GetApp';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';

import { Spin, Alert } from 'antd';
import { EngineeringLevelTypeDesc } from '../../constants/enums';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    dialog: {
      '& .MuiDialog-paperFullWidth': {
        height: '100%',
      },
      '& .ant-spin-nested-loading': {
        height: '100%',
        marginBottom: 20,
      },
      '& .ant-alert.ant-alert-no-icon': {
        height: '100%',
      },
      '& .ant-spin-blur': {
        height: '100%',
      },
    },
    paper: {
      height: '100%',
      width: '100%',
      overflow: 'auto',
      position: 'relative',
    },
    download: {
      backgroundColor: 'rgba(0,0,0,0.7)',
      height: '100%',
      width: '100%',
      overflow: 'auto',
      padding: theme.spacing(1.5),
      // lineHeight: '35px',
      // padding: '0 10px',
      // color: '#fff',
    },
    img: {
      width: '100%',
      minHeight: '100%',
    },
    empty: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
});

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });
export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="body1">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(0, 2, 2),
    borderTop: 'none',
  },
}))(MuiDialogContent);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TemplatePreViewFile = ({
  modelFile,
  preViewFile,
  setPreViewFile,
  idAuditing,
  customize,
}) => {
  const classes = useStyles({});
  const [open, setOpen] = useState('');
  const [iframeTemSrc, setIframeTemSrc] = useState('');

  useEffect(() => {
    let iframeSrc = '';
    if (customize) {
      preViewFile = { ...preViewFile, ...customize };
    }
    if (preViewFile.changeLevel) {
      if (
        !(
          EngineeringLevelTypeDesc.common === preViewFile.changeLevel ||
          EngineeringLevelTypeDesc.great === preViewFile.changeLevel
        )
      ) {
        preViewFile.changeLevel =
          EngineeringLevelTypeDesc[preViewFile.changeLevel];
      }
    }

    for (const key in preViewFile) {
      const isObj = preViewFile[key] instanceof Object;
      if (key !== 'idAuditing') {
        iframeSrc += `&${key}=${
          isObj ? JSON.stringify(preViewFile[key]) : preViewFile[key]
        }`;
      }
    }

    setIframeTemSrc(
      `/api/file/template/preview?tempId=${modelFile.bizFormId}&fileName=${modelFile.bizFormName}${iframeSrc}&idAuditing=${idAuditing}`
    );
  }, [modelFile, preViewFile]);

  return (
    <>
      {open === '' && (
        <Dialog
          onClose={() => setPreViewFile({ _id: '' })}
          aria-labelledby="customized-dialog-title"
          open={Boolean(preViewFile._id)}
          maxWidth="md"
          fullWidth
          className={classes.dialog}
        >
          <ProviewView
            preViewFile={iframeTemSrc}
            classes={classes}
            setPreViewFile={setPreViewFile}
          />
          <IconButton
            onClick={() => {
              setPreViewFile({ _id: '' });
              setOpen(iframeTemSrc);
            }}
          >
            全屏预览
          </IconButton>
        </Dialog>
      )}
      {open !== '' && (
        <Dialog
          onClose={() => {
            setOpen('');
          }}
          aria-labelledby="customized-dialog-title"
          open={Boolean(open)}
          maxWidth="md"
          fullScreen
          TransitionComponent={Transition}
        >
          <ProviewView
            preViewFile={open}
            classes={classes}
            setPreViewFile={setOpen}
          />
        </Dialog>
      )}
    </>
  );
};

const ProviewView = ({ preViewFile, classes, setPreViewFile }) => {
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.onload = () => {
        setLoading(false);
      };
    }
  });

  return (
    <>
      <DialogTitle
        id="customized-dialog-title"
        onClose={() => {
          if (preViewFile instanceof Object) {
            setPreViewFile({ _id: '' });
          } else {
            setPreViewFile('');
          }
        }}
      >
        文件预览
      </DialogTitle>

      <DialogContent dividers>
        {preViewFile && (
          <div className={classes.paper}>
            {loading === true && (
              <Spin tip="Loading...">
                <Alert message="" description="" type="info" />
              </Spin>
            )}
            <iframe
              id="iframeFaq"
              width="100%"
              height="100%"
              src={preViewFile}
              ref={iframeRef}
            />
          </div>
        )}
      </DialogContent>
    </>
  );
};
export default TemplatePreViewFile;
