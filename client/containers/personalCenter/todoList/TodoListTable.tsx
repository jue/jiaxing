import { useContext } from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Pagination } from 'antd';
import moment from 'moment';

import AntdTable from '../../../components/AntdTable';
import { TodoListContext } from '../context/TodoListContext';

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      position: 'fixed',
      width: 'calc(100% - 276px)',
      bottom: 16,
      backgroundColor: '#fff',
      padding: 14,
      marginRight: spacing(2),
    },
    titleBox: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    button: {
      color: palette.primary.main,
      border: 0,
      cursor: 'pointer',
      background: 'none',
      outline: 'none',
    },
  })
);

const TodoListTable = () => {
  const classes = useStyles({});
  const { todoListInfos, count, query, setQuery, searchTodo } = useContext(
    TodoListContext
  );

  const columns = [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      key: 'index',
    },
    {
      title: '消息名称',
      dataIndex: 'bizName',
      key: 'bizName',
    },

    {
      title: '创建时间',
      width: 200,
      render: (text) => moment(text.createdTime).format('YYYY-MM-DD'),
      key: 'createdTime',
    },

    {
      title: '操作',
      render: (text, record, index) => (
        <button
          className={classes.button}
          onClick={(e) => {
            e.stopPropagation();
            searchTodo(text.todoId);
          }}
        >
          {query.status === '1' ? '审批' : ' 查看'}
        </button>
      ),
    },
  ];

  return (
    <>
      <AntdTable
        onChange={() => console.warn(111)}
        columns={columns}
        dataSource={todoListInfos || []}
        rowKey={(row) => row._id}
        pagination={false}
      />
      <div className={classes.pagination}>
        <Pagination
          size="small"
          total={count}
          current={query.pageIndex}
          onChange={(pageIndex) => {
            setQuery({ ...query, pageIndex: pageIndex });
          }}
        />
      </div>
    </>
  );
};

export default TodoListTable;
