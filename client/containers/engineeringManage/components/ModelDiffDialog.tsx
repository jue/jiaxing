import React, { useContext } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { TransitionProps } from '@material-ui/core/transitions';
import { Button, Dialog, Slide } from '@material-ui/core';
import { EngineeringContext } from '../context/EngineeringContext';

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
  const { modelPathName } = useContext(EngineeringContext);
  return (
    <Dialog
      fullScreen
      open={openCompared}
      onClose={() => setOpenCompared(false)}
      TransitionComponent={Transition}
    >
      <div style={{ height: '100%', width: '98%', margin: 16 }}>
        <iframe src={modelPathName} className={classes.iframe} />
      </div>
      <div
        style={{ width: '100%', display: 'flex ', justifyContent: 'flex-end' }}
      >
        <Button
          onClick={async () => {
            setOpenCompared(false);
            setOpenBIMFIle({ letfBIM: {}, rightBIM: {} });

            // setOpenBIM(true);
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
