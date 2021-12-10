import React, { useContext } from 'react';
import { Input, Row, Col, Button } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { ContractManageContext } from '../context/ContractManageContext';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    row: {
      marginTop: 48,
    },
    label: {
      fontSize: 14,
      color: '#000000',
      opacity: 0.45,
      fontWeight: 400,
      display: 'inline-block',
      width: 126,
    },
  });
});

function StepsPayeeInformationDetail() {
  const classes = useStyles({});
  const { auditContractDetail } = useContext(ContractManageContext);

  return (
    <Row gutter={{ xs: 12, md: 24 }} style={{ marginTop: 24 }}>
      <Col span={8}>
        <div>
          <span className={classes.label}>开户银行:</span>
          <span>{auditContractDetail.openAccountBank}</span>
        </div>
      </Col>
      <Col span={8}>
        <div>
          <span className={classes.label}>开户人:</span>
          <span>{auditContractDetail.openAccountPerson}</span>
        </div>
      </Col>
      <Col span={8}>
        <div>
          <span className={classes.label}>银行账号:</span>
          <span>{auditContractDetail.openAccount}</span>
        </div>
      </Col>
    </Row>
  );
}

export default StepsPayeeInformationDetail;
