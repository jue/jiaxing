import React, { useContext } from 'react';
import { Row, Col } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { ContractManageContext } from '../context/ContractManageContext';
import { contractType } from '../enum';

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

function StepsContractTypeDetail() {
  const classes = useStyles({});
  const { auditContractDetail } = useContext(ContractManageContext);

  return (
    <div
      style={{
        marginLeft: 47,
        marginBottom: 20,
      }}
    >
      <Row gutter={{ xs: 12, md: 24 }}>
        {auditContractDetail.tendertype === 'public' && (
          <Col span={8}>
            <div>
              <span className={classes.label}>合同类型:</span>
              <span
                style={{
                  color: 'rgba(0,0,0,.45)',
                  fontSize: 14,
                }}
              >
                {contractType[auditContractDetail.contractType]}
              </span>
            </div>
          </Col>
        )}
        <Col span={8}>
          <div>
            <span className={classes.label}>
              <span>中标通知书:</span>
            </span>
            <span
              style={{
                color: 'rgba(0,0,0,.45)',
                fontSize: 14,
              }}
            >
              {auditContractDetail.letterAcceptance}
            </span>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default StepsContractTypeDetail;
