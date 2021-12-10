import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
} from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

interface StyledTabProps {
  label: string;
  style?: any;
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
      minWidth: 80,
      minHeight: 32,
      color: '#000',
      opacity: 0.65,
      padding: 0,
      fontSize: 14,
      fontWeight: 400,
      borderRadius: 4,
      backgroundColor: '#fff',
      border: '1px solid rgba(217,217,217,1)',

      '&:hover': {},
      '&$selected': {
        background: '#8FC320',
        boxShadow:
          '0px 2px 0px 0px rgba(0,0,0,0.1),0px 2px 0px 0px rgba(255,255,255,0.2),0px -2px 0px 0px rgba(0,0,0,0.15)',
        border: 0,
        color: '#fff',
      },
      '&:focus': {},
    },
    selected: {},
  })
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

export default ReactTabs;
