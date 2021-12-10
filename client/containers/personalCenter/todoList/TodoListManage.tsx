import { useContext, useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Input } from 'antd';

import Typography from '@material-ui/core/Typography';
import { withRouter } from 'next/router';

import { FilterType, FilterDesc } from '../../../../constants/enums';
import TodoListContextProvider, {
  TodoListContext,
} from '../context/TodoListContext';

import { LayoutPageContext } from '../../layout/context/LayoutPageContext';
import TodoListTable from './TodoListTable';
import { Box } from '@material-ui/core';
import { ReactTabs, ReactTab } from '../../../components/ReactTab';
import clsx from 'clsx';

const { Search } = Input;

const useStyles = makeStyles(() => {
  return createStyles({
    '@global': {
      '.makeStyles-contentContainer-39': {
        paddingBottom: 70,
      },
    },
    total: {
      position: 'absolute',
      right: '61%',
      top: '40%',
      fontSize: 12,
      color: 'rgba(0, 0, 0, 0.65)',
    },
    done: {
      right: '11%',
      top: '40%',
    },
  });
});

const TodoListManage = () => {
  const classes = useStyles({});

  const { query, setQuery, currentTab, setCurrentTab, count } = useContext(
    TodoListContext
  );

  return (
    <Box mx={2}>
      <Box
        mb={2}
        bgcolor="#fff"
        borderRadius={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <ReactTabs
          value={currentTab}
          onChange={(event, newValue) => {
            if (newValue === 'done') {
              setQuery({
                ...query,
                status: '2',
                pageIndex: 1,
              });
            } else {
              setQuery({
                ...query,
                status: '1',
                pageIndex: 1,
              });
            }
            setCurrentTab(newValue);
          }}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          {Object.keys(FilterType).map((item) => {
            return (
              <ReactTab
                key={item}
                label={FilterDesc[FilterType[item]]}
                value={FilterType[item]}
                selected={FilterType[item] === currentTab}
              />
            );
          })}

          <Typography
            className={clsx(
              classes.total,
              currentTab === 'done' && classes.done
            )}
          >
            （{count}）
          </Typography>
        </ReactTabs>
      </Box>

      <Search
        placeholder="请输入施工方案名称"
        onSearch={(value) => setQuery({ ...query, bizName: value })}
        style={{ width: 230, marginLeft: 16, marginBottom: 8 }}
      />
      <TodoListTable />
    </Box>
  );
};

export default withRouter(({ router }) => {
  const { setParts } = useContext(LayoutPageContext);

  useEffect(() => {
    setParts(['个人中心', '我的待办']);
  }, [router.query]);

  return (
    <TodoListContextProvider>
      <TodoListManage />
    </TodoListContextProvider>
  );
});
