import React, { useState, useContext } from 'react';
import { Button } from 'antd';
import { ContractManageContext } from '../context/ContractManageContext';

function StepsSpecialTerms() {
  const { setSpecialTerms } = useContext(ContractManageContext);

  return (
    <div>
      <div>
        专用条款包括：项目规模及特征、项目承包范围、发包人委托承包人办理的工作、人员的任命于修改、工期延误承担的责任、工程量计算、争优创优的标准等
      </div>
      <Button
        style={{ marginTop: 24, width: 130 }}
        onClick={() => setSpecialTerms(true)}
      >
        点击查看
      </Button>
    </div>
  );
}

export default StepsSpecialTerms;
