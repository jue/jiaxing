import { useEffect, useState } from 'react';
import forgeSvc from '../../../../services/forgeSvc';

const ProgressManageModelIframe = () => {
  const [model, setModrl] = useState('');
  const handleQuery = async () => {
    const data = await forgeSvc.view('5f05d7e2bae7ea4d5b590b37&');
    setModrl(data);
  };
  useEffect(() => {
    handleQuery();
  }, []);
  return (
    <>
      <iframe
        frameBorder={0}
        style={{ width: '100%', height: '100%' }}
        allowFullScreen
        // src="http://203.91.43.208:4110/show-snapshot.html?dbHost=121.37.31.77:9193&eafID=FB47DDD37E50D5F400278E4084D4F4AC&renderHost=#/"
        src={model}
      />
    </>
  );
};

export default ProgressManageModelIframe;
