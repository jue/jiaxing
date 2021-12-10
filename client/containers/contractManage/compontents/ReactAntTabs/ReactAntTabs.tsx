import React from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

interface StyledTabProps {
  label: string;
  style?: any;
}

const ReactAntTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: '#8FC320',
  },
})(Tabs);

export const ReactAntTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      minWidth: 100,
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(4),
      '&:hover': {
        color: '#8FC320',
        opacity: 1,
      },
      '&$selected': {
        color: '#8FC320',
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: '#8FC320',
      },
    },
    selected: {},
  })
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

export default ReactAntTabs;
