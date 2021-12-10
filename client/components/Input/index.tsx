import InputBase from '@material-ui/core/InputBase';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      width: '100%',
      height: '100%',
      border: '1px solid #EBEBEB',
      boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.05)',
      padding: '7px 10px',
      '&:hover': {
        borderColor: '#8FC220',
      },
    },
    input: {
      backgroundColor: theme.palette.common.white,
      border: 0,
      borderRadius: 4,
      fontSize: 12,
      fontWeight: 400,
      width: '100%',
      height: '100%',
      padding: '0 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      fontFamily: 'PingFangSC-Regular,PingFang SC',
      '&:focus': {
        borderColor: '#8FC220',
      },
    },
  });
});

export function MuiInput(props) {
  const classes = useStyles();

  return (
    <InputBase
      label="Outlined"
      variant="outlined"
      classes={{ input: classes.input, root: classes.root }}
      margin="none"
      {...props}
    />
  );
}
