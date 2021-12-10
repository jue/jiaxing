import {
  createStyles,
  Theme,
  withStyles,
  makeStyles,
} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';

export const OutlineInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      'label + &': {
        // marginTop: theme.spacing(3),
        marginLeft: theme.spacing(13.5),
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
      padding: '8px 12px',
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
