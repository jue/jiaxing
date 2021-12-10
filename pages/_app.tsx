import React, { useEffect } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import CssBaseline from '@material-ui/core/CssBaseline';
import './app.css';

import 'antd/dist/antd.css';
import 'react-dropzone/examples/theme.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
    require('dhtmlx-gantt/codebase/dhtmlxgantt');
  }, []);

  return (
    <React.Fragment>
      <Head>
        {/* <script src="https://cdn.dhtmlx.com/gantt/edge/dhtmlxgantt.js"></script> */}

        {/* <script src="https://export.dhtmlx.com/gantt/api.js"></script> */}

        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="stylesheet" href="//cdn.jsdelivr.net/gh/jue/static@master/style/jiaxing/reset.css">
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
    </React.Fragment>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = { key: ctx.router };
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps };
};
