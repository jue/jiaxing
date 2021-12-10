import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ThemeProvider from '@material-ui/styles/ThemeProvider';

import LayoutMainContanier from './LayoutMainContanier';
import LayoutToolbarContanier from './LayoutToolbarContanier';
import LayoutSideContanier from './LayoutSideContanier';
import LayoutPageContextProvider from './context/LayoutPageContext';
import theme from '../../theme';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import NProgressBar from '../../components/NProgressBar';
import AuthContextProvider from '../../contexts/AuthContext';

const useStyles = makeStyles(() =>
  createStyles({
    '@global': {
      body: {
        backgroundColor: '#F0F2F5',
      },
    },
  })
);

export default function LayoutIndexPage(props: { children: React.ReactNode }) {
  useStyles();
  return (
    <ThemeProvider theme={theme}>
      <LayoutPageContextProvider>
        <AuthContextProvider>
          <LayoutToolbarContanier />
          <LayoutSideContanier />
          <LayoutMainContanier children={props.children} />
        </AuthContextProvider>
        <NProgressBar />
      </LayoutPageContextProvider>
    </ThemeProvider>
  );
}
