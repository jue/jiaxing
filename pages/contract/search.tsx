import LayoutIndexPage from '../../client/containers/layout/LayoutIndexPage';
import ListContract from '../../client/containers/contractManage/ListContract';
import FlowContextProvider from '../../client/contexts/FlowContext';

const ListContractPage = () => {
  return (
    <LayoutIndexPage>
      <FlowContextProvider>
        <ListContract />
      </FlowContextProvider>
    </LayoutIndexPage>
  );
};

export default ListContractPage;
