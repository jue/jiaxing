import React, { useContext } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { TransitionProps } from '@material-ui/core/transitions';
import { Button, Dialog, Slide } from '@material-ui/core';

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    submitButton: {
      width: 92,
      height: 32,
      margin: spacing(3, 4),
    },
    iframe: {
      width: '100%',
      height: '100%',
      border: 'none',
    },
  })
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModelDIffDialog = ({ setOpenCompared, setOpenBIMFIle, openCompared }) => {
  const classes = useStyles();

  return (
    <Dialog
      fullScreen
      open={Boolean(openCompared)}
      onClose={() => setOpenCompared('')}
      TransitionComponent={Transition}
    >
      <div style={{ height: '100%', width: '98%', margin: 16 }}>
        <iframe src={openCompared} className={classes.iframe} />
      </div>
      <div
        style={{ width: '100%', display: 'flex ', justifyContent: 'flex-end' }}
      >
        <Button
          onClick={async () => {
            setOpenCompared('');
            setOpenBIMFIle({ letfBIM: {}, rightBIM: {} });
          }}
          variant="contained"
          color="primary"
          className={classes.submitButton}
        >
          重新选择
        </Button>
      </div>
    </Dialog>
  );
};
export default ModelDIffDialog;
