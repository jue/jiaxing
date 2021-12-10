import LayoutIndexPage from '../../client/containers/layout/LayoutIndexPage';
import ApproveContract from '../../client/containers/contractManage/approveContract';
import FlowContextProvider from '../../client/contexts/FlowContext';

const ApproveContractPage = () => {
  return (
    <LayoutIndexPage>
      <FlowContextProvider>
        <ApproveContract />
      </FlowContextProvider>
    </LayoutIndexPage>
  );
};

export default ApproveContractPage;
