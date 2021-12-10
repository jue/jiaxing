import React, { useContext, useState } from 'react';
import { ContractManageContext } from '../context/ContractManageContext';
import { FlowContext } from '../../../contexts/FlowContext';
import PreViewFile from '../../../components/FilePreview/temPreView';

function StepsModelFilesDetail() {
  const { auditContractDetail } = useContext(ContractManageContext);
  const { queryFileFillData } = useContext(FlowContext);
  const modelFile = auditContractDetail.modelFile;
  const [preViewFile, setPreViewFile] = useState<any>();

  return (
    <div>
      {modelFile.map((item: any, index) => (
        <div key={index} style={{ display: 'flex' }}>
          <div
            onClick={() => {
              queryFileFillData(
                auditContractDetail,
                item.bizFormId,
                item.bizFormName,
                setPreViewFile
              );
            }}
            style={{
              cursor: 'pointer',
            }}
          >
            {item.bizFormName}
          </div>
        </div>
      ))}
      <PreViewFile preViewFile={preViewFile} setPreViewFile={setPreViewFile} />
    </div>
  );
}

export default StepsModelFilesDetail;
