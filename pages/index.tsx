import LayoutIndexPage from '../client/containers/layout/LayoutIndexPage';
// import ChangeList from '../client/containers/engineeringManage/changeList';
import WorkBenchManage from '../client/containers/workbench';

const TodoList = () => {
  return (
    <LayoutIndexPage>
      <WorkBenchManage />
    </LayoutIndexPage>
  );
};

export default TodoList;
