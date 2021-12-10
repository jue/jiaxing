import React, { useContext } from 'react';
import { Row, Col } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { ContractManageContext } from '../context/ContractManageContext';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
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

function StepsSelfThreeDetail() {
  const classes = useStyles({});
  const { auditContractDetail } = useContext(ContractManageContext);

  return (
    <div>
      <Row gutter={{ xs: 12, md: 24 }}>
        <Col span={24} style={{ marginTop: 44 }}>
          <div>
            <span className={classes.label}>合同总金额:</span>

            <span>{Number(auditContractDetail.amount) / 10000}</span>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default StepsSelfThreeDetail;
