import React from 'react';
import Head from 'next/head';

function HtmlTitle({ title }) {
  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
}

export default HtmlTitle;
