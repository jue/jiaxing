import LayoutIndexPage from '../../client/containers/layout/LayoutIndexPage';
import SettingsIndex from '../../client/containers/document/documentIndex';
import DocumentContextProvider from '../../client/containers/document/DocumentContext';

const DocumentPage = () => {
  return (
    <LayoutIndexPage>
      <DocumentContextProvider idParent="dangan">
        <SettingsIndex />
      </DocumentContextProvider>
    </LayoutIndexPage>
  );
};

export default DocumentPage;
