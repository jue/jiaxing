import { createMuiTheme, Theme } from '@material-ui/core/styles';

let theme: Theme = createMuiTheme({
  palette: {
    primary: {
      main: '#8FC220',
    },
    secondary: {
      main: '#F0F2F5',
    },
  },
  typography: {
    fontSize: 14,
  },
});
theme = {
  ...theme,
  overrides: {
    MuiFormControl: {
      root: {
        flexShrink: 0,
      },
    },
    MuiButton: {
      root: {
        borderRadius: theme.spacing(0.5),
      },
      label: {
        textTransform: 'none',
        color: '#ffffff',
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: theme.spacing(0.5),
      },
    },
    MuiFormControlLabel: {
      label: {
        fontSize: 14,
      },
    },
  },
};

export default theme;
