import React, { useState, useRef, useEffect } from 'react';
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import { Spin, Alert } from 'antd';

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

const PreViewFileResource = ({ preViewFile, setPreViewFile }) => {
  const classes = useStyles({});
  const [open, setOpen] = useState('');

  return (
    <>
      {open === '' && (
        <Dialog
          onClose={() => setPreViewFile('')}
          aria-labelledby="customized-dialog-title"
          open={Boolean(preViewFile.resourceId)}
          maxWidth="md"
          fullWidth
          className={classes.dialog}
        >
          <ProviewView
            preViewFile={preViewFile}
            classes={classes}
            setPreViewFile={setPreViewFile}
          />
          <IconButton
            onClick={() => {
              setPreViewFile('');
              setOpen(preViewFile);
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
  let applicationForm = '';
  applicationForm = `/api/resource/preview/${preViewFile.resourceId}/${preViewFile.resourceName}`;
  let pdfTransfer = ['.dwg', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
  // let previewPdf = pdfTransfer.some(ext =>
  //   (preViewFile.originalname || '').endsWith(ext.toLowerCase())
  // );

  // if (previewPdf) {
  //   applicationForm = `${applicationForm}.pdf`;
  // }

  const imgName =
    (preViewFile.resourceName && preViewFile.resourceName.split('.')) || [];

  const type = imgName.length ? imgName[1] : '';
  const imgType = ['jpg', 'png', 'jpeg'];
  const unLodading = ['rvt', 'nwd', 'dwg'];
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
        onClose={() => setPreViewFile('')}
      >
        文件预览
      </DialogTitle>

      <DialogContent dividers>
        {preViewFile &&
          (imgType.includes(type) ? (
            <div>
              <img className={classes.img} src={applicationForm} />
            </div>
          ) : (
            <div className={classes.paper}>
              {loading === true && !unLodading.includes(type) && (
                <Spin tip="Loading...">
                  <Alert message="" description="" type="info" />
                </Spin>
              )}
              <iframe
                id="iframeFaq"
                width="100%"
                height="100%"
                src={applicationForm}
                ref={iframeRef}
              />
            </div>
          ))}
      </DialogContent>
    </>
  );
};
export default PreViewFileResource;
