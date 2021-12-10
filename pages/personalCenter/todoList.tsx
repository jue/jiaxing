import LayoutIndexPage from '../../client/containers/layout/LayoutIndexPage';
import TodoListManage from '../../client/containers/personalCenter/todoList/TodoListManage';

const TodoList = () => {
  return (
    <LayoutIndexPage>
      <TodoListManage />
    </LayoutIndexPage>
  );
};

export default TodoList;
