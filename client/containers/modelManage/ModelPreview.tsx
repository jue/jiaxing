import React, { useContext } from 'react';
import { TransitionProps } from '@material-ui/core/transitions';
import { Button, Dialog, Slide } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { CloseOutlined } from '@ant-design/icons';

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
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 44,
      color: '#fff',
      backgroundColor: '#8FC220',
      padding: '0 16px',
      fontSize: 16,
    },
    section: {
      height: 'calc(100% - 16px)',
      width: '98%',
      margin: 16,
    },
  })
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModelPreview = ({ setModel, model }) => {
  const classes = useStyles();

  return (
    <Dialog
      fullScreen
      open={Boolean(model.pathname)}
      onClose={() => setModel({ ...model, pathname: '' })}
      TransitionComponent={Transition}
    >
      <header className={classes.header}>
        <span>模型浏览</span>
        <span>{model.modelname}</span>
        <CloseOutlined
          onClick={() => {
            setModel({ ...model, pathname: '' });
          }}
        />
      </header>
      <section className={classes.section}>
        <iframe src={model.pathname} className={classes.iframe} />
      </section>
    </Dialog>
  );
};

export default ModelPreview;
