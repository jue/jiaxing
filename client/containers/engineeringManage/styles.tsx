import React from 'react';
import {
  createStyles,
  fade,
  Theme,
  withStyles,
  makeStyles,
} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';

const Input = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      'label + &': {
        marginLeft: theme.spacing(10),
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
      height: theme.spacing(1),
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
  return <Input {...props} />;
}

export const engineeringStyles = makeStyles(
  ({ spacing, palette, transitions }) =>
    createStyles({
      root: {
        marginTop: spacing(2),
        marginLeft: spacing(1),
      },
      row: {
        width: '100%',
        marginBottom: 32,
      },
      formControl: {
        width: '70%',
      },
      inputLabel: {
        color: 'rgba(0,0,0,0.45)',
        fontSize: 14,
        lineHeight: '32px',
      },
      submitButton: {
        width: 92,
        height: 32,
      },
      formControlLabel: {
        flex: 1,
      },
      radioGroup: {
        display: 'flex',
        flexDirection: 'row',
      },
      typeContent: {
        marginLeft: 78,
        display: 'flex',
        flexDirection: 'row',
      },
      model: {
        flexDirection: 'column',
      },
      uploadBtn: {
        color: palette.primary.main,
        fontSize: 12,
        borderBottom: '1px dashed #8FC220',
        height: 26,
        lineHeight: '28px',
        width: 25,
      },
      select: {
        marginLeft: 78,
        borderRadius: 4,
        position: 'relative',
        backgroundColor: palette.common.white,
        border: '1px solid rgba(217,217,217,1)',
        fontSize: 14,
        fontWeight: 400,
        width: '100%',
        height: 30,
        // padding: '9.5px 12px',
        transition: transitions.create(['border-color', 'box-shadow']),
        fontFamily: [].join(','),
        '&:focus': {
          borderColor: '#8FC220',
        },
      },
      amount: {
        position: 'absolute',
        right: '-50px',
        marginTop: 5,
        fontSize: 12,
        color: 'rgba(0,0,0,0.25)',
      },
      detial: {
        marginLeft: 78,
        border: 'none',
        backgroundColor: 'rgba(251,251,251,1)',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: spacing(1.5),
      },
      common: {
        marginTop: 8,
      },
      payTable: {
        border: '1px solid #ccc',
        width: '95%',
        marginTop: 10,
        borderRadius: 5,
        fontSize: 12,
      },
      payHeader: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        minHeight: 32,
        borderBottom: '1px solid #ccc',
        '& input': {
          border: '1px solid rgba(217,217,217,1)',
        },
      },
      payShortTd: {
        width: '10%',
        marginRight: 2,
      },
      payMiddleTd: {
        width: '20%',
        marginRight: 2,
      },
      payLongTd: {
        width: '25%',
        marginRight: 2,
      },
      payInput: {
        height: '90%',
        width: '90%',
      },
      paySingle: {
        width: '30%',
      },
      payButton: {
        width: '50%',
        border: 0,
        background: '#fff',
        color: '#8FC220',
        cursor: 'pointer',
      },
      formModel: {
        width: '50%',
        color: '#8FC220',
        marginBottom: 10,
        '&:hover': {
          textDecoration: 'underline',
        },
      },
      // '@global': {
      //   '.ant-modal-body, .ant-modal-content': {
      //     height: '600px',
      //   },
      // },
    })
);
