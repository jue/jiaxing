import React, { useState, useContext } from 'react';
import { Button } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { ContractManageContext } from '../context/ContractManageContext';
import AddTerms from './AddTerms';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    row: {
      marginTop: 20,
    },
    label: {
      fontSize: 14,
      color: '#000000',
      opacity: 0.45,
      fontWeight: 400,
      widtth: '30%',
      display: 'inline-block',
    },
    tenderRow: {
      margin: '48px 0',
    },
    amount: {
      margin: '48px 0',
    },
    subTitle: {
      fontSize: 10,
      display: 'block',
      marginTop: -6,
    },
    button: {
      margin: '47px 0 47px',
    },
    addIcon: {
      '& svg': {
        width: 24,
        height: 24,
        color: '#2BA3FD',
      },
    },
    item: {
      display: 'flex',
      alignItems: 'center',
    },
  });
});

function StepsFive() {
  const { contractMsg, setContractMsg } = useContext(ContractManageContext);

  return (
    <div>
      <AddTerms />
      <Button
        style={{ marginTop: 24, width: 130 }}
        onClick={() => {
          setContractMsg({
            ...contractMsg,
            payTerms: [
              ...contractMsg.payTerms,
              {
                payContent: '',
                payAmount: '',
                payPercentage: '',
                payTerms: '',
              },
            ],
          });
        }}
      >
        添加自定义条款
      </Button>
    </div>
  );
}

export default StepsFive;
