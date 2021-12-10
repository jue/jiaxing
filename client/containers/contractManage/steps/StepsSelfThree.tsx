import React, { useState, useContext, useEffect } from 'react';
import { Input, Row, Col, Button } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { componentsStyles } from '../style';
import { ContractManageContext } from '../context/ContractManageContext';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    row: {
      marginTop: 20,
    },
    label: {
      fontSize: 14,
      color: 'rgba(0,0,0,0.45)',
      fontWeight: 400,
      widtth: '30%',
      display: 'inline-block',
      position: 'relative',
      '& span:nth-of-type(1)': {
        color: 'rgb(250, 85, 85)',
        fontSize: 22,
        opacity: 1,
        position: 'relative',
        top: 7,
      },
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
  });
});

function StepsSelfThree() {
  const componentsClasses = componentsStyles({});
  const classes = useStyles({});
  const [open, setOpen] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const { contractMsg, setContractMsg } = useContext(ContractManageContext);

  return (
    <div>
      <Row gutter={{ xs: 12, md: 24 }}>
        <Col span={8}>
          <div className={componentsClasses.colSpan}>
            <span className={classes.label}>
              <span>*</span> 合同总金额:
            </span>
            <Input
              placeholder="请填写合同总金额"
              type="number"
              // defaultValue={Number(contractMsg.amount)}
              value={contractMsg.amount && Number(contractMsg.amount) / 10000}
              className={componentsClasses.input}
              onChange={e => {
                const { value } = e.target;
                setContractMsg({
                  ...contractMsg,
                  amount: Number(value) * 10000,
                });
              }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default StepsSelfThree;
