import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { DBQualityInspectReportI } from '../../../../typings/quality_inspect_report';
import toDoListSvc from '../../../services/todoListSvc';
import { AuthContext, AuthContextI } from '../../../contexts/AuthContext';
import { FilterType } from '../../../../constants/enums';

interface TodoListContextI {
  todoListInfos: DBQualityInspectReportI[];
  setTodoListInfos: Function;

  query: {
    pageIndex: number;
    bizName: string;
    status: string;
  };
  setQuery: Function;

  count: number;
  setCount: Function;
  currentTab: string;
  setCurrentTab: Function;
  searchTodo: Function;
}

const defaultContext: TodoListContextI = {
  todoListInfos: [],
  setTodoListInfos() {},

  query: {
    pageIndex: 1,
    bizName: '',
    status: '1',
  },
  setQuery() {},

  count: 0,
  setCount() {},
  currentTab: FilterType.Todo,
  setCurrentTab() {},
  searchTodo() {},
};

export const TodoListContext = createContext<TodoListContextI>(defaultContext);

export const TodoListContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { account } = useContext<AuthContextI>(AuthContext);
  const [todoListInfos, setTodoListInfos] = useState(
    defaultContext.todoListInfos
  );
  const [query, setQuery] = useState<any>(defaultContext.query);
  const [count, setCount] = useState(defaultContext.count);
  const [currentTab, setCurrentTab] = useState(defaultContext.currentTab);

  const searchTodo = async (todoId) => {
    try {
      const { data } = await toDoListSvc.searchTodo(todoId);
    } catch (error) {
      console.log(error);
    }
  };

  const searchTodos = async (params?: any) => {
    let data = await toDoListSvc.searchTodos({
      ...query,
      ...params,
    });
    setCount(data.data.total);
    setTodoListInfos(data.data.data);
  };
  useEffect(() => {
    if (account._id) {
      // searchTodos({ operatorBizId: '5f27d3175bca705163e554f4' });
      searchTodos({ operatorBizId: account._id });
    }
  }, [query, account, currentTab]);

  const providerValue = useMemo(() => {
    return {
      todoListInfos,
      setTodoListInfos,
      count,
      setCount,
      query,
      setQuery,
      currentTab,
      setCurrentTab,
      searchTodo,
    };
  }, [count, todoListInfos, query, currentTab]);

  return (
    <TodoListContext.Provider value={providerValue}>
      {children}
    </TodoListContext.Provider>
  );
};

export default TodoListContextProvider;
