import { useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, withRouter } from 'next/router';

import { Box, Button, Tabs, Tab } from '@material-ui/core';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

interface StyledTabProps {
  label: string;
  style?: any;
  value: any;
  selected: any;
}

export const ReactTabs = withStyles({
  root: {
    height: 40,
    minHeight: '40px',
  },
})(Tabs);

export const ReactTab = withStyles(({ spacing }) =>
  createStyles({
    root: {
      minWidth: 110,
      marginRight: spacing(5),
    },
  })
)((props: StyledTabProps) => <Tab disableRipple {...props} />);
