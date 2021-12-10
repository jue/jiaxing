import react, { useEffect, useState } from 'react';

import { IconButton, Box } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Popover, Button } from 'antd';

import Filter from '../Svgs/Filter';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      '.ant-popover-inner-content': {
        padding: '0 !important',
      },
      'button[ant-click-animating-without-extra-node]:after': {
        border: '0 none',
        opacity: 0,
        animation: 'none 0 ease 0 1 normal',
      },
    },
    title: {
      marginRight: 5,
    },
    box: {
      whiteSpace: 'nowrap',
    },
    iconButton: {
      padding: 0,
    },
    root: {
      borderBottom: '1px solid #E9E9E9',
      marginBottom: 1,
      boxShadow: '0px 1px 0px 0px rgba(233, 233, 233, 0.3)',
      '&:hover': {
        background: 'rgba(143,194,32,0.06)',
      },
      '&:active': {
        background: 'rgba(143,194,32,0.06)',
      },
      '&:focus': {
        background: 'rgba(143,194,32,0.06)',
      },
    },
    content: {
      display: 'flex',
      border: 'none',
      '&:hover': {
        color: '#8FC220',
        background: 'rgba(143,194,32,0.06)',
      },
      '&:active': {
        color: '#8FC220',
        boxShadow: 'none',
        background: 'rgba(143,194,32,0.06)',
      },
      '&:focus': {
        color: '#8FC220',
        boxShadow: 'none',
        background: 'rgba(143,194,32,0.06)',
      },
    },
  })
);

const TableFilters = ({ title, filterContent, onchange }) => {
  const classes = useStyles({});
  const content = (
    <>
      {filterContent.map((item, index) => (
        <Box className={classes.root} key={index}>
          <Button
            className={classes.content}
            key={index}
            onClick={() => onchange(item)}
          >
            {item.text}
          </Button>
        </Box>
      ))}
    </>
  );
  return (
    <Box className={classes.box}>
      <span className={classes.title}>{title}</span>
      <Popover placement="bottom" content={content}>
        <IconButton
          aria-label="filter"
          color="primary"
          component="span"
          className={classes.iconButton}
        >
          <Filter />
        </IconButton>
      </Popover>
    </Box>
  );
};
export default TableFilters;
