import React from 'react';
import {
  createStyles,
  fade,
  Theme,
  withStyles,
  makeStyles,
} from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import TextField from '@material-ui/core/TextField';

const BootstrapInput = withStyles((theme: Theme) =>
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
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderColor: '#8FC220',
      },
    },
  })
)(InputBase);

const useInputStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      '.MuiPopover-paper': {
        // top: '46% !important',
        // top: 'calc(100% - 100px) !important',
      },
      '.MuiSelect-select:focus': {
        backgroundColor: '#fff',
        color: '#555555',
      },
      '.MuiPopover-root .MuiMenuItem-root': {
        borderBottom: '1px solid #E9E9E9',
        fontSize: 14,
        fontWeight: 400,
        color: 'rgba(0,0,0,0.65)',
      },
      '.MuiPopover-root .MuiListItem-button:hover': {
        background: 'rgba(143,194,32,0.06)',
        color: '#8FC220',
      },
      '.MuiPopover-root .MuiListItem-root.Mui-selected, .MuiListItem-root.Mui-selected:hover': {
        background: 'rgba(143,194,32,0.06)',
      },
      '.MuiPopover-root .MuiList-padding': {
        padding: 0,
      },
      '.anticon': {
        marginLeft: '-16px',
        zIndex: 1,
        width: 17,
        height: 9,
        color: '#000000',
        opacity: 0.59,
      },
    },
    root: {
      'label + &': {
        marginTop: 13,
      },
    },
    select: {
      position: 'relative',
      backgroundColor: theme.palette.common.white,
      borderBottom: '1px solid #B2B2B2',
      fontSize: 14,
      fontWeight: 400,
      width: '100%',
      padding: '9.5px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderBottom: '1px solid #8FC220 !important',
      },
    },
  })
);

export function MuiSelect(props) {
  const classes = useInputStyles();

  return <Select {...props} input={<BootstrapInput />} />;
}
