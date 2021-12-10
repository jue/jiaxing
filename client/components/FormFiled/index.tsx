import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel } from '@material-ui/core';
import clsx from 'clsx';
const useStyles = makeStyles(({ spacing }) => {
  return createStyles({
    inputLabel: {
      color: 'rgba(0,0,0,0.45)',
      fontSize: 14,
      lineHeight: '32px',
      width: 125,
      textAlign: 'right',
    },
    relusTrue: {
      color: '#ff4d4f',
      fontSize: 12,
      position: 'absolute',
      bottom: ' -18px',
      left: '22%',
    },
    problemRelus: {
      bottom: 5,
      left: '18%',
    },
    problemLabel: {
      width: 80,
    },
  });
});

const RelusTrue = ({ relus, classes }) => {
  if (relus) {
    return <span className={classes}>{relus}</span>;
  } else {
    return <React.Fragment />;
  }
};

const FormFiled = ({ classes, title, type, relusRequired, createRelus }) => {
  const relusClasses = useStyles({});
  let labelRelus = Boolean(title === '问题说明' || title === '整改意见');
  return (
    <>
      <FormControl className={classes}>
        <InputLabel
          shrink
          htmlFor="inspection-desc"
          // required
          // error
          className={clsx(
            relusClasses.inputLabel,
            labelRelus && relusClasses.problemLabel
          )}
        >
          <span
            style={{
              color: '#FF8C8C',
              fontSize: 35,
              fontWeight: 300,
              opacity: 1,
              position: 'relative',
              top: 13,
            }}
          >
            *
          </span>
          {title}
        </InputLabel>
        {type}
      </FormControl>
      {relusRequired === createRelus && (
        <RelusTrue
          relus={createRelus}
          classes={clsx(
            relusClasses.relusTrue,
            labelRelus && relusClasses.problemRelus
          )}
        />
      )}
    </>
  );
};

export default FormFiled;
