import React from 'react';
import {
  createStyles,
  withStyles,
  Theme,
  makeStyles,
} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';

const Input = withStyles((theme: Theme) =>
  createStyles({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.common.white,
      border: '1px solid rgba(217,217,217,1)',
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
  })
)(InputBase);

export function OutlineInput(props) {
  // const classes = useInputStyles();
  // console.log(props);

  return <Input {...props} />;
}
