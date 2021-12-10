import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { withStyles, createStyles, Theme } from '@material-ui/core/styles';

interface StyledTabProps {
  label: string;
  style?: any;
}

const SubjectTabs = withStyles({
  root: {
    minHeight: 26,
    height: 26,
    backgroundColor: 'rgba(143,194,32,0.1)',
    borderRadius: 15,
  },
  indicator: { display: 'none' },
})(Tabs);

export const SubjectTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 68,
      minHeight: 26,
      textTransform: 'none',
      fontWeight: 400,
      lineHeight: '15px',
      fontSize: 12,
      color: '#555555',
      fontFamily: ['PingFangSC-Regular', '"PingFang SC"'].join(','),
      '&$selected': {
        color: '#FFFFFF',
        backgroundColor: '#8FC220',
        borderRadius: 15,
      },
    },
    selected: {},
  })
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

export default SubjectTabs;
