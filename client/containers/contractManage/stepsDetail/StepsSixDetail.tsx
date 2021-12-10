import React, { useContext, useState } from 'react';
import { ContractManageContext } from '../context/ContractManageContext';
import PreViewFileResource from '../../../components/FilePreview/PreViewFileResource';

function StepsSixDetail() {
  const { auditContractDetail } = useContext(ContractManageContext);
  const nodeFiles = auditContractDetail.nodeFiles;
  const [preViewFile, setPreViewFile] = useState({});

  return (
    <div>
      {auditContractDetail.nodeFiles &&
        nodeFiles.map((item: any, index) => (
          <div key={index} style={{ display: 'flex' }}>
            <div
              onClick={() => {
                setPreViewFile(item);
              }}
              style={{
                cursor: 'pointer',
              }}
            >
              {item.resourceName}
            </div>
            {/* <a
            href={`/api/file/${item.idFile}`}
            download
            style={{ color: '#000' }}
          >
            <IconButton size="small" style={{ marginLeft: 8 }}>
              <DownloadOutlined style={{ fontSize: 14 }} />
            </IconButton>
          </a> */}
          </div>
        ))}
      <PreViewFileResource
        preViewFile={preViewFile}
        setPreViewFile={setPreViewFile}
      />
    </div>
  );
}

export default StepsSixDetail;
