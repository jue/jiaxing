import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';

const useInputStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      'label + &': {
        marginTop: 13,
      },
    },
    input: {
      position: 'relative',
      backgroundColor: theme.palette.common.white,
      borderBottom: '1px solid #B2B2B2',
      fontSize: 14,
      fontWeight: 400,
      width: '100%',
      padding: '9.5px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      fontFamily: [].join(','),
      '&:focus': {
        borderColor: '#8FC220',
      },
    },

    underline: {
      borderBottom: '1px solid #B2B2B2',
      fontSize: 14,

      '&:after': {
        borderBottom: '1px solid #8FC220 ',
      },
      '&:before': {
        borderBottom: '1px solid #8FC220 ',
        display: 'none',
      },
    },
  })
);

export function UnderlineInput(props) {
  const classes = useInputStyles();
  // console.log(props);

  return <Input classes={{ underline: classes.underline }} {...props} />;
}
