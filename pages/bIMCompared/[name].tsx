import { useContext } from 'react';
import BIMCompared from '../../client/components/BIMCompared';
import LayoutIndexPage from '../../client/containers/layout/LayoutIndexPage';
import BIMComparedContextProvider, {
  BIMComparedContext,
} from '../../client/contexts/BIMComparedContext';

export default () => {
  // const { modelInfos } = useContext(BIMComparedContext);

  return (
    <LayoutIndexPage>
      <BIMComparedContextProvider>
        {/* <BIMCompared /> */}
      </BIMComparedContextProvider>
    </LayoutIndexPage>
  );
};
