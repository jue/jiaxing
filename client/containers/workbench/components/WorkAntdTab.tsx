import { Tabs, Tab } from '@material-ui/core';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';

interface StyledTabProps {
  label: string;
  style?: any;
  value: any;
  selected?: any;
}

const ReactTabs = withStyles({
  root: {
    marginBottom: 20,
  },
  indicator: {
    display: 'none',
  },
})(Tabs);

export const ReactTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      minWidth: 50,
      fontWeight: 500,
      fontSize: 16,
      padding: 0,
      marginTop: '-9px',
      margin: theme.spacing(0, 1),
      fontFamily: ['PingFangSC-Medium', 'PingFang SC'].join(','),
      '&:hover': {
        color: 'rgba(0,0,0,0,0.85)',
      },
      '&$selected': {
        color: 'rgba(0,0,0,0,0.85)',
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: 'rgba(0,0,0,0,0.85)',
      },
    },
  })
)((props: StyledTabProps) => <Tab disableRipple {...props} />);
export default ReactTabs;
