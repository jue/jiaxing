import React from 'react';
import {
  createStyles,
  fade,
  Theme,
  withStyles,
  makeStyles,
} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';

export const OutlineInput = withStyles((theme: Theme) =>
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
      border: '1px solid #B2B2B2',
      fontSize: 14,
      fontWeight: 400,
      width: '100%',
      padding: '9.5px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
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

export const inspectStyles = makeStyles(() => {
  return createStyles({
    createdInspectionPlan: {
      // display: 'grid',
      // gridTemplateColumns: '70% 30%',
      display: 'flex',
      justifyContent: 'space-between',
      height: '90%',
      // marginLeft: '-16px',
      '& .block': {
        marginBottom: 30,
      },
      '& .MuiFormLabel-root': {
        fontSize: 18,
        color: '#5F6871',
        fontWeight: 400,
      },
    },
    flex: {
      display: 'flex',
      flexDirection: 'column',
    },
    datePicker: {
      display: 'grid',
      gridTemplateColumns: '50% 50%',
      gridGap: 20,
      '& .ant-picker': {
        width: '100%',
      },
      '& .ant-picker.ant-picker-borderless': {
        borderBottom: '1px solid #b2b2b2 !important',
      },
    },
    planContanier: {
      borderRight: '1px dashed #B2B2B2',
      paddingRight: 27,
      marginRight: 29,
      width: '60%',
      overflow: 'auto',
    },
    planTitle: {
      fontSize: 16,
      fontWeight: 500,
      opacity: 0.8,
      lineHeight: '24px',
      marginBottom: 30,
    },

    planPicker: {
      fontSize: 14,
      fontWeight: 400,
      color: '#9B9B9B',
    },
    filesReview: {
      margin: '49px 0 37px',
    },
    button: {
      width: 100,
      height: 34,
      borderRadius: 4,
      border: '1px solid rgba(143,194,32,1)',
      lineHeight: '22px',
      '& .MuiButton-label': {
        fontWeight: 400,
        color: '#555',
        fontSize: 14,
      },
    },
    fileItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      '& button': { width: 88 },
      '& .MuiButton-label': {
        fontSize: 14,
        fontWeight: 400,
      },
    },
    cancelButton: {
      boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.1)',
      marginRight: 60,
      '& .MuiButton-label': {
        color: '#000',
        opacity: 0.3,
      },
    },
    outlineButton: {
      width: 118,
      height: 26,
      background: '#fff !important',
      borderRadius: 2,
      border: '1px solid rgba(143,194,32,1)',
      padding: 0,
      boxShadow: 'none',
      '& .MuiButton-label': {
        color: '#8FC220',
        fontSize: 12,
        fontWeight: 400,
      },
    },
  });
});

export const commonStyles = makeStyles(() => {
  return createStyles({
    stepCommon: {
      '& .ant-steps-item-process .ant-steps-item-icon,.ant-steps-item-process .ant-steps-item-icon,.ant-steps-item-process .ant-steps-item-icon': {
        background: '#8FC220',
      },
      '& .ant-steps-item-process .ant-steps-item-icon': {
        borderColor: '#8FC220',
      },
      '& .ant-steps .ant-steps-item:not(.ant-steps-item-active):not(.ant-steps-item-process) > .ant-steps-item-container[role="button"]:hover .ant-steps-item-icon': {
        borderColor: '#8FC220',
      },
      '& .ant-steps .ant-steps-item:not(.ant-steps-item-active):not(.ant-steps-item-process) > .ant-steps-item-container[role="button"]:hover .ant-steps-item-icon .ant-steps-icon': {
        color: '#8FC220!important',
      },
      '& .ant-steps .ant-steps-item:not(.ant-steps-item-active) > .ant-steps-item-container[role="button"]:hover .ant-steps-item-title': {
        color: '#8FC220!important',
      },
      '& .ant-steps .ant-steps-item:not(.ant-steps-item-active) > .ant-steps-item-container[role="button"]:hover .ant-steps-item-subtitle, .ant-steps .ant-steps-item:not(.ant-steps-item-active) > .ant-steps-item-container[role="button"]:hover .ant-steps-item-description': {
        color: 'rgba(0, 0, 0, 0.45)!important',
      },
      '& .ant-steps-item-finish .ant-steps-item-icon': {
        color: '#8FC220!important',
        borderColor: '#8FC220',
      },
      '& .anticon svg': {
        color: '#8FC220',
      },
      '& .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-tail::after': {
        background: '#8FC220',
      },
    },
  });
});
