import React, { useContext } from 'react';
import { Input, Row, Col, Button } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import moment from 'moment';
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

function StepsFiveDetail() {
  const classes = useStyles({});
  const { auditContractDetail } = useContext(ContractManageContext);
  const payTerms = auditContractDetail.payTerms;

  return (
    <div>
      {auditContractDetail &&
        auditContractDetail.payTerms &&
        payTerms.map((item, index) => (
          <Row key={index}>
            <Row gutter={{ xs: 12, md: 24 }}>
              <Col span={8}>
                <div>
                  <span className={classes.label}>支付内容:</span>
                  <span>{item.payContent}</span>
                </div>
              </Col>
              <Col span={8}>
                <div>
                  <span className={classes.label}>支付金额:</span>
                  <span>{item.payAmount}</span>
                </div>
              </Col>
              <Col span={8}>
                <div>
                  <span className={classes.label}>支付占总额百分比(%):</span>
                  <span>{item.payPercentage}</span>
                </div>
              </Col>
            </Row>
            <Row gutter={{ xs: 12, md: 24 }}>
              <Col span={8}>
                <div>
                  <span className={classes.label}>支付条件:</span>
                  <span>{item.payTerms}</span>
                </div>
              </Col>
            </Row>
          </Row>
        ))}
    </div>
  );
}

export default StepsFiveDetail;
