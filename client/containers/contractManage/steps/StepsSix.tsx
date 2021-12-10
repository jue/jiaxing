import React, { useContext } from 'react';
import FilesList from './FilesList';
import { ContractManageContext } from '../context/ContractManageContext';

function StepsSix() {
  const { saveFiles, vfileLists, contractMsg } = useContext(
    ContractManageContext
  );

  return (
    <div>
      <FilesList saveFiles={saveFiles} vfileLists={contractMsg.nodeFiles} />
    </div>
  );
}

export default StepsSix;
